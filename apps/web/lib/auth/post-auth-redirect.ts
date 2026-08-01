import type { UserProfileResponse } from "@/api/types"

/**
 * Determines the correct redirect URL after authentication based on the
 * user's profile from GET /users/me.
 *
 * This is the ONLY place routing decisions are made post-auth.
 * Every auth provider (Email, Google, Telegram) must use this function.
 *
 * Rules:
 *  - User has no organizations → /onboarding/organization
 *  - User has organizations → https://{slug}.{ROOT_DOMAIN}/{locale}/dashboard
 */

export interface PostAuthRedirectResult {
  /** The URL to redirect to */
  url: string
  /** Whether this is a cross-origin redirect (requires window.location) */
  isCrossOrigin: boolean
}

/**
 * Derives all organizations the user belongs to — both owned and memberships.
 * Returns a deduplicated list with slug available.
 */
function getUserOrganizations(user: UserProfileResponse["user"]) {
  const orgs: Array<{ id: string; name: string; slug: string }> = []
  const seen = new Set<string>()

  // Owned organizations
  for (const org of user.ownedOrganizations ?? []) {
    if (!seen.has(org.id)) {
      seen.add(org.id)
      orgs.push({ id: org.id, name: org.name, slug: org.slug })
    }
  }

  // Memberships (orgs the user belongs to but doesn't own)
  for (const membership of user.memberships ?? []) {
    const org = membership.organization
    if (org && !seen.has(org.id)) {
      seen.add(org.id)
      orgs.push({ id: org.id, name: org.name, slug: org.slug })
    }
  }

  return orgs
}

/**
 * Resolves the post-authentication redirect target.
 *
 * @param user - The full user profile from GET /users/me
 * @param locale - The current locale (e.g. "en", "uz", "ru")
 * @returns PostAuthRedirectResult with the target URL and whether it's cross-origin
 */
export function resolvePostAuthRedirect(
  user: UserProfileResponse["user"],
  locale: string = "en"
): PostAuthRedirectResult {
  const organizations = getUserOrganizations(user)

  // Case 1: No organizations — go to onboarding
  if (organizations.length === 0) {
    return {
      url: `/${locale}/onboarding/organization`,
      isCrossOrigin: false,
    }
  }

  // Case 2: Has organization(s) — redirect to the first org's subdomain dashboard
  const primaryOrg = organizations[0]
  const rootDomain = getRootDomain()
  const protocol = getProtocol()

  return {
    url: `${protocol}//${primaryOrg.slug}.${rootDomain}/${locale}/dashboard`,
    isCrossOrigin: true,
  }
}

/**
 * Returns the root domain from environment, stripping any port for production.
 */
function getRootDomain(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_ROOT_DOMAIN || "uurl.uz"
  }
  return process.env.NEXT_PUBLIC_ROOT_DOMAIN || "uurl.uz"
}

/**
 * Returns the protocol (http or https) based on the current environment.
 */
function getProtocol(): string {
  if (typeof window !== "undefined") {
    return window.location.protocol
  }
  // Server-side fallback
  const rootDomain = getRootDomain()
  return rootDomain.includes("localhost") ? "http:" : "https:"
}

/**
 * Performs the actual redirect. Uses window.location.replace for cross-origin
 * (subdomain) redirects, since Next.js router cannot handle those.
 */
export function executeRedirect(result: PostAuthRedirectResult): void {
  if (typeof window === "undefined") return

  if (result.isCrossOrigin) {
    window.location.replace(result.url)
  } else {
    // For same-origin redirects, we still use window.location to ensure
    // a clean navigation without stale React state
    window.location.replace(result.url)
  }
}

/**
 * Safely redirects unauthenticated users or logout actions back to the login page.
 * If currently on a tenant subdomain, redirects back to the root domain login page
 * (e.g. https://uurl.uz/en/auth/login) to prevent 404 Not Found on tenant subdomains.
 */
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

/**
 * Public marketing/footer paths that must NEVER redirect to login,
 * even when the user has no auth tokens in cookies.
 */
const PUBLIC_MARKETING_PATHS = [
  "", // /{locale} → marketing home
  "/about",
  "/contact",
  "/privacy",
  "/terms",
]

/**
 * Returns true if the given pathname is a public marketing page.
 *
 * Used to prevent redirecting public visitors to the login page when they
 * don't have auth tokens in cookies (e.g. GET /users/me returns 401 and
 * the refresh attempt also fails).
 */
export function isPublicMarketingPage(pathname: string): boolean {
  // Strip the locale prefix (/en, /uz, /ru)
  const withoutLocale = pathname.replace(/^\/(en|uz|ru)(?=\/|$)/, "")
  // Normalize trailing slash
  const normalized = withoutLocale.replace(/\/+$/, "") || ""
  return PUBLIC_MARKETING_PATHS.includes(normalized)
}

/**
 * Returns true if the given pathname is a public short-link redirect path
 * (e.g. /r/slug).
 *
 * Short links must be resolvable WITHOUT authentication — anyone who clicks
 * a shared link must be redirected to the original URL even if they have no
 * tokens in cookies. When GET /users/me returns 401 and the refresh attempt
 * fails on such a path, we must NOT bounce the visitor to the login page.
 */
export function isPublicRedirectPath(pathname: string): boolean {
  // Strip the locale prefix (/en, /uz, /ru) just in case
  const withoutLocale = pathname.replace(/^\/(en|uz|ru)(?=\/|$)/, "")
  return withoutLocale === "/r" || withoutLocale.startsWith("/r/")
}

export { getUserOrganizations }
