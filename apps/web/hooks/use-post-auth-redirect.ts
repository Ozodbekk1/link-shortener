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

/**
 * Reusable hook for executing post-authentication redirection.
 *
 * Guaranteed flow:
 * 1. Fetches or uses existing GET /api/v1/users/me response.
 * 2. Evaluates organization existence.
 * 3. Redirects to /onboarding/organization or https://{slug}.uurl.uz/dashboard.
 * 4. Never relies on client state or cookies.
 */
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
        // Fetch fresh profile directly from GET /users/me
        profileData = await usersService.getMyProfile()
        // Update query cache
        queryClient.setQueryData(queryKeys.users.me, profileData)
      }

      // Flexibly unwrap user in case of nested interceptor data
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
