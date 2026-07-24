import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Forgot Password — UURL",
  description:
    "Reset your UURL account password securely. Enter your email address to receive a password reset link and regain access to your shortened links, QR codes, and analytics.",
  keywords: [
    "UURL forgot password",
    "reset password",
    "recover account",
    "password recovery",
    "reset UURL password",
    "account security",
  ],
}

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
