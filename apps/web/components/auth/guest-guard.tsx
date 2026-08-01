"use client"

import React, { useEffect, useState } from "react"
import { useAuth } from "@/common/providers/auth-provider"
import { useLocale } from "@/hooks/use-locale"
import { FullscreenLoader } from "@/components/auth/fullscreen-loader"
import {
  resolvePostAuthRedirect,
  executeRedirect,
} from "@/lib/auth/post-auth-redirect"

interface GuestGuardProps {
  children: React.ReactNode
}

/**
 * Guest-only route wrapper (Login, Register, etc.).
 *
 * Ensures GET /api/v1/users/me finishes BEFORE showing the page.
 * If user is ALREADY authenticated, automatically redirects them using
 * the centralized post-auth redirect logic (Dashboard or Onboarding).
 *
 * Prevents logged-in users from viewing auth forms.
 */
export function GuestGuard({ children }: GuestGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const locale = useLocale()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (isLoading) return

    if (isAuthenticated && user) {
      const redirectTarget = resolvePostAuthRedirect(user, locale)
      executeRedirect(redirectTarget)
      return
    }

    setIsChecking(false)
  }, [isLoading, isAuthenticated, user, locale])

  if (isLoading || isChecking) {
    return <FullscreenLoader message="Checking session..." />
  }

  return <>{children}</>
}
