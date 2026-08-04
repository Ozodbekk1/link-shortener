import { apiClient } from "@/api/clients"
import type {
  AddTeamMemberPayload,
  CreateTeamPayload,
  Team,
  TeamMember,
  TeamsListResponse,
  TeamsQueryParams,
  UpdateTeamMemberPayload,
} from "@/api/types"

export const teamsService = {
  createTeam: async (
    workspaceId: string,
    payload: CreateTeamPayload
  ): Promise<Team> => {
    const res = await apiClient.post<any>(`/workspaces/${workspaceId}/teams`, {
      body: payload,
    })
    return res?.data ?? res
  },

  getTeams: async (
    workspaceId: string,
    params?: TeamsQueryParams
  ): Promise<TeamsListResponse> => {
    const res = await apiClient.get<any>(`/workspaces/${workspaceId}/teams`, {
      query: params,
    })
    return res?.data ?? res
  },

  getTeamById: async (workspaceId: string, teamId: string): Promise<Team> => {
    const res = await apiClient.get<any>(
      `/workspaces/${workspaceId}/teams/${teamId}`
    )
    return res?.data ?? res
  },
}

export const teamMembersService = {
  addMember: async (
    teamId: string,
    payload: AddTeamMemberPayload
  ): Promise<TeamMember> => {
    const res = await apiClient.post<any>(`/teams/${teamId}/members`, {
      body: payload,
    })
    return res?.data ?? res
  },

  getMembers: async (teamId: string): Promise<TeamMember[]> => {
    const res = await apiClient.get<any>(`/teams/${teamId}/members`)
    return res?.data ?? res
  },

  updateMemberRole: async (
    teamId: string,
    memberId: string,
    payload: UpdateTeamMemberPayload
  ): Promise<TeamMember> => {
    const res = await apiClient.patch<any>(
      `/teams/${teamId}/members/${memberId}`,
      { body: payload }
    )
    return res?.data ?? res
  },

  removeMember: async (
    teamId: string,
    memberId: string
  ): Promise<TeamMember> => {
    const res = await apiClient.delete<any>(
      `/teams/${teamId}/members/${memberId}`
    )
    return res?.data ?? res
  },
}
