"use client"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLocale } from "@/hooks/use-locale"
import { useTranslation } from "@/hooks/use-translation"
import { AuthLayout } from "@/components/auth/auth-layout"
import { Mail, ArrowRight, ArrowLeft } from "lucide-react"

import {
  ForgotPasswordForm,
  forgotPasswordSchema,
} from "@/lib/validations/auth"

export default function ForgotPasswordPage() {
  const locale = useLocale()
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  async function onSubmit(data: ForgotPasswordForm) {
    console.log(data)

    // later:
    // await forgotPassword({ email: data.email })
    // router.push(`/${locale}/auth/reset-password?email=${data.email}`)
  }

  return (
    <AuthLayout
      title={t("auth.forgotPassword.title")}
      subtitle={t("auth.forgotPassword.subtitle")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-700">
            {t("auth.forgotPassword.emailLabel")}
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              placeholder={t("auth.forgotPassword.emailPlaceholder")}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-[#F45B69] focus:outline-none focus:ring-2 focus:ring-[#F45B69]/20"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#F45B69] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#F45B69]/30 transition-all hover:bg-[#e04b59] active:scale-[0.98] disabled:opacity-50"
        >
          <span>{t("auth.forgotPassword.submitButton")}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>

        <div className="pt-2 text-center">
          <Link
            href={`/${locale}/auth/login`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 transition-colors hover:text-[#F45B69]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("auth.forgotPassword.backToLogin")}
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}


