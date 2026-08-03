"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useLocale } from "@/hooks/use-locale"
import { usersService } from "@/services/users.service"
import { queryKeys } from "@/api/query-keys"
import {
  executeRedirect,
  resolvePostAuthRedirect,
} from "@/lib/auth/post-auth-redirect"
import type { UserProfileResponse } from "@/api/types"

export function usePostAuthRedirect() {
  const locale = useLocale()
  const queryClient = useQueryClient()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handleRedirect = async (existingProfile?: UserProfileResponse) => {
    setIsRedirecting(true)
    setError(null)

    try {
      let profileData = existingProfile

      if (!profileData) {
        profileData = await usersService.getMyProfile()
        queryClient.setQueryData(queryKeys.users.me, profileData)
      }

      const user =
        profileData?.user ??
        (profileData as any)?.data?.user ??
        (profileData as any)?.data ??
        profileData

      if (!user || (!user.id && !user.email)) {
        throw new Error("Failed to load user profile after authentication.")
      }

      const redirectTarget = resolvePostAuthRedirect(user, locale)
      executeRedirect(redirectTarget)
    } catch (err) {
      setIsRedirecting(false)
      const errorObj =
        err instanceof Error ? err : new Error("Post-auth routing failed")
      setError(errorObj)
      throw errorObj
    }
  }

  return {
    handleRedirect,
    isRedirecting,
    error,
  }
}
