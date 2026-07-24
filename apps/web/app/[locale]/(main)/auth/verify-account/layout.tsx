import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Verify Your Account — UURL",
  description:
    "Verify your email address to activate your UURL account and start creating, managing, and tracking your shortened links securely.",
  keywords: [
    "UURL verify account",
    "email verification",
    "verify email",
    "activate account",
    "account verification",
    "UURL account activation",
  ],
}

export default function VerifyAccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
