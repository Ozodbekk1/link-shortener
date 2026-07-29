import { NextResponse, type NextRequest } from "next/server"

const PUBLIC_FILE = /\.(.*)$/
const LOCALES = ["en", "uz", "ru"]
const DEFAULT_LOCALE = "en"

export function middleware(req: NextRequest) {
  const url = req.nextUrl

  if (
    PUBLIC_FILE.test(url.pathname) ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/r/") ||
    url.pathname === "/r"
  ) {
    return NextResponse.next()
  }

  const hostname =
    req.headers.get("x-forwarded-host") || req.headers.get("host") || ""

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "uurl.uz"
  const currentHost = hostname.replace(/:\d+$/, "")
  const rootHost = rootDomain.replace(/:\d+$/, "")

  const isSubdomain =
    currentHost !== rootHost &&
    currentHost !== `www.${rootHost}` &&
    currentHost.endsWith(`.${rootHost}`)

  const subdomain = isSubdomain ? currentHost.replace(`.${rootHost}`, "") : null

  const pathnameLocale = LOCALES.find(
    (locale) =>
      url.pathname.startsWith(`/${locale}/`) || url.pathname === `/${locale}`
  )

  const activeLocale = pathnameLocale || DEFAULT_LOCALE

  if (!pathnameLocale) {
    return NextResponse.redirect(
      new URL(`/${DEFAULT_LOCALE}${url.pathname}${url.search}`, req.url)
    )
  }

  const pathnameWithoutLocale =
    url.pathname.replace(new RegExp(`^/${activeLocale}`), "") || "/"

  if (subdomain && subdomain !== "api" && subdomain !== "www") {
    if (pathnameWithoutLocale.startsWith("/tenant-app/")) {
      const cleanPath =
        pathnameWithoutLocale.replace(/^\/tenant-app\/[^/]*/, "") || "/"
      return NextResponse.redirect(
        new URL(`/${activeLocale}${cleanPath}${url.search}`, req.url)
      )
    }

    const cleanPath = pathnameWithoutLocale === "/" ? "" : pathnameWithoutLocale

    return NextResponse.rewrite(
      new URL(
        `/${activeLocale}/tenant-app/${subdomain}${cleanPath}${url.search}`,
        req.url
      )
    )
  }

  const hasOrganization = req.cookies.get("hasOrganization")?.value
  if (
    !subdomain &&
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
