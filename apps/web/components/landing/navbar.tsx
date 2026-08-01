"use client"

import { useCallback, useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ComicText } from "@/components/ui/comic-text"
import { useTranslation } from "@/hooks/use-translation"
import { useLocale } from "@/hooks/use-locale"
import LanguageSwitcher from "@/components/landing/language-switcher"
import { useAuth } from "@/common/providers/auth-provider"
import {
  executeRedirect,
  getUserOrganizations,
  resolvePostAuthRedirect,
} from "@/lib/auth/post-auth-redirect"

type NavItemKey = "features" | "shortener" | "pricing" | "domains"

const NAV_ITEMS: { key: NavItemKey; href: string }[] = [
  { key: "features", href: "#features" },
  { key: "shortener", href: "#shortener" },
  { key: "pricing", href: "#pricing" },
  { key: "domains", href: "#domains" },
]

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { t } = useTranslation()
  const locale = useLocale()
  const { user, isAuthenticated, isLoading } = useAuth()

  const handleGoToDashboard = useCallback(() => {
    if (!user) return

    const redirectTarget = resolvePostAuthRedirect(user, locale)
    executeRedirect(redirectTarget)
  }, [user, locale])

  const primaryOrgName = useCallback(() => {
    if (!user) return null
    const orgs = getUserOrganizations(user)
    return orgs.length > 0 ? orgs[0].name : null
  }, [user])

  const orgName = primaryOrgName()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)

    window.addEventListener("scroll", onScroll, { passive: true })

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""

    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-gray-200/70 bg-white/80 shadow-sm backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href={`/${locale}`} className="group shrink-0">
          <Image
            src="/icons/logo.png"
            alt="Logo"
            width={1200}
            height={336}
            className="h-28 w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <ComicText fontSize={1.2}>{t(`nav.${item.key}`)}</ComicText>
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />

          {isLoading ? (
            <div className="h-10 w-40 animate-pulse rounded-xl bg-gray-200" />
          ) : isAuthenticated && user ? (
            <button
              onClick={handleGoToDashboard}
              className="cursor-pointer rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-500"
            >
              {t("nav.goToDashboard")} {orgName || ""} →
            </button>
          ) : (
            <>
              <Link
                href={`/${locale}/auth/login`}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
              >
                {t("nav.login")}
              </Link>

              <Link href={`/${locale}/auth/register`}>
                <div className="w-full rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-500">
                  {t("nav.getStarted")}
                </div>
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-gray-800 transition hover:bg-gray-100 lg:hidden"
          aria-label={t("nav.toggleMenu")}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 lg:hidden ${
          mobileOpen
            ? "max-h-screen border-t border-gray-200 bg-white"
            : "max-h-0"
        }`}
      >
        <div className="space-y-1 px-5 py-5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              <ComicText fontSize={1.2}>{t(`nav.${item.key}`)}</ComicText>
            </Link>
          ))}

          <div className="mt-4 border-t pt-4">
            <div className="mb-3 px-4">
              <LanguageSwitcher />
            </div>

            {isLoading ? (
              <div className="mx-4 h-10 animate-pulse rounded-xl bg-gray-200" />
            ) : isAuthenticated && user ? (
              <button
                onClick={handleGoToDashboard}
                className="mx-4 block w-[calc(100%-2rem)] cursor-pointer rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-500"
              >
                {t("nav.goToDashboard")} {orgName || ""} →
              </button>
            ) : (
              <>
                <Link
                  href={`/${locale}/auth/login`}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  {t("nav.login")}
                </Link>

                <Link href={`/${locale}/auth/register`}>
                  <div className="w-full rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-500">
                    {t("nav.getStarted")}
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
