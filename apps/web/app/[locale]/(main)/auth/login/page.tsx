"use client"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginForm, loginSchema } from "@/lib/validations/auth"
import { GoogleButton } from "@/components/auth/google-btn"
import { TelegramWidget } from "@/components/auth/telegram-button"
import { useLocale } from "@/hooks/use-locale"
import { useTranslation } from "@/hooks/use-translation"
import { AuthLayout } from "@/components/auth/auth-layout"
import { Mail, Lock, ArrowRight } from "lucide-react"
import { useLoginMutation } from "@/hooks/use-auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const login = useLoginMutation()
  const locale = useLocale()
  const { t } = useTranslation()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await login.mutateAsync(data)
      if (res && (res as any).success === false) {
        toast.error((res as any).message || "Invalid email or password")
        return
      }
      toast.success("Welcome back!")
      router.push(`/${locale}/dashboard`)
    } catch (err: unknown) {
      const msg =
        (err as any)?.data?.message || (err as any)?.message || "Login failed"
      toast.error(msg)
    }
  }

  return (
    <AuthLayout
      title={t("auth.login.title")}
      subtitle={t("auth.login.subtitle")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-xs font-bold tracking-wider text-gray-700 uppercase">
            {t("auth.login.emailLabel")}
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              placeholder={t("auth.login.emailPlaceholder")}
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
          <div className="mb-1.5 flex items-center justify-between">
            <label className="block text-xs font-bold tracking-wider text-gray-700 uppercase">
              {t("auth.login.passwordLabel")}
            </label>
            <Link
              href={`/${locale}/auth/forget-password`}
              className="text-xs font-semibold text-[#F45B69] transition-colors hover:underline"
            >
              {t("auth.login.forgotPassword")}
            </Link>
          </div>
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#F45B69] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#F45B69]/30 transition-all hover:bg-[#e04b59] active:scale-[0.98] disabled:opacity-50"
        >
          <span>{t("auth.login.submitButton")}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>

        <p className="pt-1 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href={`/${locale}/auth/register`}
            className="font-bold text-[#F45B69] transition-colors hover:underline"
          >
            {t("auth.login.registerLink")}
          </Link>
        </p>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs tracking-wider text-gray-500 uppercase">
            <span className="bg-white px-3 font-semibold text-gray-400">
              {t("auth.login.continueWith")}
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
