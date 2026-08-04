"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/api/query-keys"
import type {
  CreateLinkPayload,
  LinksQueryParams,
  UpdateLinkPayload,
} from "@/api/types"
import { linksService } from "@/services/link.service"

export const useLinksQuery = (workspaceId: string, params?: LinksQueryParams) =>
  useQuery({
    queryKey: queryKeys.links.all(
      workspaceId,
      params as Record<string, unknown>
    ),
    queryFn: () => linksService.getLinks(workspaceId, params),
    enabled: Boolean(workspaceId),
  })

export const useCreateLinkMutation = (workspaceId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateLinkPayload) =>
      linksService.createLink(workspaceId, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.links.all(workspaceId),
      }),
  })
}

export const useUpdateLinkMutation = (workspaceId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      linkId,
      payload,
    }: {
      linkId: string
      payload: UpdateLinkPayload
    }) => linksService.updateLink(workspaceId, linkId, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.links.all(workspaceId),
      }),
  })
}

export const useDeleteLinkMutation = (workspaceId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (linkId: string) =>
      linksService.deleteLink(workspaceId, linkId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.links.all(workspaceId),
      }),
  })
}
