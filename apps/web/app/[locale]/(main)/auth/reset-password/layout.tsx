import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reset Password — UURL",
  description:
    "Reset your UURL account password using the verification code sent to your email. Create a new password and regain access to your shortened links, QR codes, and analytics.",
  keywords: [
    "UURL reset password",
    "change password",
    "password recovery",
    "reset account password",
    "UURL account security",
    "forgot password OTP",
  ],
}

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
