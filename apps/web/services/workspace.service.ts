import { apiClient } from "@/api/clients"
import type {
  CreateWorkspacePayload,
  DeleteWorkspaceResponse,
  Workspace,
  WorkspacesListResponse,
  WorkspacesQueryParams,
} from "@/api/types"

export const workspacesService = {
  createWorkspace: async (
    organizationId: string,
    payload: CreateWorkspacePayload
  ): Promise<Workspace> => {
    const res = await apiClient.post<any>(
      `/workspaces/${organizationId}/workspaces`,
      { body: payload }
    )
    return res?.data ?? res
  },

  getWorkspaces: async (
    organizationId: string,
    params?: WorkspacesQueryParams
  ): Promise<WorkspacesListResponse> => {
    const res = await apiClient.get<any>(
      `/workspaces/${organizationId}/workspaces`,
      { query: params }
    )
    return res?.data ?? res
  },

  getWorkspaceById: async (
    organizationId: string,
    workspaceId: string
  ): Promise<Workspace> => {
    const res = await apiClient.get<any>(
      `/workspaces/${organizationId}/workspaces/${workspaceId}`
    )
    return res?.data ?? res
  },

  deleteWorkspace: async (
    organizationId: string,
    workspaceId: string
  ): Promise<DeleteWorkspaceResponse> => {
    const res = await apiClient.delete<any>(
      `/workspaces/${organizationId}/workspaces/${workspaceId}`
    )
    return res?.data ?? res
  },
}
