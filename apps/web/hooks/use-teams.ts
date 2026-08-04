"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/api/query-keys"
import type { CreateTeamPayload, TeamsQueryParams } from "@/api/types"
import { teamsService } from "@/services/team.service"

export const useTeamsQuery = (workspaceId: string, params?: TeamsQueryParams) =>
  useQuery({
    queryKey: queryKeys.teams.all(
      workspaceId,
      params as Record<string, unknown>
    ),
    queryFn: () => teamsService.getTeams(workspaceId, params),
    enabled: Boolean(workspaceId),
  })

export const useCreateTeamMutation = (workspaceId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateTeamPayload) =>
      teamsService.createTeam(workspaceId, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.teams.all(workspaceId),
      }),
  })
}
