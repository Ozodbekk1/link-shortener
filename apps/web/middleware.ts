import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_FILE = /\.(.*)$/
const LOCALES = ["en", "uz", "ru"]
const DEFAULT_LOCALE = "en"

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  const hostname = req.headers.get("host") || ""

  // 1. Skip static assets, internal Next.js routes, and API calls
  if (
    PUBLIC_FILE.test(url.pathname) ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/r/") ||
    url.pathname === "/r"
  ) {
    return NextResponse.next()
  }

  // 2. Read Auth & Tenant Cookies
  const token = req.cookies.get("access_token")?.value
  const hasOrganization = req.cookies.get("hasOrganization")?.value
  const organizationSlug = req.cookies.get("organization_slug")?.value

  // 3. Domain Parsing
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "uurl.uz"
  const currentHost = hostname.replace(/:\d+$/, "") // Strip port (e.g. :3000)
  const rootHost = rootDomain.replace(/:\d+$/, "")

  const isSubdomain =
    currentHost !== rootHost && currentHost.endsWith(`.${rootHost}`)

  const subdomain = isSubdomain ? currentHost.replace(`.${rootHost}`, "") : null

  const isRootDomain =
    currentHost === rootHost || currentHost === `www.${rootHost}`

  // 4. Extract Protocol
  const protocol =
    req.headers.get("x-forwarded-proto") ||
    (process.env.NODE_ENV === "production" ? "https" : "http")

  // 5. Ensure URL has a valid locale prefix
  const pathnameLocale = LOCALES.find(
    (locale) =>
      url.pathname.startsWith(`/${locale}/`) || url.pathname === `/${locale}`
  )

  if (!pathnameLocale) {
    return NextResponse.redirect(
      new URL(`/${DEFAULT_LOCALE}${url.pathname}${url.search}`, req.url)
    )
  }

  const activeLocale = pathnameLocale
  const pathnameWithoutLocale =
    url.pathname.replace(new RegExp(`^/${activeLocale}`), "") || "/"

  // 6. Root Domain: Redirect logged-in user with org to their subdomain
  if (
    token &&
    isRootDomain &&
    hasOrganization === "true" &&
    organizationSlug &&
    !url.pathname.includes("/tenant-app")
  ) {
    return NextResponse.redirect(
      `${protocol}://${organizationSlug}.${rootHost}/${activeLocale}${pathnameWithoutLocale}${url.search}`
    )
  }

  // 7. SUBDOMAIN REWRITE: Route subdomain.uurl.uz/en -> [locale]/(tenant)/tenant-app/[tenant]
  if (subdomain && subdomain !== "www" && subdomain !== "api") {
    // If user requests subdomain directly without /tenant-app in path, rewrite internally
    if (!pathnameWithoutLocale.startsWith("/tenant-app")) {
      return NextResponse.rewrite(
        new URL(
          `/${activeLocale}/tenant-app/${subdomain}${pathnameWithoutLocale}${url.search}`,
          req.url
        )
      )
    }
  }

  // 8. Root Domain: Redirect logged-in user without org to onboarding page
  if (
    token &&
    isRootDomain &&
    hasOrganization === "false" &&
    !url.pathname.includes("/onboarding/organization")
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
