"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/api/query-keys"
import type {
  GenerateQrPayload,
  QrQueryParams,
  UpdateQrPayload,
} from "@/api/types"
import { qrService } from "@/services/qr.service"

export const useQrCodesQuery = (workspaceId: string, params?: QrQueryParams) =>
  useQuery({
    queryKey: queryKeys.qr.all(workspaceId, params as Record<string, unknown>),
    queryFn: () => qrService.getQrCodes(workspaceId, params),
    enabled: Boolean(workspaceId),
  })

export const useGenerateQrMutation = (workspaceId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: GenerateQrPayload) =>
      qrService.generateQr(workspaceId, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.qr.all(workspaceId),
      }),
  })
}

export const useUpdateQrMutation = (workspaceId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ qrId, payload }: { qrId: string; payload: UpdateQrPayload }) =>
      qrService.updateQr(workspaceId, qrId, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.qr.all(workspaceId),
      }),
  })
}
