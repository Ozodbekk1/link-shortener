import { apiClient } from "@/api/clients"
import type {
  CreateLinkPayload,
  Link,
  LinksListResponse,
  LinksQueryParams,
  PublicLinkResponse,
  UpdateLinkPayload,
} from "@/api/types"

export const linksService = {
  createLink: async (
    workspaceId: string,
    payload: CreateLinkPayload
  ): Promise<Link> => {
    const res = await apiClient.post<any>(`/${workspaceId}/links`, {
      body: payload,
    })
    return res?.data ?? res
  },

  getLinks: async (
    workspaceId: string,
    params?: LinksQueryParams
  ): Promise<LinksListResponse> => {
    const res = await apiClient.get<any>(`/${workspaceId}/links`, {
      query: params,
    })
    return res?.data ?? res
  },

  getLinkById: async (workspaceId: string, linkId: string): Promise<Link> => {
    const res = await apiClient.get<any>(`/${workspaceId}/links/${linkId}`)
    return res?.data ?? res
  },

  updateLink: async (
    workspaceId: string,
    linkId: string,
    payload: UpdateLinkPayload
  ): Promise<Link> => {
    const res = await apiClient.patch<any>(`/${workspaceId}/links/${linkId}`, {
      body: payload,
    })
    return res?.data ?? res
  },

  deleteLink: async (workspaceId: string, linkId: string): Promise<void> => {
    return apiClient.delete<void>(`/${workspaceId}/links/${linkId}`)
  },

  getLinkBySlug: async (slug: string): Promise<PublicLinkResponse> => {
    const res = await apiClient.get<any>(`/links/slug/${slug}`)
    return res?.data ?? res
  },
}
