"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/api/query-keys"
import type { CreateWorkspacePayload, WorkspacesQueryParams } from "@/api/types"
import { workspacesService } from "@/services/workspace.service"

export const useWorkspacesQuery = (
  organizationId: string,
  params?: WorkspacesQueryParams
) =>
  useQuery({
    queryKey: queryKeys.workspaces.all(
      organizationId,
      params as Record<string, unknown>
    ),
    queryFn: () => workspacesService.getWorkspaces(organizationId, params),
    enabled: Boolean(organizationId),
  })

export const useCreateWorkspaceMutation = (organizationId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateWorkspacePayload) =>
      workspacesService.createWorkspace(organizationId, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.workspaces.all(organizationId),
      }),
  })
}
