"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/common/providers/auth-provider"
import { useLocale } from "@/hooks/use-locale"
import { FullscreenLoader } from "@/components/auth/fullscreen-loader"

interface AuthGuardProps {
  children: React.ReactNode
}

/**
 * Route protection wrapper requiring authentication.
 *
 * Ensures GET /api/v1/users/me has completed before rendering children.
 * Displays a fullscreen loading screen until auth state is resolved.
 * Redirects unauthenticated users to /auth/login.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const locale = useLocale()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/${locale}/auth/login`)
    }
  }, [isLoading, isAuthenticated, router, locale])

  if (isLoading || !isAuthenticated) {
    return <FullscreenLoader message="Verifying authentication..." />
  }

  return <>{children}</>
}
