"use client"

import React, { useEffect } from "react"
import { usePostAuthRedirect } from "@/hooks/use-post-auth-redirect"
import { FullscreenLoader } from "@/components/auth/fullscreen-loader"
import { toast } from "sonner"

/**
 * Google OAuth Callback handler page.
 *
 * Executed after the backend redirects back from Google OAuth consent.
 * Immediately invokes handleRedirect() which:
 * 1. Sends GET /api/v1/users/me
 * 2. Waits for response
 * 3. Redirects to onboarding (/onboarding/organization) or tenant dashboard ({slug}.uurl.uz)
 */
export default function GoogleCallbackPage() {
  const { handleRedirect } = usePostAuthRedirect()

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      try {
        await handleRedirect()
      } catch (err) {
        if (!isMounted) return
        toast.error("Google authentication failed. Please try logging in again.")
      }
    }

    run()

    return () => {
      isMounted = false
    }
  }, [handleRedirect])

  return <FullscreenLoader message="Completing Google Sign-in..." />
}
