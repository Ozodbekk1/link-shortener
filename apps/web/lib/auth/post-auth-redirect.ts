import type { UserProfileResponse } from "@/api/types"

export interface PostAuthRedirectResult {
  url: string
  isCrossOrigin: boolean
}

function getUserOrganizations(user: UserProfileResponse["user"]) {
  const orgs: Array<{ id: string; name: string; slug: string }> = []
  const seen = new Set<string>()

  for (const org of user.ownedOrganizations ?? []) {
    if (!seen.has(org.id)) {
      seen.add(org.id)
      orgs.push({ id: org.id, name: org.name, slug: org.slug })
    }
  }

  for (const membership of user.memberships ?? []) {
    const org = membership.organization
    if (org && !seen.has(org.id)) {
      seen.add(org.id)
      orgs.push({ id: org.id, name: org.name, slug: org.slug })
    }
  }

  return orgs
}

export function resolvePostAuthRedirect(
  user: UserProfileResponse["user"],
  locale: string = "en"
): PostAuthRedirectResult {
  const organizations = getUserOrganizations(user)

  if (organizations.length === 0) {
    return {
      url: `/${locale}/onboarding/organization`,
      isCrossOrigin: false,
    }
  }

  const primaryOrg = organizations[0]
  const rootDomain = getRootDomain()
  const protocol = getProtocol()

  return {
    url: `${protocol}//${primaryOrg.slug}.${rootDomain}/${locale}/dashboard`,
    isCrossOrigin: true,
  }
}

function getRootDomain(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_ROOT_DOMAIN || "uurl.uz"
  }
  return process.env.NEXT_PUBLIC_ROOT_DOMAIN || "uurl.uz"
}

function getProtocol(): string {
  if (typeof window !== "undefined") {
    return window.location.protocol
  }
  const rootDomain = getRootDomain()
  return rootDomain.includes("localhost") ? "http:" : "https:"
}

export function executeRedirect(result: PostAuthRedirectResult): void {
  if (typeof window === "undefined") return

  if (result.isCrossOrigin) {
    window.location.replace(result.url)
  } else {
    window.location.replace(result.url)
  }
}

export function redirectToLogin(locale: string = "en"): void {
  if (typeof window === "undefined") return

  const rootDomain = getRootDomain()
  const protocol = getProtocol()
  const currentHost = window.location.host.replace(/:\d+$/, "")
  const rootHost = rootDomain.replace(/:\d+$/, "")

  const isSubdomain =
    currentHost !== rootHost &&
    currentHost !== `www.${rootHost}` &&
    currentHost.endsWith(`.${rootHost}`)

  if (isSubdomain) {
    window.location.replace(`${protocol}//${rootDomain}/${locale}/auth/login`)
  } else {
    window.location.replace(`/${locale}/auth/login`)
  }
}

const PUBLIC_MARKETING_PATHS = ["", "/about", "/contact", "/privacy", "/terms"]

export function isPublicMarketingPage(pathname: string): boolean {
  const withoutLocale = pathname.replace(/^\/(en|uz|ru)(?=\/|$)/, "")
  const normalized = withoutLocale.replace(/\/+$/, "") || ""
  return PUBLIC_MARKETING_PATHS.includes(normalized)
}

export function isPublicRedirectPath(pathname: string): boolean {
  const withoutLocale = pathname.replace(/^\/(en|uz|ru)(?=\/|$)/, "")
  return withoutLocale === "/r" || withoutLocale.startsWith("/r/")
}

export { getUserOrganizations }
