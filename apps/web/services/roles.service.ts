import { apiClient } from "@/api/clients"
import type {
  AssignRolePayload,
  CreateRolePayload,
  Role,
  RolesQueryParams,
  UpdateRolePayload,
} from "@/api/types"

export const rolesService = {
  createRole: async (payload: CreateRolePayload): Promise<Role> => {
    const res = await apiClient.post<any>("/roles/create", { body: payload })
    return res?.data ?? res
  },

  getRoles: async (params: RolesQueryParams): Promise<Role[]> => {
    const res = await apiClient.get<any>("/roles", { query: params })
    return res?.data ?? res
  },

  updateRole: async (
    roleId: string,
    payload: UpdateRolePayload
  ): Promise<Role> => {
    const res = await apiClient.patch<any>(`/roles/update/${roleId}`, {
      body: payload,
    })
    return res?.data ?? res
  },

  deleteRole: async (roleId: string): Promise<{ message?: string }> => {
    const res = await apiClient.delete<any>(`/roles/delete/${roleId}`)
    return res?.data ?? res
  },

  assignRole: async (
    payload: AssignRolePayload
  ): Promise<{ message?: string }> => {
    const res = await apiClient.post<any>("/roles/assign", { body: payload })
    return res?.data ?? res
  },
}
