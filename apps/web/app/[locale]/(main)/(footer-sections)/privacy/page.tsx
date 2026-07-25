"use client"

import React from "react"
import { useLocale } from "@/hooks/use-locale"
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

const sections = [
  {
    id: "information-we-collect",
    icon: <Database className="h-5 w-5" />,
    title: "Information We Collect",
    content: [
      "Account Information: When you sign up, we collect your name and email address to create and manage your account.",
      "Link Data: We store the original URLs you shorten, along with analytics data such as click counts, geographic locations, referrers, and device information.",
      "Usage Data: We automatically collect information about how you interact with our service, including pages visited, features used, and session duration.",
      "Cookies: We use essential cookies to maintain your session and optional analytics cookies to improve our service (you can disable these).",
    ],
  },
  {
    id: "how-we-use-your-data",
    icon: <Users className="h-5 w-5" />,
    title: "How We Use Your Data",
    content: [
      "To provide, maintain, and improve our URL shortening and analytics services.",
      "To display click analytics and insights for the links you create.",
      "To communicate with you about service updates, security alerts, and support inquiries.",
      "To detect, prevent, and address fraudulent or abusive usage of our platform.",
    ],
  },
  {
    id: "data-sharing",
    icon: <Shield className="h-5 w-5" />,
    title: "Data Sharing & Disclosure",
    content: [
      "We do not sell your personal data to third parties. Period.",
      "We may share anonymized, aggregated data (e.g., total click counts) for service improvement purposes.",
      "We may disclose your data if required by law or to protect our legal rights.",
      "We use third-party cloud infrastructure providers (e.g., AWS) to host our service, who are contractually bound to protect your data.",
    ],
  },
  {
    id: "cookies",
    icon: <Cookie className="h-5 w-5" />,
    title: "Cookies & Tracking",
    content: [
      "Essential Cookies: Required for the service to function (session management, authentication).",
      "Analytics Cookies: Help us understand how you use the platform so we can improve it.",
      "You can control cookie preferences through your browser settings at any time.",
      "We do not use cookies for third-party advertising or tracking across other websites.",
    ],
  },
  {
    id: "data-security",
    icon: <Lock className="h-5 w-5" />,
    title: "Data Security",
    content: [
      "We use industry-standard encryption (TLS/SSL) for all data in transit.",
      "Passwords are hashed and salted using bcrypt — we never store plain-text passwords.",
      "Regular security audits and penetration testing are performed on our infrastructure.",
      "We maintain strict access controls to any systems containing personal data.",
    ],
  },
  {
    id: "your-rights",
    icon: <Mail className="h-5 w-5" />,
    title: "Your Rights",
    content: [
      "Access: You can request a copy of the personal data we hold about you.",
      "Correction: You can update your account information at any time through your settings.",
      "Deletion: You can delete your account and all associated data at any time.",
      "Portability: You can request your data in a machine-readable format.",
      "To exercise any of these rights, contact us at privacy@uurl.uz.",
    ],
  },
]

export default function PrivacyPage() {
  const locale = useLocale()

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1200px] px-[32px] pt-[120px]">
        <Link
          href={`/${locale}`}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#6B7280] transition-colors hover:text-[#F45B69]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
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
              Legal
            </div>
            <h1 className="mb-4 text-4xl font-black tracking-tight text-[#111827] sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mb-2 text-[#6B7280]">
              Last updated:{" "}
              <span className="font-medium text-[#111827]">July 15, 2025</span>
            </p>
            <p className="max-w-[600px] text-base leading-relaxed text-[#6B7280]">
              At Uurl, we take your privacy seriously. This policy explains how
              we collect, use, and protect your personal information when you
              use our URL shortening service.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-[32px]">
        <div className="flex gap-12 lg:flex-row">
          <aside className="hidden w-[260px] shrink-0 lg:block">
            <div className="sticky top-[120px] space-y-1 rounded-2xl border border-[#E5E7EB] bg-white p-5">
              <h3 className="mb-3 text-xs font-bold tracking-wider text-[#6B7280] uppercase">
                On this page
              </h3>
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#6B7280] transition-colors hover:bg-[#FFF5F5] hover:text-[#F45B69]"
                >
                  <span className="shrink-0">{section.icon}</span>
                  <span>{section.title}</span>
                </a>
              ))}
            </div>
          </aside>

          <div className="min-w-0 flex-1 pb-[80px]">
            <div className="space-y-10">
              {sections.map((section, index) => (
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
                      {section.title}
                    </h2>
                  </div>
                  <div className="ml-12 space-y-3">
                    {section.content.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#F45B69]/40" />
                        <p className="text-sm leading-relaxed text-[#6B7280]">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                  {index < sections.length - 1 && (
                    <div className="mt-8 border-t border-[#E5E7EB]" />
                  )}
                </section>
              ))}
            </div>

            <div className="mt-16 rounded-2xl border border-[#E5E7EB] bg-[#FFF8F8] p-8">
              <h3 className="mb-3 text-lg font-bold text-[#111827]">
                Have questions about privacy?
              </h3>
              <p className="mb-4 text-sm text-[#6B7280]">
                If you have any questions or concerns about this privacy policy
                or how we handle your data, dont hesitate to reach out.
              </p>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#F45B69] px-5 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
