"use client"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RegisterForm, registerSchema } from "@/lib/validations/auth"
import { GoogleButton } from "@/components/auth/google-btn"
import { TelegramWidget } from "@/components/auth/telegram-button"
import { useLocale } from "@/hooks/use-locale"
import { useTranslation } from "@/hooks/use-translation"
import { AuthLayout } from "@/components/auth/auth-layout"
import { User, Mail, Lock, Image as ImageIcon, ArrowRight } from "lucide-react"

export default function RegisterPage() {
  const locale = useLocale()
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  function onSubmit(values: RegisterForm) {
    const payload = {
      ...values,
      avatar: values.avatar || undefined,
    }

    console.log(payload)
    // registerMutation.mutate(payload)
  }

  return (
    <AuthLayout
      title={t("auth.register.title")}
      subtitle={t("auth.register.subtitle")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-700">
            {t("auth.register.nameLabel")}
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
              <User className="h-4 w-4" />
            </div>
            <input
              placeholder={t("auth.register.namePlaceholder")}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-[#F45B69] focus:outline-none focus:ring-2 focus:ring-[#F45B69]/20"
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-700">
            {t("auth.register.emailLabel")}
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              placeholder={t("auth.register.emailPlaceholder")}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-[#F45B69] focus:outline-none focus:ring-2 focus:ring-[#F45B69]/20"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-700">
            {t("auth.register.passwordLabel")}
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-[#F45B69] focus:outline-none focus:ring-2 focus:ring-[#F45B69]/20"
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-700">
            {t("auth.register.avatarLabel")}
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
              <ImageIcon className="h-4 w-4" />
            </div>
            <input
              placeholder={t("auth.register.avatarPlaceholder")}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-[#F45B69] focus:outline-none focus:ring-2 focus:ring-[#F45B69]/20"
              {...register("avatar")}
            />
          </div>
          {errors.avatar && (
            <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.avatar.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#F45B69] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#F45B69]/30 transition-all hover:bg-[#e04b59] active:scale-[0.98] disabled:opacity-50 mt-2"
        >
          <span>{t("auth.register.submitButton")}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>

        <p className="pt-1 text-center text-sm text-gray-600">
          {t("auth.register.alreadyHaveAccount")}{" "}
          <Link
            href={`/${locale}/auth/login`}
            className="font-bold text-[#F45B69] transition-colors hover:underline"
          >
            {t("auth.register.loginLink")}
          </Link>
        </p>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs text-gray-500 uppercase tracking-wider">
            <span className="bg-white px-3 font-semibold text-gray-400">
              {t("auth.register.continueWith")}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <GoogleButton
            onClick={() => {
              console.log("Google Login")
            }}
          />

          <div className="flex items-center justify-center pt-1">
            <TelegramWidget
              onAuth={(user) => {
                console.log(user)
              }}
            />
          </div>
        </div>
      </form>
    </AuthLayout>
  )
}


