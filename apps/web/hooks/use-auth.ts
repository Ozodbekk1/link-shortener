"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/api/query-keys"
import {
  authService,
  // type DeleteMePayload,
  type ForgotPasswordPayload,
  type LoginPayload,
  type RegisterPayload,
  type ResetPasswordPayload,
  // type UpdateMePayload,
  type VerifyOtpPayload,
} from "@/services/auth.service"

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
  })

export const useVerifyOtpMutation = () =>
  useMutation({
    mutationFn: (payload: VerifyOtpPayload) => authService.verifyOtp(payload),
  })

export const useLoginMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.me })
    },
  })
}

export const useTelegramLoginMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authService.telegramLogin,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.me })
    },
  })
}

export const useRefreshTokenMutation = () =>
  useMutation({ mutationFn: authService.refreshToken })

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: async () => {
      queryClient.setQueryData(queryKeys.users.me, null)
    },
  })
}

export const useForgotPasswordMutation = () =>
  useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      authService.forgotPassword(payload),
  })

export const useResetPasswordMutation = () =>
  useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      authService.resetPassword(payload),
  })

// export const useUpdateMeMutation = () => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: (payload: UpdateMePayload) => authService.updateMe(payload),
//     onSuccess: async () => {
//       await queryClient.invalidateQueries({ queryKey: queryKeys.auth.me })
//     },
//   })
// }

// export const useDeleteMeMutation = () => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: (payload: DeleteMePayload) => authService.deleteMe(payload),
//     onSuccess: async () => {
//       await queryClient.removeQueries({ queryKey: queryKeys.auth.me })
//     },
//   })
// }
