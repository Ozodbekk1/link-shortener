"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/common/providers/auth-provider"
import { useLocale } from "@/hooks/use-locale"
import { FullscreenLoader } from "@/components/auth/fullscreen-loader"
import {
  getUserOrganizations,
  resolvePostAuthRedirect,
  executeRedirect,
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
 * - Unauthenticated → /auth/login
 * - No organization → /onboarding/organization
 * - Wrong subdomain → https://{correctSlug}.uurl.uz/{locale}/dashboard
 */
export function OrgGuard({ children, expectedTenant }: OrgGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const locale = useLocale()
  const [isResolving, setIsResolving] = useState(true)

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated || !user) {
      router.replace(`/${locale}/auth/login`)
      return
    }

    const orgs = getUserOrganizations(user)

    // Case 1: User has no organization → redirect to onboarding
    if (orgs.length === 0) {
      router.replace(`/${locale}/onboarding/organization`)
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
  }, [isLoading, isAuthenticated, user, expectedTenant, router, locale])

  if (isLoading || isResolving) {
    return <FullscreenLoader message="Validating organization access..." />
  }

  return <>{children}</>
}
