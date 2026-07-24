"use client"

import { useEffect, useState } from "react"
import { DivideCircle, Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ComicText } from "@/components/ui/comic-text"

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Shortener", href: "#shortener" },
  { label: "Pricing", href: "#pricing" },
  { label: "Domains", href: "#domains" },
  // { label: "About", href: "#about" },
]

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

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
        <Link href="/" className="group shrink-0">
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
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <ComicText fontSize={1.2}>{item.label}</ComicText>
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/auth/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
          >
            Login
          </Link>

          <Link href={"/auth/register"}>
            <div className="w-full rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-500">
              Get Started →
            </div>
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-gray-800 transition hover:bg-gray-100 lg:hidden"
          aria-label="Toggle menu"
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
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              <ComicText fontSize={1.2}>{item.label}</ComicText>
            </Link>
          ))}

          <div className="mt-4 border-t pt-4">
            <Link
              href="/auth/login"
              className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Login
            </Link>

            <Link href={"/auth/register"}>
              <div className="w-full rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-500">
                Get Started →
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
