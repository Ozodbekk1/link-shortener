"use client"

import React from "react"
import { useLocale } from "@/hooks/use-locale"
import { useTranslation } from "@/hooks/use-translation"
import Link from "next/link"
import {
  ArrowLeft,
  Shield,
  Cookie,
  Database,
  Users,
  Mail,
  Lock,
} from "lucide-react"

const sectionKeys = [
  {
    id: "information-we-collect",
    icon: <Database className="h-5 w-5" />,
    titleKey: "privacy.section1Title",
    itemKeys: [
      "privacy.section1Item1",
      "privacy.section1Item2",
      "privacy.section1Item3",
      "privacy.section1Item4",
    ],
  },
  {
    id: "how-we-use-your-data",
    icon: <Users className="h-5 w-5" />,
    titleKey: "privacy.section2Title",
    itemKeys: [
      "privacy.section2Item1",
      "privacy.section2Item2",
      "privacy.section2Item3",
      "privacy.section2Item4",
    ],
  },
  {
    id: "data-sharing",
    icon: <Shield className="h-5 w-5" />,
    titleKey: "privacy.section3Title",
    itemKeys: [
      "privacy.section3Item1",
      "privacy.section3Item2",
      "privacy.section3Item3",
      "privacy.section3Item4",
    ],
  },
  {
    id: "cookies",
    icon: <Cookie className="h-5 w-5" />,
    titleKey: "privacy.section4Title",
    itemKeys: [
      "privacy.section4Item1",
      "privacy.section4Item2",
      "privacy.section4Item3",
      "privacy.section4Item4",
    ],
  },
  {
    id: "data-security",
    icon: <Lock className="h-5 w-5" />,
    titleKey: "privacy.section5Title",
    itemKeys: [
      "privacy.section5Item1",
      "privacy.section5Item2",
      "privacy.section5Item3",
      "privacy.section5Item4",
    ],
  },
  {
    id: "your-rights",
    icon: <Mail className="h-5 w-5" />,
    titleKey: "privacy.section6Title",
    itemKeys: [
      "privacy.section6Item1",
      "privacy.section6Item2",
      "privacy.section6Item3",
      "privacy.section6Item4",
      "privacy.section6Item5",
    ],
  },
]

export default function PrivacyPage() {
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
          {t("privacy.backToHome")}
        </Link>
      </div>

      <section className="relative overflow-hidden pb-[60px]">
        <div
          className="pointer-events-none absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full opacity-30 blur-3xl"
          style={{
            background: `radial-gradient(circle, rgba(244,91,105,0.1) 0%, transparent 70%)`,
          }}
        />
        <div className="mx-auto max-w-[1200px] px-[32px]">
          <div className="mx-auto max-w-[800px]">
            <div className="mb-4 inline-block rounded-full bg-[#F45B69]/10 px-4 py-1.5 text-xs font-bold tracking-wider text-[#F45B69] uppercase">
              {t("privacy.badge")}
            </div>
            <h1 className="mb-4 text-4xl font-black tracking-tight text-[#111827] sm:text-5xl">
              {t("privacy.title")}
            </h1>
            <p className="mb-2 text-[#6B7280]">
              {t("privacy.lastUpdated")}{" "}
              <span className="font-medium text-[#111827]">July 15, 2025</span>
            </p>
            <p className="max-w-[600px] text-base leading-relaxed text-[#6B7280]">
              {t("privacy.description")}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-[32px]">
        <div className="flex gap-12 lg:flex-row">
          <aside className="hidden w-[260px] shrink-0 lg:block">
            <div className="sticky top-[120px] space-y-1 rounded-2xl border border-[#E5E7EB] bg-white p-5">
              <h3 className="mb-3 text-xs font-bold tracking-wider text-[#6B7280] uppercase">
                {t("privacy.onThisPage")}
              </h3>
              {sectionKeys.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#6B7280] transition-colors hover:bg-[#FFF5F5] hover:text-[#F45B69]"
                >
                  <span className="shrink-0">{section.icon}</span>
                  <span>{t(section.titleKey)}</span>
                </a>
              ))}
            </div>
          </aside>

          <div className="min-w-0 flex-1 pb-[80px]">
            <div className="space-y-10">
              {sectionKeys.map((section, index) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-[120px]"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F45B69]/10 text-[#F45B69]">
                      <span className="text-xs font-black opacity-50">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-[#111827]">
                      {t(section.titleKey)}
                    </h2>
                  </div>
                  <div className="ml-12 space-y-3">
                    {section.itemKeys.map((itemKey, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#F45B69]/40" />
                        <p className="text-sm leading-relaxed text-[#6B7280]">
                          {t(itemKey)}
                        </p>
                      </div>
                    ))}
                  </div>
                  {index < sectionKeys.length - 1 && (
                    <div className="mt-8 border-t border-[#E5E7EB]" />
                  )}
                </section>
              ))}
            </div>

            <div className="mt-16 rounded-2xl border border-[#E5E7EB] bg-[#FFF8F8] p-8">
              <h3 className="mb-3 text-lg font-bold text-[#111827]">
                {t("privacy.ctaTitle")}
              </h3>
              <p className="mb-4 text-sm text-[#6B7280]">
                {t("privacy.ctaDesc")}
              </p>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#F45B69] px-5 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90"
              >
                {t("privacy.ctaButton")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

