import type {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios"
import axios from "axios"
import type { ApiErrorPayload, QueryParams } from "./types"

export class ApiError extends Error {
  status: number
  data: ApiErrorPayload | null

  constructor(message: string, status: number, data: ApiErrorPayload | null) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

export interface RequestOptions {
  query?: QueryParams
  body?: unknown
  headers?: AxiosRequestConfig["headers"]
  signal?: AbortSignal
}

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const appendQueryValue = (
  searchParams: URLSearchParams,
  key: string,
  value: unknown
) => {
  if (
    value === null ||
    value === undefined ||
    typeof value === "object" ||
    typeof value === "function"
  ) {
    return
  }

  searchParams.append(key, String(value))
}

const buildSearchParams = (query?: QueryParams): URLSearchParams => {
  const searchParams = new URLSearchParams()

  if (!query) {
    return searchParams
  }

  Object.entries(query as Record<string, unknown>).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => appendQueryValue(searchParams, key, item))
      return
    }

    appendQueryValue(searchParams, key, value)
  })

  return searchParams
}

const toApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorPayload>
    const status = axiosError.response?.status ?? 0
    const data = axiosError.response?.data ?? null

    return new ApiError(
      data?.message || axiosError.message || "Request failed",
      status,
      data
    )
  }

  return new ApiError("Unknown request error", 0, null)
}

const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: { Accept: "application/json" },
})

let refreshPromise: Promise<void> | null = null

/**
 * Callback invoked when token refresh fails (expired/invalid refresh token).
 * Set by AuthProvider to trigger logout + redirect without circular imports.
 */
let onRefreshFailure: (() => void) | null = null

export function setOnRefreshFailure(callback: () => void) {
  onRefreshFailure = callback
}

export function clearOnRefreshFailure() {
  onRefreshFailure = null
}

const shouldSkipRefresh = (url?: string) => {
  if (!url) {
    return true
  }

  return [
    "/jwt/auth/login",
    "/jwt/auth/register",
    "/jwt/auth/verify-email",
    "/jwt/auth/refresh",
    "/jwt/auth/forgot-password",
    "/jwt/auth/reset-password",
  ].some((path) => url.includes(path))
}

apiInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorPayload>) => {
    const status = error.response?.status
    const originalConfig = error.config as RetriableRequestConfig | undefined

    if (!originalConfig || status !== 401 || originalConfig._retry) {
      throw toApiError(error)
    }

    if (shouldSkipRefresh(originalConfig.url)) {
      throw toApiError(error)
    }

    originalConfig._retry = true

    try {
      if (!refreshPromise) {
        refreshPromise = apiInstance.post("/jwt/auth/refresh").then(() => {
          return
        })
      }

      await refreshPromise
      return apiInstance.request(originalConfig)
    } catch (refreshError) {
      // Refresh token is expired/invalid — trigger logout
      if (onRefreshFailure) {
        onRefreshFailure()
      }
      throw toApiError(refreshError)
    } finally {
      refreshPromise = null
    }
  }
)

async function request<T>(
  method: AxiosRequestConfig["method"],
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, query, headers, signal } = options

  try {
    const response = await apiInstance.request<T>({
      method,
      url: path,
      data: body,
      params: query,
      headers,
      signal,
      paramsSerializer: {
        serialize: () => buildSearchParams(query).toString(),
      },
    })

    return response.data
  } catch (error) {
    throw toApiError(error)
  }
}

export const apiClient = {
  get: <T>(path: string, options?: Omit<RequestOptions, "body">) =>
    request<T>("GET", path, options),
  post: <T>(path: string, options?: RequestOptions) =>
    request<T>("POST", path, options),
  put: <T>(path: string, options?: RequestOptions) =>
    request<T>("PUT", path, options),
  patch: <T>(path: string, options?: RequestOptions) =>
    request<T>("PATCH", path, options),
  delete: <T>(
    path: string,
    options?: Omit<RequestOptions, "body"> & { body?: unknown }
  ) => request<T>("DELETE", path, options),
}
