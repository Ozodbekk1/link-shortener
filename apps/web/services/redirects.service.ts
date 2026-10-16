import { apiClient } from "@/api/clients"
import type {
  PreviewRedirectRulesResponse,
  RedirectQueryParams,
  ValidateRedirectResponse,
} from "@/api/types"

export const redirectsService = {
  getRedirectUrl: (slug: string, params?: RedirectQueryParams): string => {
    const baseUrl = getRedirectApiBaseUrl()
    const query = params?.password
      ? `?password=${encodeURIComponent(params.password)}`
      : ""
    const path = baseUrl
      ? `${baseUrl}/api/r/${encodeURIComponent(slug)}`
      : `/api/r/${encodeURIComponent(slug)}`
    return `${path}${query}`
  },

  validateRedirect: async (
    slug: string,
    params?: RedirectQueryParams
  ): Promise<ValidateRedirectResponse> => {
    const base = getRedirectApiBaseUrl()
    const endpoint = base
      ? `${base}/api/redirect/${encodeURIComponent(slug)}`
      : `/api/redirect/${encodeURIComponent(slug)}`
    const res = await apiClient.get<any>(endpoint, {
      query: params,
    })
    return res?.data ?? res
  },

  previewRedirectRules: async (
    slug: string,
    params?: RedirectQueryParams
  ): Promise<PreviewRedirectRulesResponse> => {
    const base = getRedirectApiBaseUrl()
    const endpoint = base
      ? `${base}/api/redirect/rules/${encodeURIComponent(slug)}`
      : `/api/redirect/rules/${encodeURIComponent(slug)}`
    const res = await apiClient.get<any>(endpoint, {
      query: params,
    })
    return res?.data ?? res
  },
}

function getRedirectApiBaseUrl(): string {
  if (typeof window === "undefined" && process.env.API_URL) {
    return process.env.API_URL.replace(/\/+$/, "")
  }
  const configuredUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

  try {
    return new URL(configuredUrl).origin
  } catch {
    return configuredUrl.replace(/\/api\/v\d+\/?$/, "")
  }
}
