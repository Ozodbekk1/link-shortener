"use client"

import React, { useEffect } from "react"
import { usePostAuthRedirect } from "@/hooks/use-post-auth-redirect"
import { FullscreenLoader } from "@/components/auth/fullscreen-loader"

export default function AuthCompletePage() {
  const { handleRedirect } = usePostAuthRedirect()

  useEffect(() => {
    handleRedirect()
  }, [handleRedirect])

  return <FullscreenLoader message="Finalizing authentication..." />
}
