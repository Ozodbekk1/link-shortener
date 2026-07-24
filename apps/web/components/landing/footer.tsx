import React from "react"
import Image from "next/image"
import Link from "next/link"

const productLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Integrations", href: "#" },
  { label: "API", href: "#" },
  { label: "Changelog", href: "#" },
]

const resourceLinks = [
  { label: "Documentation", href: "#" },
  { label: "Guides", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Community", href: "#" },
  { label: "Support", href: "#" },
]

const companyLinks = [
  { label: "About", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Contact", href: "#" },
]

const socialLinks = [
  {
    label: "X (Twitter)",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer id="about" className="relative bg-white">
      <div
        className="absolute top-0 right-0 left-0 h-[1px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgb(255, 204, 204), transparent)",
        }}
      />

      <div className="mx-auto max-w-[1200px] px-[32px] py-[80px]">
        <div className="grid grid-cols-1 gap-[48px] sm:grid-cols-2 lg:grid-cols-12 lg:gap-[32px]">
          <div className="sm:col-span-2 lg:col-span-4">
            <Link href="/" className="mb-[20px] inline-block">
              <Image
                src="/icons/logo.png"
                alt="Uurl"
                width={400}
                height={400}
                className="h-[120px] w-auto"
              />
            </Link>

            <p className="mb-[24px] max-w-[320px] text-[14px] leading-[1.7] text-[#6B7280]">
              The free forever URL shortener with powerful analytics, custom
              domains, QR codes, and smart redirect rules. No limits. No
              subscriptions.
            </p>

            <div className="flex items-center gap-[10px]">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-[36px] w-[36px] items-center justify-center rounded-[10px] text-[#6B7280] transition-all duration-200 hover:bg-[#FFE5E5] hover:text-[#F45B69]"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          <div className="sm:col-span-1 lg:col-span-2 lg:col-start-7">
            <h3 className="mb-[16px] text-[13px] font-extrabold tracking-wider text-[#151515] uppercase">
              Product
            </h3>
            <ul className="flex flex-col gap-[12px]">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-[#6B7280] transition-colors duration-200 hover:text-[#F45B69]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-1 lg:col-span-2">
            <h3 className="mb-[16px] text-[13px] font-extrabold tracking-wider text-[#151515] uppercase">
              Resources
            </h3>
            <ul className="flex flex-col gap-[12px]">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-[#6B7280] transition-colors duration-200 hover:text-[#F45B69]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-1 lg:col-span-2">
            <h3 className="mb-[16px] text-[13px] font-extrabold tracking-wider text-[#151515] uppercase">
              Company
            </h3>
            <ul className="flex flex-col gap-[12px]">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-[#6B7280] transition-colors duration-200 hover:text-[#F45B69]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-[64px] pt-[24px]"
          style={{
            borderTop: "1px solid #E5E7EB",
          }}
        >
          <div className="flex flex-col items-center justify-between gap-[16px] sm:flex-row">
            <p className="text-[13px] text-[#6B7280]">
              &copy; {new Date().getFullYear()} Uurl. All rights reserved.
            </p>

            <div className="flex items-center gap-[20px]">
              <Link
                href="#"
                className="text-[13px] text-[#6B7280] transition-colors duration-200 hover:text-[#F45B69]"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-[13px] text-[#6B7280] transition-colors duration-200 hover:text-[#F45B69]"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-[13px] text-[#6B7280] transition-colors duration-200 hover:text-[#F45B69]"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
