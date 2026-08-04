import { apiClient } from "@/api/clients"
import type {
  AdminDailyStatsResponse,
  AdminDashboardOverview,
  AdminDeviceAnalyticsResponse,
  AdminLinksQueryParams,
  AdminOrganizationsQueryParams,
  AdminTopLinksQueryParams,
  AdminUsersQueryParams,
} from "@/api/types"

export const adminService = {
  getDashboardOverview: async (): Promise<AdminDashboardOverview> => {
    const res = await apiClient.get<any>("/admin/dashboard/overview")
    return res?.data ?? res
  },

  getDailyStats: async (days = 30): Promise<AdminDailyStatsResponse> => {
    const res = await apiClient.get<any>("/admin/dashboard/daily-stats", {
      query: { days },
    })
    return res?.data ?? res
  },

  getUsers: async (params?: AdminUsersQueryParams): Promise<any> => {
    const res = await apiClient.get<any>("/admin/users", { query: params })
    return res?.data ?? res
  },

  updateUserStatus: async (
    userId: string,
    status: "PENDING" | "ACTIVE" | "SUSPENDED" | "DELETED"
  ): Promise<any> => {
    const res = await apiClient.patch<any>(`/admin/users/${userId}/status`, {
      query: { status },
    })
    return res?.data ?? res
  },

  getLinks: async (params?: AdminLinksQueryParams): Promise<any> => {
    const res = await apiClient.get<any>("/admin/links", { query: params })
    return res?.data ?? res
  },

  getOrganizations: async (
    params?: AdminOrganizationsQueryParams
  ): Promise<any> => {
    const res = await apiClient.get<any>("/admin/organizations", {
      query: params,
    })
    return res?.data ?? res
  },

  getTopLinks: async (params?: AdminTopLinksQueryParams): Promise<any> => {
    const res = await apiClient.get<any>("/admin/analytics/top-links", {
      query: params,
    })
    return res?.data ?? res
  },

  getDeviceAnalytics: async (): Promise<AdminDeviceAnalyticsResponse> => {
    const res = await apiClient.get<any>("/admin/analytics/devices")
    return res?.data ?? res
  },
}
