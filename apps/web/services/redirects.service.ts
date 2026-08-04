import { apiClient } from "@/api/clients"
import type {
  PreviewRedirectRulesResponse,
  RedirectQueryParams,
  ValidateRedirectResponse,
} from "@/api/types"

export const redirectsService = {
  getRedirectUrl: (slug: string, params?: RedirectQueryParams): string => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""
    const query = params?.password
      ? `?password=${encodeURIComponent(params.password)}`
      : ""
    return `${baseUrl}/r/${slug}${query}`
  },

  validateRedirect: async (
    slug: string,
    params?: RedirectQueryParams
  ): Promise<ValidateRedirectResponse> => {
    const res = await apiClient.get<any>(`/redirect/${slug}`, {
      query: params,
    })
    return res?.data ?? res
  },

  previewRedirectRules: async (
    slug: string,
    params?: RedirectQueryParams
  ): Promise<PreviewRedirectRulesResponse> => {
    const res = await apiClient.get<any>(`/redirect/rules/${slug}`, {
      query: params,
    })
    return res?.data ?? res
  },
}
