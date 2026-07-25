import { apiClient } from "@/api/clients"
import type { AppUser } from "@/api/types"

export interface RegisterPayload {
  fullName: string
  email: string
  password: string
}

export interface VerifyOtpPayload {
  email: string
  otp: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  email: string
  otp: string
  newPassword: string
}

export interface UpdateMePayload {
  fullName?: string
  username?: string
  photoUrl?: string
  bio?: string
  avatar?: string
  profileBg?: string
}

export interface DeleteMePayload {
  password: string
  reason?: string
}

export interface TelegramLoginPayload {
  [key: string]: unknown
}

export const authService = {
  register: (payload: RegisterPayload) =>
    apiClient.post<{ message: string }>("/jwt/auth/register", {
      body: payload,
    }),
  verifyOtp: (payload: VerifyOtpPayload) =>
    apiClient.post<{ message: string }>("/jwt/auth/verify-email", {
      body: payload,
    }),
  login: (payload: LoginPayload) =>
    apiClient.post<{ message: string }>("/jwt/auth/login", { body: payload }),
  refreshToken: () =>
    apiClient.post<{ message: string }>("/jwt/auth/refresh"),
  logout: () => apiClient.post<{ message: string }>("/jwt/auth/logout"),
  forgotPassword: (payload: ForgotPasswordPayload) =>
    apiClient.post<{ message: string }>("/jwt/auth/forgot-password", {
      body: payload,
    }),
  resetPassword: (payload: ResetPasswordPayload) =>
    apiClient.post<{ message: string }>("/jwt/auth/reset-password", {
      body: payload,
    }),
  me: async (): Promise<AppUser> => {
    const response = await apiClient.get<AppUser & { user?: AppUser }>(
      "/jwt/auth/me"
    )
    return (response?.user ?? response) as AppUser
  },
  googleAuthUrl: () =>
    `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/google/auth`,
  telegramLogin: (payload: TelegramLoginPayload) =>
    apiClient.post<{ message: string }>("/telegram/auth/login", {
      body: payload,
    }),
  updateMe: (payload: UpdateMePayload) =>
    apiClient.patch<AppUser>("/jwt/auth/me", { body: payload }),
  deleteMe: (payload: DeleteMePayload) =>
    apiClient.delete<AppUser>("/jwt/auth/me", { body: payload }),
}
