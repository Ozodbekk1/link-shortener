"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/api/query-keys"
import type {
  CreateOrganizationPayload,
  OrganizationMembersQueryParams,
} from "@/api/types"
import { organizationsService } from "@/services/organizations.service"

/**
 * POST /api/v1/organizations
 * Create a new organization.
 * Usage: const { mutate, isPending } = useCreateOrganizationMutation()
 */
export const useCreateOrganizationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateOrganizationPayload) =>
      organizationsService.createOrganization(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.all,
      })
    },
  })
}

/**
 * GET /api/v1/organizations
 * List all organizations for the authenticated user.
 * Usage: const { data, isLoading } = useOrganizationsQuery()
 */
export const useOrganizationsQuery = () =>
  useQuery({
    queryKey: queryKeys.organizations.all,
    queryFn: () => organizationsService.getAllOrganizations(),
  })

/**
 * GET /api/v1/organizations/:organizationId
 * Get organization details by ID.
 * Usage: const { data, isLoading } = useOrganizationByIdQuery("org-uuid")
 */
export const useOrganizationByIdQuery = (organizationId: string) =>
  useQuery({
    queryKey: queryKeys.organizations.byId(organizationId),
    queryFn: () => organizationsService.getOrganizationById(organizationId),
    enabled: !!organizationId,
  })

/**
 * GET /api/v1/organizations/:organizationId/members
 * Get members of an organization.
 * Usage: const { data, isLoading } = useOrganizationMembersQuery("org-uuid", { page: 1, limit: 20 })
 */
export const useOrganizationMembersQuery = (
  organizationId: string,
  params?: OrganizationMembersQueryParams
) =>
  useQuery({
    queryKey: queryKeys.organizations.members(
      organizationId,
      params as Record<string, unknown>
    ),
    queryFn: () =>
      organizationsService.getOrganizationMembers(organizationId, params),
    enabled: !!organizationId,
  })

/**
 * DELETE /api/v1/organizations/:organizationId
 * Delete an organization (OWNER only).
 * Usage: const { mutate, isPending } = useDeleteOrganizationMutation()
 */
export const useDeleteOrganizationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (organizationId: string) =>
      organizationsService.deleteOrganization(organizationId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.all,
      })
    },
  })
}
