"use client"

import React, { useEffect, useState } from "react"
import { useAuth } from "@/common/providers/auth-provider"
import { useLocale } from "@/hooks/use-locale"
import { FullscreenLoader } from "@/components/auth/fullscreen-loader"
import {
  getUserOrganizations,
  resolvePostAuthRedirect,
  executeRedirect,
  redirectToLogin,
} from "@/lib/auth/post-auth-redirect"

interface OrgGuardProps {
  children: React.ReactNode
  expectedTenant?: string
}

export function OrgGuard({ children, expectedTenant }: OrgGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const locale = useLocale()
  const [isResolving, setIsResolving] = useState(true)

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated || !user) {
      redirectToLogin(locale)
      return
    }

    const orgs = getUserOrganizations(user)

    if (orgs.length === 0) {
      const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "uurl.uz"
      const protocol = window.location.protocol
      window.location.replace(
        `${protocol}//${rootDomain}/${locale}/onboarding/organization`
      )
      return
    }

    if (expectedTenant) {
      const hasAccessToTenant = orgs.some(
        (o) => o.slug.toLowerCase() === expectedTenant.toLowerCase()
      )

      if (!hasAccessToTenant) {
        const redirectTarget = resolvePostAuthRedirect(user, locale)
        executeRedirect(redirectTarget)
        return
      }
    }

    setIsResolving(false)
  }, [isLoading, isAuthenticated, user, expectedTenant, locale])

  if (isLoading || isResolving) {
    return <FullscreenLoader message="Validating organization access..." />
  }

  return <>{children}</>
}
