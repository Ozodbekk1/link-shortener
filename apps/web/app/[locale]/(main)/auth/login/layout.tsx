import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Log in to your Account — UURL",
  description:
    "Log in UURL account to shorten links, generate QR codes, manage branded URLs, track click analytics, and organize all your links in one place.",
  keywords: [
    "UURL",
    "link shortener",
    "short URL",
    "create account",
    "URL shortening",
    "QR code generator",
    "link analytics",
    "custom short links",
  ],
}

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
