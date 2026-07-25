"use client"

import React, { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { useLocale } from "@/hooks/use-locale"
import { useTranslation } from "@/hooks/use-translation"
import { ShieldCheck, Zap, BarChart3, Globe, ArrowLeft, Star } from "lucide-react"

type AuthLayoutProps = {
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  const locale = useLocale()
  const { t } = useTranslation()

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-white via-[#FFF8F8] to-[#FFF0F2] py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Glow Orbs */}
      <div
        className="pointer-events-none absolute -top-[10%] -left-[5%] h-[600px] w-[600px] rounded-full opacity-60 blur-3xl"
        style={{
          background: `radial-gradient(circle, rgba(244,91,105,0.15) 0%, transparent 70%)`,
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-[10%] -right-[5%] h-[600px] w-[600px] rounded-full opacity-50 blur-3xl"
        style={{
          background: `radial-gradient(circle, rgba(244,91,105,0.12) 0%, transparent 70%)`,
        }}
      />

      {/* Top Navigation */}
      <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between mx-auto max-w-7xl">
        <Link
          href={`/${locale}`}
          className="group inline-flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2 text-sm font-semibold text-gray-700 backdrop-blur-md border border-gray-200/60 shadow-xs transition-all hover:bg-white hover:text-[#F45B69]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          {t("about.backToHome")}
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-6xl py-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">

          {/* Left Column: Brand & Features (Hidden on mobile, visible on lg) */}
          <div className="hidden flex-col justify-between lg:flex lg:col-span-6 xl:col-span-7 pr-6">
            <div>
              <Link href={`/${locale}`} className="inline-block mb-6">
                <Image
                  src="/icons/logo.png"
                  alt="Uurl"
                  width={300}
                  height={80}
                  className="h-16 w-auto"
                  priority
                />
              </Link>

              <h1 className="text-4xl font-black tracking-tight text-gray-900 xl:text-5xl leading-[1.15] mb-4">
                Create smarter{" "}
                <span className="text-[#F45B69]">links</span>.<br />
                Understand every{" "}
                <span className="text-[#F45B69]">click</span>.
              </h1>

              <p className="text-base text-gray-600 max-w-lg mb-8 leading-relaxed">
                {t("hero.subtitleFree")} {t("hero.subtitleAnalytics")}{" "}
                {t("hero.subtitleNoLimits")}
              </p>

              {/* Feature Pills */}
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3 rounded-2xl bg-white/80 p-3.5 backdrop-blur-sm border border-gray-200/60 shadow-xs max-w-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F45B69]/10 text-[#F45B69]">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Sub-50ms Redirects</div>
                    <div className="text-xs text-gray-500">Lightning fast global link resolution</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-white/80 p-3.5 backdrop-blur-sm border border-gray-200/60 shadow-xs max-w-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F45B69]/10 text-[#F45B69]">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Real-Time Analytics</div>
                    <div className="text-xs text-gray-500">Track countries, devices, and browsers</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-white/80 p-3.5 backdrop-blur-sm border border-gray-200/60 shadow-xs max-w-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F45B69]/10 text-[#F45B69]">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Custom Domains</div>
                    <div className="text-xs text-gray-500">Brand every link with your domain</div>
                  </div>
                </div>
              </div>

              {/* Social Proof */}
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
                  <span className="font-bold text-gray-900">12,000+ creators & teams</span>
                  <div className="flex items-center gap-1 text-amber-500 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-current" />
                    ))}
                    <span className="text-gray-500 font-medium ml-1">5.0 rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form Card */}
          <div className="lg:col-span-6 xl:col-span-5">
            <div className="mx-auto w-full max-w-md rounded-3xl border border-gray-200/80 bg-white/90 p-8 sm:p-10 shadow-2xl shadow-[#F45B69]/10 backdrop-blur-xl transition-all">
              
              {/* Card Header */}
              <div className="mb-8 text-center sm:text-left">
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#F45B69]/10 px-3 py-1 text-xs font-bold text-[#F45B69]">
                  <ShieldCheck className="h-3.5 w-3.5" /> UURL Auth
                </div>
                <h2 className="text-2xl font-black text-gray-900 sm:text-3xl tracking-tight">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {subtitle}
                </p>
              </div>

              {/* Form Content */}
              {children}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
