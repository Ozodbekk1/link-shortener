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
  /** Optional tenant slug from route params */
  expectedTenant?: string
}

/**
 * Route protection wrapper requiring an organization context.
 *
 * Checks:
 * 1. User is authenticated (waits for GET /users/me).
 * 2. User has at least one organization.
 * 3. User is accessing the correct tenant subdomain.
 *
 * Redirects:
 * - Unauthenticated → https://uurl.uz/{locale}/auth/login
 * - No organization → https://uurl.uz/{locale}/onboarding/organization
 * - Wrong subdomain → https://{correctSlug}.uurl.uz/{locale}/dashboard
 */
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

    // Case 1: User has no organization → redirect to onboarding on root domain
    if (orgs.length === 0) {
      const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "uurl.uz"
      const protocol = window.location.protocol
      window.location.replace(`${protocol}//${rootDomain}/${locale}/onboarding/organization`)
      return
    }

    // Case 2: Multi-tenant validation if expectedTenant is specified
    if (expectedTenant) {
      const hasAccessToTenant = orgs.some(
        (o) => o.slug.toLowerCase() === expectedTenant.toLowerCase()
      )

      if (!hasAccessToTenant) {
        // User does not belong to this subdomain → redirect to their primary org
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
