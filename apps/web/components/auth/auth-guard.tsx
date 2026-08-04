"use client"

import React, { useEffect } from "react"
import { useAuth } from "@/common/providers/auth-provider"
import { useLocale } from "@/hooks/use-locale"
import { FullscreenLoader } from "@/components/auth/fullscreen-loader"
import { redirectToLogin } from "@/lib/auth/post-auth-redirect"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const locale = useLocale()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      redirectToLogin(locale)
    }
  }, [isLoading, isAuthenticated, locale])

  if (isLoading || !isAuthenticated) {
    return <FullscreenLoader message="Verifying authentication..." />
  }

  return <>{children}</>
}
