import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_FILE = /\.(.*)$/
const LOCALES = ["en", "uz", "ru"]
const DEFAULT_LOCALE = "en"

export function middleware(req: NextRequest) {
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

  if (!pathnameLocale) {
    return NextResponse.redirect(
      new URL(`/${DEFAULT_LOCALE}${url.pathname}${url.search}`, req.url)
    )
  }

  const pathnameWithoutLocale =
    url.pathname.replace(new RegExp(`^/${pathnameLocale}`), "") || "/"

  if (subdomain && subdomain !== "www") {
    return NextResponse.rewrite(
      new URL(
        `/${pathnameLocale}/tenant-app/${subdomain}${pathnameWithoutLocale}${url.search}`,
        req.url
      )
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
