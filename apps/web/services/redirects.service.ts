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
    return `${baseUrl}/r/${encodeURIComponent(slug)}${query}`
  },

  validateRedirect: async (
    slug: string,
    params?: RedirectQueryParams
  ): Promise<ValidateRedirectResponse> => {
    const res = await apiClient.get<any>(
      `${getRedirectApiBaseUrl()}/redirect/${encodeURIComponent(slug)}`,
      {
      query: params,
      }
    )
    return res?.data ?? res
  },

  previewRedirectRules: async (
    slug: string,
    params?: RedirectQueryParams
  ): Promise<PreviewRedirectRulesResponse> => {
    const res = await apiClient.get<any>(
      `${getRedirectApiBaseUrl()}/redirect/rules/${encodeURIComponent(slug)}`,
      {
      query: params,
      }
    )
    return res?.data ?? res
  },
}

function getRedirectApiBaseUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

  try {
    return new URL(configuredUrl).origin
  } catch {
    return configuredUrl.replace(/\/api\/v\d+\/?$/, "")
  }
}
