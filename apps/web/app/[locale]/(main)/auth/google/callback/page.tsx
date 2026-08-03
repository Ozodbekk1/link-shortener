"use client"

import React, { useEffect } from "react"
import { usePostAuthRedirect } from "@/hooks/use-post-auth-redirect"
import { FullscreenLoader } from "@/components/auth/fullscreen-loader"
import { toast } from "sonner"

export default function GoogleCallbackPage() {
  const { handleRedirect } = usePostAuthRedirect()

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      try {
        await handleRedirect()
      } catch (err) {
        if (!isMounted) return
        toast.error(
          "Google authentication failed. Please try logging in again."
        )
      }
    }

    run()

    return () => {
      isMounted = false
    }
  }, [handleRedirect])

  return <FullscreenLoader message="Completing Google Sign-in..." />
}
