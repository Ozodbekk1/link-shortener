"use client"

import React, { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { useLocale } from "@/hooks/use-locale"
import { useTranslation } from "@/hooks/use-translation"
import { Zap, BarChart3, Globe, ArrowLeft, Star } from "lucide-react"

type AuthLayoutProps = {
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  const locale = useLocale()
  const { t } = useTranslation()

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-white via-[#FFF8F8] to-[#FFF0F2] px-4 py-12 sm:px-6 lg:px-8">
      <div
        className="pointer-events-none absolute -top-[10%] -left-[5%] h-[600px] w-[600px] rounded-full opacity-60 blur-3xl"
        style={{
          background: `radial-gradient(circle, rgba(244,91,105,0.15) 0%, transparent 70%)`,
        }}
      />
      <div
        className="pointer-events-none absolute -right-[5%] -bottom-[10%] h-[600px] w-[600px] rounded-full opacity-50 blur-3xl"
        style={{
          background: `radial-gradient(circle, rgba(244,91,105,0.12) 0%, transparent 70%)`,
        }}
      />

      <div className="absolute top-6 right-6 left-6 z-20 mx-auto flex max-w-7xl items-center justify-between">
        <Link
          href={`/${locale}`}
          className="group inline-flex items-center gap-2 rounded-xl border border-gray-200/60 bg-white/80 px-4 py-2 text-sm font-semibold text-gray-700 shadow-xs backdrop-blur-md transition-all hover:bg-white hover:text-[#F45B69]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          {t("about.backToHome")}
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-6xl py-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="hidden flex-col justify-between pr-6 lg:col-span-6 lg:flex xl:col-span-7">
            <div>
              <Link href={`/${locale}`} className="mb-6 inline-block">
                <Image
                  src="/icons/logo.png"
                  alt="Uurl"
                  width={300}
                  height={80}
                  className="h-16 w-auto"
                  priority
                />
              </Link>

              <h1 className="mb-4 text-4xl leading-[1.15] font-black tracking-tight text-gray-900 xl:text-5xl">
                Create smarter <span className="text-[#F45B69]">links</span>.
                <br />
                Understand every <span className="text-[#F45B69]">click</span>.
              </h1>

              <p className="mb-8 max-w-lg text-base leading-relaxed text-gray-600">
                {t("hero.subtitleFree")} {t("hero.subtitleAnalytics")}{" "}
                {t("hero.subtitleNoLimits")}
              </p>

              <div className="mb-10 space-y-4">
                <div className="flex max-w-md items-center gap-3 rounded-2xl border border-gray-200/60 bg-white/80 p-3.5 shadow-xs backdrop-blur-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F45B69]/10 text-[#F45B69]">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">
                      Sub-50ms Redirects
                    </div>
                    <div className="text-xs text-gray-500">
                      Lightning fast global link resolution
                    </div>
                  </div>
                </div>

                <div className="flex max-w-md items-center gap-3 rounded-2xl border border-gray-200/60 bg-white/80 p-3.5 shadow-xs backdrop-blur-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F45B69]/10 text-[#F45B69]">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">
                      Real-Time Analytics
                    </div>
                    <div className="text-xs text-gray-500">
                      Track countries, devices, and browsers
                    </div>
                  </div>
                </div>

                <div className="flex max-w-md items-center gap-3 rounded-2xl border border-gray-200/60 bg-white/80 p-3.5 shadow-xs backdrop-blur-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F45B69]/10 text-[#F45B69]">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">
                      Custom Domains
                    </div>
                    <div className="text-xs text-gray-500">
                      Brand every link with your domain
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <div className="flex -space-x-2">
                  {[
                    { bg: "#F59E0B", label: "J" },
                    { bg: "#10B981", label: "S" },
                    { bg: "#3B82F6", label: "A" },
                    { bg: "#8B5CF6", label: "M" },
                    { bg: "#EC4899", label: "R" },
                  ].map((user, i) => (
                    <div
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow-xs"
                      style={{ backgroundColor: user.bg }}
                    >
                      {user.label}
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-600">
                  <span className="font-bold text-gray-900">
                    12,000+ creators & teams
                  </span>
                  <div className="mt-0.5 flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-current" />
                    ))}
                    <span className="ml-1 font-medium text-gray-500">
                      5.0 rating
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 xl:col-span-5">
            <div className="mx-auto w-full max-w-md rounded-3xl border border-gray-200/80 bg-white/90 p-8 shadow-2xl shadow-[#F45B69]/10 backdrop-blur-xl transition-all sm:p-10">
              <div className="mb-8 text-center sm:text-left">
                <h2 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {subtitle}
                </p>
              </div>

              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
