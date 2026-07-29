import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_FILE = /\.(.*)$/
const LOCALES = ["en", "uz", "ru"]
const DEFAULT_LOCALE = "en"

export function middleware(req: NextRequest) {
  const hasOrganization = req.cookies.get("hasOrganization")?.value
  const token = req.cookies.get("access_token")?.value

  const url = req.nextUrl
  const hostname = req.headers.get("host") || ""

  // Ignore static files, API routes, and internal Next.js requests
  if (
    PUBLIC_FILE.test(url.pathname) ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/r/") ||
    url.pathname === "/r"
  ) {
    return NextResponse.next()
  }

  // Detect locale in URL path
  const pathnameLocale = LOCALES.find(
    (locale) =>
      url.pathname.startsWith(`/${locale}/`) || url.pathname === `/${locale}`
  )

  const activeLocale = pathnameLocale || DEFAULT_LOCALE

  // Determine root domain (Fallback to uurl.uz if env variable is missing)
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "uurl.uz"

  const currentHost = hostname.replace(/:\d+$/, "")
  const rootHost = rootDomain.replace(/:\d+$/, "")

  // Check if current request is on a subdomain (e.g., real.uurl.uz)
  const isSubdomain =
    currentHost !== rootHost && currentHost.endsWith(`.${rootHost}`)

  const subdomain = isSubdomain ? currentHost.replace(`.${rootHost}`, "") : null
  const isRootDomain =
    currentHost === rootHost || currentHost === `www.${rootHost}`

  // Detect protocol (HTTPS in production)
  const protocol =
    req.headers.get("x-forwarded-proto") ||
    (process.env.NODE_ENV === "production" ? "https" : "http")

  /**
   * 1. Redirect authenticated users from root domain to their organization subdomain
   */
  if (
    token &&
    isRootDomain &&
    hasOrganization === "true" &&
    !url.pathname.includes("/tenant-app")
  ) {
    const organizationSlug = req.cookies.get("organization_slug")?.value

    if (organizationSlug) {
      return NextResponse.redirect(
        new URL(
          `${protocol}://${organizationSlug}.${rootHost}${url.pathname}${url.search}`
        )
      )
    }
  }

  /**
   * 2. Ensure URL has a valid locale prefix
   */
  if (!pathnameLocale) {
    return NextResponse.redirect(
      new URL(`/${DEFAULT_LOCALE}${url.pathname}${url.search}`, req.url)
    )
  }

  const pathnameWithoutLocale =
    url.pathname.replace(new RegExp(`^/${pathnameLocale}`), "") || "/"

  /**
   * 3. Tenant subdomain rewrite -> Send real.uurl.uz to /en/tenant-app/real/...
   */
  if (subdomain && subdomain !== "www" && subdomain !== "api") {
    return NextResponse.rewrite(
      new URL(
        `/${activeLocale}/tenant-app/${subdomain}${pathnameWithoutLocale}${url.search}`,
        req.url
      )
    )
  }

  /**
   * 4. Users without organization redirect to onboarding
   */
  if (
    hasOrganization === "false" &&
    !req.nextUrl.pathname.includes("/onboarding/organization")
  ) {
    return NextResponse.redirect(
      new URL(`/${activeLocale}/onboarding/organization`, req.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
