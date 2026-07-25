import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_FILE = /\.(.*)$/
const LOCALES = ["en", "uz", "ru"]
const DEFAULT_LOCALE = "en"

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  const hostname = req.headers.get("host") || ""

  // 1. Static fayllarni o'tkazib yuborish
  if (
    PUBLIC_FILE.test(url.pathname) ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/_next")
  ) {
    return NextResponse.next()
  }

  // 2. Localeni aniqlash
  const pathnameLocale = LOCALES.find(
    (locale) =>
      url.pathname.startsWith(`/${locale}/`) || url.pathname === `/${locale}`
  )

  // 3. Subdomain aniqlash
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000"
  const currentHost = hostname.replace(/:\d+$/, "")
  const rootHost = rootDomain.replace(/:\d+$/, "")

  const isSubdomain =
    currentHost !== rootHost && currentHost.endsWith(`.${rootHost}`)
  const subdomain = isSubdomain ? currentHost.replace(`.${rootHost}`, "") : null

  // 4. AGAR LOCALE URL'DA BO'LMASA -> REDIRECT QILAMIZ (Subdomain bo'lsa ham)
  if (!pathnameLocale) {
    return NextResponse.redirect(
      new URL(`/${DEFAULT_LOCALE}${url.pathname}${url.search}`, req.url)
    )
  }

  // Endi pathnameLocale anq bor (masalan: "en")
  const pathnameWithoutLocale =
    url.pathname.replace(new RegExp(`^/${pathnameLocale}`), "") || "/"

  // 5. SUBDOMAIN BO'LSA: Ichki papkaga rewrite qilamiz
  if (subdomain && subdomain !== "www") {
    // Papka tuzilishingiz: app/[locale]/tenant-app/[subdomain]/...
    return NextResponse.rewrite(
      new URL(
        `/${pathnameLocale}/tenant-app/${subdomain}${pathnameWithoutLocale}${url.search}`,
        req.url
      )
    )
  }

  // 6. MAIN DOMAIN
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
