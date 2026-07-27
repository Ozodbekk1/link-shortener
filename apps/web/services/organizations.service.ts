import { apiClient } from "@/api/clients"
import type {
  CreateOrganizationPayload,
  OrganizationDetailResponse,
  OrganizationMembersQueryParams,
  OrganizationMembersResponse,
  OrganizationsListResponse,
} from "@/api/types"

export const organizationsService = {
  createOrganization: (payload: CreateOrganizationPayload) =>
    apiClient.post<{
      id: string
      name: string
      slug: string
      ownerId: string
      createdAt: string
    }>("/organizations", { body: payload }),

  getAllOrganizations: () =>
    apiClient.get<OrganizationsListResponse>("/organizations"),

  getOrganizationById: (organizationId: string) =>
    apiClient.get<OrganizationDetailResponse>(
      `/organizations/${organizationId}`
    ),

  getOrganizationMembers: (
    organizationId: string,
    params?: OrganizationMembersQueryParams
  ) =>
    apiClient.get<OrganizationMembersResponse>(
      `/organizations/${organizationId}/members`,
      { query: params }
    ),

  deleteOrganization: (organizationId: string) =>
    apiClient.delete<{ message: string }>(`/organizations/${organizationId}`),
}
