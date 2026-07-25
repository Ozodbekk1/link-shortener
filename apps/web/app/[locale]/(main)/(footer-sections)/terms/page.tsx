"use client"

import React from "react"
import { useLocale } from "@/hooks/use-locale"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content:
      "By accessing or using Uurl (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, you may not use the Service. We reserve the right to update these terms at any time, and continued use constitutes acceptance of changes.",
  },
  {
    id: "description",
    title: "2. Service Description",
    content:
      "Uurl provides a URL shortening and link management platform. This includes link creation, analytics, custom domains, QR code generation, and redirect management. All core features are available free of charge.",
  },
  {
    id: "accounts",
    title: "3. User Accounts",
    content:
      "You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information and keep it updated. You are liable for all activities under your account. Notify us immediately of any unauthorized use.",
    items: [
      "You must be at least 13 years of age",
      "One person may not maintain multiple accounts without permission",
      "Accounts found to be in violation may be suspended or terminated",
    ],
  },
  {
    id: "acceptable-use",
    title: "4. Acceptable Use",
    content:
      "You agree not to use Uurl for any illegal, harmful, or abusive purposes. This includes, but is not limited to:",
    items: [
      "Spamming, phishing, or distributing malware",
      "Hosting content that infringes intellectual property rights",
      "Engaging in denial-of-service attacks or network abuse",
      "Creating links that redirect to illegal or harmful content",
      "Attempting to bypass our security measures",
    ],
  },
  {
    id: "content",
    title: "5. User Content & Links",
    content:
      "You retain all rights to the content you share through Uurl links. However, you grant us a license to process, store, and transmit this content as necessary to provide the Service. We reserve the right to remove any links or content that violate these terms.",
  },
  {
    id: "analytics",
    title: "6. Analytics & Data",
    content:
      "Uurl collects basic analytics data (click counts, referrer data, geographic location, device type) to provide our Service. This data is anonymized and aggregated where possible. You can view detailed analytics for links you create through your dashboard.",
  },
  {
    id: "service-level",
    title: "7. Service Level",
    content:
      "We strive for 99.9% uptime but do not guarantee uninterrupted service. The Service is provided &ldquo;as is&rdquo; without warranties of any kind, either express or implied. We are not liable for any damages arising from the use or inability to use the Service.",
  },
  {
    id: "limitation",
    title: "8. Limitation of Liability",
    content:
      "To the maximum extent permitted by law, Uurl shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Our total liability shall not exceed the amount you paid us (if any) in the past 12 months.",
  },
  {
    id: "termination",
    title: "9. Termination",
    content:
      "We reserve the right to suspend or terminate your access to the Service at any time, without prior notice, for conduct that we believe violates these terms or is harmful to other users, us, or third parties. Upon termination, your right to use the Service immediately ceases.",
  },
  {
    id: "governing-law",
    title: "10. Governing Law",
    content:
      "These terms shall be governed by and construed in accordance with the laws of Uzbekistan, without regard to its conflict of law provisions. Any disputes arising from these terms shall be resolved in the courts of Uzbekistan.",
  },
  {
    id: "contact",
    title: "11. Contact Information",
    content:
      "For questions about these Terms of Service, please contact us. We aim to respond to all inquiries within 48 hours.",
  },
]

export default function TermsPage() {
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

      <div className="mx-auto max-w-[1200px] px-[32px] pb-[80px]">
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-12">
          <aside className="mb-10 lg:mb-0">
            <div className="lg:sticky lg:top-[120px]">
              <h2 className="mb-4 text-xs font-extrabold tracking-wider text-[#6B7280] uppercase">
                On this page
              </h2>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block rounded-lg px-3 py-2 text-sm text-[#6B7280] transition-colors hover:bg-[#FFF5F5] hover:text-[#F45B69]"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <article className="min-w-0">
            <div className="mb-10">
              <div className="mb-4 inline-block rounded-full bg-[#F45B69]/10 px-4 py-1.5 text-xs font-bold tracking-wider text-[#F45B69] uppercase">
                Legal
              </div>
              <h1 className="mb-4 text-4xl font-black tracking-tight text-[#111827] sm:text-5xl">
                Terms of <span className="text-[#F45B69]">Service</span>
              </h1>
              <p className="text-sm text-[#6B7280]">
                Last updated: July 15, 2025
              </p>
              <p className="mt-2 max-w-[600px] leading-relaxed text-[#6B7280]">
                Please read these terms carefully before using Uurl. By using
                our service, you agree to be bound by these terms.
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
              {sections.map((section) => (
                <section key={section.id} id={section.id}>
                  <h2 className="mb-4 text-xl font-bold text-[#111827]">
                    {section.title}
                  </h2>
                  <p className="leading-relaxed text-[#6B7280]">
                    {section.content}
                  </p>
                  {section.items && (
                    <ul className="mt-3 space-y-2">
                      {section.items.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-[#6B7280]"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F45B69]" />
                          {item}
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
