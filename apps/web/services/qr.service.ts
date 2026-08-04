import { apiClient } from "@/api/clients"
import type {
  GenerateQrPayload,
  GenerateQrResponse,
  QrCode,
  QrListResponse,
  QrQueryParams,
  UpdateQrPayload,
} from "@/api/types"

export const qrService = {
  generateQr: async (
    workspaceId: string,
    payload: GenerateQrPayload
  ): Promise<GenerateQrResponse> => {
    const res = await apiClient.post<any>(`/${workspaceId}/qr`, {
      body: payload,
    })
    return res?.data ?? res
  },

  getQrCodes: async (
    workspaceId: string,
    params?: QrQueryParams
  ): Promise<QrListResponse> => {
    const res = await apiClient.get<any>(`/${workspaceId}/qr`, {
      query: params,
    })
    return res?.data ?? res
  },

  getQrById: async (workspaceId: string, qrId: string): Promise<QrCode> => {
    const res = await apiClient.get<any>(`/${workspaceId}/qr/${qrId}`)
    return res?.data ?? res
  },

  getQrImageUrl: (workspaceId: string, qrId: string): string => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""
    return `${baseUrl}/${workspaceId}/qr/${qrId}/image`
  },

  getQrDownloadUrl: (workspaceId: string, qrId: string): string => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""
    return `${baseUrl}/${workspaceId}/qr/${qrId}/download`
  },

  updateQr: async (
    workspaceId: string,
    qrId: string,
    payload: UpdateQrPayload
  ): Promise<GenerateQrResponse> => {
    const res = await apiClient.patch<any>(`/${workspaceId}/qr/${qrId}`, {
      body: payload,
    })
    return res?.data ?? res
  },

  deleteQr: async (
    workspaceId: string,
    qrId: string
  ): Promise<{ message: string }> => {
    const res = await apiClient.delete<any>(`/${workspaceId}/qr/${qrId}`)
    return res?.data ?? res
  },
}
