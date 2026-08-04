"use client"

import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/api/query-keys"
import { analyticsService } from "@/services/analytics.service"

const useWorkspaceQuery = <T>(
  key: readonly unknown[],
  workspaceId: string,
  queryFn: () => Promise<T>
) => useQuery({ queryKey: key, queryFn, enabled: Boolean(workspaceId) })

export const useAnalyticsOverviewQuery = (workspaceId: string) =>
  useWorkspaceQuery(
    queryKeys.analytics.overview(workspaceId),
    workspaceId,
    () => analyticsService.getOverview(workspaceId)
  )

export const useRealtimeAnalyticsQuery = (workspaceId: string) =>
  useWorkspaceQuery(
    queryKeys.analytics.realtime(workspaceId),
    workspaceId,
    () => analyticsService.getRealtime(workspaceId)
  )

export const useCountriesAnalyticsQuery = (workspaceId: string) =>
  useWorkspaceQuery(
    queryKeys.analytics.countries(workspaceId),
    workspaceId,
    () => analyticsService.getCountries(workspaceId)
  )

export const useDevicesAnalyticsQuery = (workspaceId: string) =>
  useWorkspaceQuery(queryKeys.analytics.devices(workspaceId), workspaceId, () =>
    analyticsService.getDevices(workspaceId)
  )

export const useRecentClickActivityQuery = (workspaceId: string, limit = 25) =>
  useWorkspaceQuery(
    queryKeys.analytics.activity(workspaceId, limit),
    workspaceId,
    () => analyticsService.getRecentActivity(workspaceId, limit)
  )
