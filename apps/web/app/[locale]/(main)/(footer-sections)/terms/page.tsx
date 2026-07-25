"use client"

import React from "react"
import { useLocale } from "@/hooks/use-locale"
import { useTranslation } from "@/hooks/use-translation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

const sectionKeys = [
  {
    id: "acceptance",
    titleKey: "terms.section1Title",
    contentKey: "terms.section1Content",
  },
  {
    id: "description",
    titleKey: "terms.section2Title",
    contentKey: "terms.section2Content",
  },
  {
    id: "accounts",
    titleKey: "terms.section3Title",
    contentKey: "terms.section3Content",
    itemKeys: [
      "terms.section3Item1",
      "terms.section3Item2",
      "terms.section3Item3",
    ],
  },
  {
    id: "acceptable-use",
    titleKey: "terms.section4Title",
    contentKey: "terms.section4Content",
    itemKeys: [
      "terms.section4Item1",
      "terms.section4Item2",
      "terms.section4Item3",
      "terms.section4Item4",
      "terms.section4Item5",
    ],
  },
  {
    id: "content",
    titleKey: "terms.section5Title",
    contentKey: "terms.section5Content",
  },
  {
    id: "analytics",
    titleKey: "terms.section6Title",
    contentKey: "terms.section6Content",
  },
  {
    id: "service-level",
    titleKey: "terms.section7Title",
    contentKey: "terms.section7Content",
  },
  {
    id: "limitation",
    titleKey: "terms.section8Title",
    contentKey: "terms.section8Content",
  },
  {
    id: "termination",
    titleKey: "terms.section9Title",
    contentKey: "terms.section9Content",
  },
  {
    id: "governing-law",
    titleKey: "terms.section10Title",
    contentKey: "terms.section10Content",
  },
  {
    id: "contact",
    titleKey: "terms.section11Title",
    contentKey: "terms.section11Content",
  },
]

export default function TermsPage() {
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
          {t("terms.backToHome")}
        </Link>
      </div>

      <div className="mx-auto max-w-[1200px] px-[32px] pb-[80px]">
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-12">
          <aside className="mb-10 lg:mb-0">
            <div className="lg:sticky lg:top-[120px]">
              <h2 className="mb-4 text-xs font-extrabold tracking-wider text-[#6B7280] uppercase">
                {t("terms.onThisPage")}
              </h2>
              <nav className="space-y-1">
                {sectionKeys.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block rounded-lg px-3 py-2 text-sm text-[#6B7280] transition-colors hover:bg-[#FFF5F5] hover:text-[#F45B69]"
                  >
                    {t(section.titleKey)}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <article className="min-w-0">
            <div className="mb-10">
              <div className="mb-4 inline-block rounded-full bg-[#F45B69]/10 px-4 py-1.5 text-xs font-bold tracking-wider text-[#F45B69] uppercase">
                {t("terms.badge")}
              </div>
              <h1 className="mb-4 text-4xl font-black tracking-tight text-[#111827] sm:text-5xl">
                {t("terms.title")}{" "}
                <span className="text-[#F45B69]">{t("terms.titleHighlight")}</span>
              </h1>
              <p className="text-sm text-[#6B7280]">
                {t("terms.lastUpdated")}
              </p>
              <p className="mt-2 max-w-[600px] leading-relaxed text-[#6B7280]">
                {t("terms.description")}
              </p>
            </div>

            <div
              className="mb-10 h-[1px]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgb(255, 204, 204), transparent)",
              }}
            />

            <div className="space-y-10">
              {sectionKeys.map((section) => (
                <section key={section.id} id={section.id}>
                  <h2 className="mb-4 text-xl font-bold text-[#111827]">
                    {t(section.titleKey)}
                  </h2>
                  <p className="leading-relaxed text-[#6B7280]">
                    {t(section.contentKey)}
                  </p>
                  {section.itemKeys && (
                    <ul className="mt-3 space-y-2">
                      {section.itemKeys.map((itemKey, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-[#6B7280]"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F45B69]" />
                          {t(itemKey)}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}

