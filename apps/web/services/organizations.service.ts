import { apiClient } from "@/api/clients"
import type {
  CreateOrganizationPayload,
  OrganizationDetailResponse,
  OrganizationMembersQueryParams,
  OrganizationMembersResponse,
  OrganizationsListResponse,
} from "@/api/types"

export const organizationsService = {
  createOrganization: async (payload: CreateOrganizationPayload) => {
    const res = await apiClient.post<any>("/organizations", { body: payload })
    return res?.data ?? res
  },

  getAllOrganizations: async (): Promise<OrganizationsListResponse> => {
    const res = await apiClient.get<any>("/organizations")
    return res?.data ?? res
  },

  getOrganizationById: async (
    organizationId: string
  ): Promise<OrganizationDetailResponse> => {
    const res = await apiClient.get<any>(`/organizations/${organizationId}`)
    return res?.data ?? res
  },

  getOrganizationMembers: async (
    organizationId: string,
    params?: OrganizationMembersQueryParams
  ): Promise<OrganizationMembersResponse> => {
    const res = await apiClient.get<any>(
      `/organizations/${organizationId}/members`,
      { query: params }
    )
    return res?.data ?? res
  },

  deleteOrganization: async (organizationId: string) => {
    const res = await apiClient.delete<any>(`/organizations/${organizationId}`)
    return res?.data ?? res
  },
}
