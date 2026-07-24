import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_FILE = /\.(.*)$/
const LOCALES = ["en", "es", "fr"]
const DEFAULT_LOCALE = "en"

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  const hostname = req.headers.get("host") || ""

  // 1. Skip static assets & API
  if (
    PUBLIC_FILE.test(url.pathname) ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/_next")
  ) {
    return NextResponse.next()
  }

  // 2. Locale extraction
  const pathnameLocale = LOCALES.find(
    (locale) =>
      url.pathname.startsWith(`/${locale}/`) || url.pathname === `/${locale}`
  )
  const currentLocale = pathnameLocale || DEFAULT_LOCALE

  const pathnameWithoutLocale = pathnameLocale
    ? url.pathname.replace(`/${pathnameLocale}`, "") || "/"
    : url.pathname

  // 3. Subdomain extraction logic
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000"
  const currentHost = hostname.replace(/:\d+$/, "") // Strip port numbers
  const rootHost = rootDomain.replace(/:\d+$/, "")

  // Detect if we are on a subdomain (e.g. acme.localhost or acme.yourdomain.com)
  const isSubdomain =
    currentHost !== rootHost && currentHost.endsWith(`.${rootHost}`)

  const subdomain = isSubdomain ? currentHost.replace(`.${rootHost}`, "") : null

  // 4. SUBDOMAIN PRESENT: Rewrite into internal tenant directory
  if (subdomain && subdomain !== "www") {
    return NextResponse.rewrite(
      new URL(
        `/${currentLocale}/tenant-app/${subdomain}${pathnameWithoutLocale}${url.search}`,
        req.url
      )
    )
  }

  // 5. MAIN DOMAIN: Redirect missing locale on root domain
  if (!pathnameLocale) {
    return NextResponse.redirect(
      new URL(`/${DEFAULT_LOCALE}${url.pathname}${url.search}`, req.url)
    )
  }

  // Allow request to proceed to (main) routes normally
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
