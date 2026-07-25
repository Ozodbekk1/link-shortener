"use client"

import React from "react"
import Link from "next/link"
import { useLocale } from "@/hooks/use-locale"
import { useTranslation } from "@/hooks/use-translation"
import { AuthLayout } from "@/components/auth/auth-layout"
import { CheckCircle2, ArrowRight } from "lucide-react"

export default function VerifyAccountPage() {
  const locale = useLocale()
  const { t } = useTranslation()

  return (
    <AuthLayout
      title={t("auth.verifyAccount.title")}
      subtitle={t("auth.verifyAccount.subtitle")}
    >
      <div className="flex flex-col items-center justify-center py-6 text-center space-y-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F45B69]/10 text-[#F45B69]">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <Link
          href={`/${locale}/auth/login`}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#F45B69] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#F45B69]/30 transition-all hover:bg-[#e04b59] active:scale-[0.98]"
        >
          <span>{t("auth.login.submitButton")}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </AuthLayout>
  )
}


