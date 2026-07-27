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

  if (
    PUBLIC_FILE.test(url.pathname) ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/r/") ||
    url.pathname === "/r"
  ) {
    return NextResponse.next()
  }

  const pathnameLocale = LOCALES.find(
    (locale) =>
      url.pathname.startsWith(`/${locale}/`) || url.pathname === `/${locale}`
  )

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000"

  const currentHost = hostname.replace(/:\d+$/, "")
  const rootHost = rootDomain.replace(/:\d+$/, "")

  const isSubdomain =
    currentHost !== rootHost && currentHost.endsWith(`.${rootHost}`)

  const subdomain = isSubdomain ? currentHost.replace(`.${rootHost}`, "") : null

  /**
   * Redirect authenticated users from root domain
   * to their organization subdomain
   */
  const isRootDomain = currentHost === rootHost

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
          `http://${organizationSlug}.${rootDomain}${url.pathname}${url.search}`,
          req.url
        )
      )
    }
  }

  if (!pathnameLocale) {
    return NextResponse.redirect(
      new URL(`/${DEFAULT_LOCALE}${url.pathname}${url.search}`, req.url)
    )
  }

  const pathnameWithoutLocale =
    url.pathname.replace(new RegExp(`^/${pathnameLocale}`), "") || "/"

  /**
   * Tenant subdomain routing
   */
  if (subdomain && subdomain !== "www") {
    return NextResponse.rewrite(
      new URL(
        `/${pathnameLocale}/tenant-app/${subdomain}${pathnameWithoutLocale}${url.search}`,
        req.url
      )
    )
  }

  /**
   * User without organization
   * goes to organization creation
   */
  if (
    hasOrganization === "false" &&
    !req.nextUrl.pathname.includes("/onboarding/organization")
  ) {
    return NextResponse.redirect(new URL(`/onboarding/organization`, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
