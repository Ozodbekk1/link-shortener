import { apiClient } from "@/api/clients"
import type {
  AnalyticsOverview,
  CountryAnalyticsItem,
  DeviceAnalyticsResponse,
  RealtimeAnalyticsItem,
  SingleLinkAnalyticsResponse,
} from "@/api/types"

export const analyticsService = {
  getOverview: async (workspaceId: string): Promise<AnalyticsOverview> => {
    const res = await apiClient.get<any>(
      `/${workspaceId}/links/analytics/overview`
    )
    return res?.data ?? res
  },

  getRealtime: async (
    workspaceId: string
  ): Promise<RealtimeAnalyticsItem[]> => {
    const res = await apiClient.get<any>(
      `/${workspaceId}/links/analytics/realtime`
    )
    return res?.data ?? res
  },

  getCountries: async (
    workspaceId: string
  ): Promise<CountryAnalyticsItem[]> => {
    const res = await apiClient.get<any>(
      `/${workspaceId}/links/analytics/countries`
    )
    return res?.data ?? res
  },

  getDevices: async (workspaceId: string): Promise<DeviceAnalyticsResponse> => {
    const res = await apiClient.get<any>(
      `/${workspaceId}/links/analytics/devices`
    )
    return res?.data ?? res
  },

  getSingleLinkAnalytics: async (
    workspaceId: string,
    linkId: string
  ): Promise<SingleLinkAnalyticsResponse> => {
    const res = await apiClient.get<any>(
      `/${workspaceId}/links/${linkId}/analytics`
    )
    return res?.data ?? res
  },
}
