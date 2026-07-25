"use client"

import React from "react"
import { useLocale } from "@/hooks/use-locale"
import { useTranslation } from "@/hooks/use-translation"
import Link from "next/link"
import {
  ArrowLeft,
  Target,
  Eye,
  Shield,
  Zap,
  Globe,
  BarChart3,
} from "lucide-react"

const stats = [
  { value: "10M+", key: "about.statsLinks" },
  { value: "50K+", key: "about.statsUsers" },
  { value: "99.9%", key: "about.statsUptime" },
  { value: "150+", key: "about.statsCountries" },
]

const values = [
  {
    icon: <Shield className="h-6 w-6" />,
    titleKey: "about.valuePrivacyTitle",
    descKey: "about.valuePrivacyDesc",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    titleKey: "about.valueSpeedTitle",
    descKey: "about.valueSpeedDesc",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    titleKey: "about.valueGlobalTitle",
    descKey: "about.valueGlobalDesc",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    titleKey: "about.valueDataTitle",
    descKey: "about.valueDataDesc",
  },
]

export default function AboutPage() {
  const locale = useLocale()
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1200px] px-[32px] pt-[120px]">
        <Link
          href={`/${locale}`}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#6B7280] transition-colors hover:text-[#F45B69]"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("about.backToHome")}
        </Link>
      </div>

      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute -top-[20%] -right-[10%] h-[600px] w-[600px] rounded-full opacity-40 blur-3xl"
          style={{
            background: `radial-gradient(circle, rgba(244,91,105,0.12) 0%, transparent 70%)`,
          }}
        />
        <div className="mx-auto max-w-[1200px] px-[32px] pb-[80px]">
          <div className="mx-auto max-w-[800px] text-center">
            <h1 className="mb-6 text-4xl font-black tracking-tight text-[#111827] sm:text-5xl lg:text-[56px] lg:leading-[1.1]">
              {t("about.headline")}{" "}
              <span className="text-[#F45B69]">{t("about.headlineHighlight")}</span>.
            </h1>
            <p className="mx-auto mb-10 max-w-[600px] text-lg leading-relaxed text-[#6B7280]">
              {t("about.description")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
            {stats.map((stat) => (
              <div
                key={stat.key}
                className="group rounded-2xl border border-[#E5E7EB] bg-white p-6 text-center transition-all duration-300 hover:border-[#F45B69]/30 hover:shadow-lg hover:shadow-[#F45B69]/5"
              >
                <div className="mb-1 text-3xl font-black text-[#111827] group-hover:text-[#F45B69]">
                  {stat.value}
                </div>
                <div className="text-sm text-[#6B7280]">{t(stat.key)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-gradient-to-b from-white to-[#FFF8F8] py-[80px]">
        <div className="mx-auto max-w-[1200px] px-[32px]">
          <div className="mx-auto max-w-[800px]">
            <div className="mb-4 inline-block rounded-full bg-[#F45B69]/10 px-4 py-1.5 text-xs font-bold tracking-wider text-[#F45B69] uppercase">
              {t("about.storyBadge")}
            </div>
            <h2 className="mb-6 text-3xl font-black tracking-tight text-[#111827] sm:text-4xl">
              {t("about.storyTitle")}{" "}
              <span className="text-[#F45B69]">{t("about.storyTitleHighlight")}</span>{" "}
              {t("about.storyTitleEnd")}
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-[#6B7280]">
              <p>{t("about.storyP1")}</p>
              <p>{t("about.storyP2")}</p>
              <p>{t("about.storyP3")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-[80px]">
        <div className="mx-auto max-w-[1200px] px-[32px]">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="group rounded-2xl border border-[#E5E7EB] bg-white p-8 transition-all duration-300 hover:border-[#F45B69]/30 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F45B69]/10 text-[#F45B69]">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-[#111827]">
                {t("about.missionTitle")}
              </h3>
              <p className="leading-relaxed text-[#6B7280]">
                {t("about.missionDesc")}
              </p>
            </div>
            <div className="group rounded-2xl border border-[#E5E7EB] bg-white p-8 transition-all duration-300 hover:border-[#F45B69]/30 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F45B69]/10 text-[#F45B69]">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-[#111827]">
                {t("about.visionTitle")}
              </h3>
              <p className="leading-relaxed text-[#6B7280]">
                {t("about.visionDesc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#FFF8F8] py-[80px]">
        <div className="mx-auto max-w-[1200px] px-[32px]">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-block rounded-full bg-[#F45B69]/10 px-4 py-1.5 text-xs font-bold tracking-wider text-[#F45B69] uppercase">
              {t("about.valuesBadge")}
            </div>
            <h2 className="text-3xl font-black tracking-tight text-[#111827] sm:text-4xl">
              {t("about.valuesTitle")}{" "}
              <span className="text-[#F45B69]">{t("about.valuesTitleHighlight")}</span>
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.titleKey}
                className="group rounded-2xl border border-[#E5E7EB] bg-white p-6 transition-all duration-300 hover:border-[#F45B69]/30 hover:shadow-lg"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#F45B69]/10 text-[#F45B69] transition-colors group-hover:bg-[#F45B69] group-hover:text-white">
                  {value.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#111827]">
                  {t(value.titleKey)}
                </h3>
                <p className="text-sm leading-relaxed text-[#6B7280]">
                  {t(value.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[80px]">
        <div className="mx-auto max-w-[1200px] px-[32px]">
          <div className="relative overflow-hidden rounded-3xl bg-[#111827] p-12 text-center sm:p-16">
            <div
              className="pointer-events-none absolute -top-[50%] -right-[20%] h-[400px] w-[400px] rounded-full opacity-20 blur-3xl"
              style={{
                background: `radial-gradient(circle, rgba(244,91,105,0.4) 0%, transparent 70%)`,
              }}
            />
            <h2 className="relative mb-4 text-3xl font-black text-white sm:text-4xl">
              {t("about.ctaTitle")}
            </h2>
            <p className="relative mb-8 text-[#9CA3AF]">
              {t("about.ctaDesc")}
            </p>
            <Link
              href={`/${locale}/auth/register`}
              className="relative inline-block rounded-xl bg-[#F45B69] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#F45B69]/30 transition-all hover:opacity-90 active:scale-[0.98]"
            >
              {t("about.ctaButton")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

