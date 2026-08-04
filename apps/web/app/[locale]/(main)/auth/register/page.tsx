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
import {
  User,
  Mail,
  Lock,
  Image as ImageIcon,
  ArrowRight,
  Loader2,
} from "lucide-react"
import { useRegisterMutation, useTelegramLoginMutation } from "@/hooks/use-auth"
import { authService } from "@/services/auth.service"
import { usePostAuthRedirect } from "@/hooks/use-post-auth-redirect"
import { GuestGuard } from "@/components/auth/guest-guard"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const registerAuth = useRegisterMutation()
  const telegramLogin = useTelegramLoginMutation()
  const { handleRedirect, isRedirecting } = usePostAuthRedirect()
  const locale = useLocale()
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerAuth.mutateAsync(data)
      toast.success("Account created! Please verify your email.")
      router.push(
        `/${locale}/auth/verify-account?email=${encodeURIComponent(data.email)}`
      )
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string }; message?: string })?.data
          ?.message ||
        (err as Error)?.message ||
        "Registration failed"
      toast.error(msg)
    }
  }

  const handleGoogleAuth = () => {
    window.location.href = authService.googleAuthUrl(locale)
  }

  const handleTelegramAuth = async (user: Record<string, unknown>) => {
    try {
      await telegramLogin.mutateAsync(user)
      toast.success("Welcome!")
      await handleRedirect()
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string }; message?: string })?.data
          ?.message ||
        (err as Error)?.message ||
        "Telegram sign up failed"
      toast.error(msg)
    }
  }

  const isLoading = isSubmitting || registerAuth.isPending || isRedirecting

  return (
    <GuestGuard>
      <AuthLayout
        title={t("auth.register.title")}
        subtitle={t("auth.register.subtitle")}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold tracking-wider text-gray-700 uppercase">
              {t("auth.register.nameLabel")}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <User className="h-4 w-4" />
              </div>
              <input
                placeholder={t("auth.register.namePlaceholder")}
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-10 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-[#F45B69] focus:ring-2 focus:ring-[#F45B69]/20 focus:outline-none"
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="mt-1.5 text-xs font-medium text-rose-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold tracking-wider text-gray-700 uppercase">
              {t("auth.register.emailLabel")}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                placeholder={t("auth.register.emailPlaceholder")}
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-10 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-[#F45B69] focus:ring-2 focus:ring-[#F45B69]/20 focus:outline-none"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs font-medium text-rose-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold tracking-wider text-gray-700 uppercase">
              {t("auth.register.passwordLabel")}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-10 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-[#F45B69] focus:ring-2 focus:ring-[#F45B69]/20 focus:outline-none"
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs font-medium text-rose-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold tracking-wider text-gray-700 uppercase">
              {t("auth.register.avatarLabel")}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <ImageIcon className="h-4 w-4" />
              </div>
              <input
                placeholder={t("auth.register.avatarPlaceholder")}
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-10 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-[#F45B69] focus:ring-2 focus:ring-[#F45B69]/20 focus:outline-none"
                {...register("avatar")}
              />
            </div>
            {errors.avatar && (
              <p className="mt-1.5 text-xs font-medium text-rose-500">
                {errors.avatar.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#F45B69] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#F45B69]/30 transition-all hover:bg-[#e04b59] active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>{t("auth.register.submitButton")}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
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
            <div className="relative flex justify-center text-xs tracking-wider text-gray-500 uppercase">
              <span className="bg-white px-3 font-semibold text-gray-400">
                {t("auth.register.continueWith")}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <GoogleButton onClick={handleGoogleAuth} loading={isLoading} />

            <div className="flex items-center justify-center pt-1">
              <TelegramWidget onAuth={handleTelegramAuth} />
            </div>
          </div>
        </form>
      </AuthLayout>
    </GuestGuard>
  )
}
