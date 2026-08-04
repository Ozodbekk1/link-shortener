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
