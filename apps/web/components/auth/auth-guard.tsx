"use client"

import React, { useEffect } from "react"
import { useAuth } from "@/common/providers/auth-provider"
import { useLocale } from "@/hooks/use-locale"
import { FullscreenLoader } from "@/components/auth/fullscreen-loader"
import { redirectToLogin } from "@/lib/auth/post-auth-redirect"

interface AuthGuardProps {
  children: React.ReactNode
}

/**
 * Route protection wrapper requiring authentication.
 *
 * Ensures GET /api/v1/users/me has completed before rendering children.
 * Displays a fullscreen loading screen until auth state is resolved.
 * Redirects unauthenticated users to root domain login page.
 */
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
