import { apiClient } from "@/api/clients"
import type {
  CreatePermissionPayload,
  Permission,
  UpdatePermissionPayload,
} from "@/api/types"

export const permissionsService = {
  createPermission: async (
    payload: CreatePermissionPayload
  ): Promise<Permission> => {
    const res = await apiClient.post<any>("/permissions", { body: payload })
    return res?.data ?? res
  },

  getPermissions: async (): Promise<Permission[]> => {
    const res = await apiClient.get<any>("/permissions")
    return res?.data ?? res
  },

  getPermissionById: async (permissionId: string): Promise<Permission> => {
    const res = await apiClient.get<any>(`/permissions/${permissionId}`)
    return res?.data ?? res
  },

  updatePermission: async (
    permissionId: string,
    payload: UpdatePermissionPayload
  ): Promise<Permission> => {
    const res = await apiClient.patch<any>(`/permissions/${permissionId}`, {
      body: payload,
    })
    return res?.data ?? res
  },

  deletePermission: async (
    permissionId: string
  ): Promise<{ message?: string }> => {
    const res = await apiClient.delete<any>(`/permissions/${permissionId}`)
    return res?.data ?? res
  },
}
