"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/api/query-keys"
import type {
  CreateOrganizationPayload,
  OrganizationMembersQueryParams,
} from "@/api/types"
import { organizationsService } from "@/services/organizations.service"

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

export const useOrganizationsQuery = () =>
  useQuery({
    queryKey: queryKeys.organizations.all,
    queryFn: () => organizationsService.getAllOrganizations(),
  })

export const useOrganizationByIdQuery = (organizationId: string) =>
  useQuery({
    queryKey: queryKeys.organizations.byId(organizationId),
    queryFn: () => organizationsService.getOrganizationById(organizationId),
    enabled: !!organizationId,
  })

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
