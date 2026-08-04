"use client"
import React, { useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useLocale } from "@/hooks/use-locale"
import { useTranslation } from "@/hooks/use-translation"
import { useVerifyOtpMutation } from "@/hooks/use-auth"
import { usePostAuthRedirect } from "@/hooks/use-post-auth-redirect"
import { AuthLayout } from "@/components/auth/auth-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Mail, Loader2, ArrowRight } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"

const OTP_LENGTH = 6

export default function VerifyAccountPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const locale = useLocale()
  const { t } = useTranslation()

  const email = searchParams.get("email")

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>(
    Array(OTP_LENGTH).fill(null)
  )

  const {
    mutate: verifyOtp,
    isPending,
    error: mutationError,
  } = useVerifyOtpMutation()

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return

      const digit = value.slice(0, 1)
      const newOtp = [...otp]
      newOtp[index] = digit
      setOtp(newOtp)

      if (digit && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    },
    [otp]
  )

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    },
    [otp]
  )

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      const pastedData = e.clipboardData
        .getData("text/plain")
        .replace(/\D/g, "")
      const digits = pastedData.slice(0, OTP_LENGTH).split("")

      const newOtp = [...otp]
      digits.forEach((digit, i) => {
        newOtp[i] = digit
      })
      setOtp(newOtp)

      const focusIndex = Math.min(digits.length, OTP_LENGTH - 1)
      inputRefs.current[focusIndex]?.focus()
    },
    [otp]
  )

  const otpCode = otp.join("")
  const isOtpComplete = otpCode.length === OTP_LENGTH

  const { handleRedirect } = usePostAuthRedirect()

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      if (!email || !isOtpComplete) return

      verifyOtp(
        { email, otpCode },
        {
          onSuccess: async () => {
            toast.success(
              t("auth.verifyAccount.successMessage") ||
                "Email verified successfully!"
            )
            await handleRedirect()
          },
          onError: (error: unknown) => {
            const message =
              (error as { response?: { data?: { message?: string } } })
                ?.response?.data?.message ||
              (error as Error)?.message ||
              t("auth.verifyAccount.errorMessage") ||
              "Verification failed. Please try again."
            toast.error(message)
          },
        }
      )
    },
    [email, otpCode, isOtpComplete, verifyOtp, handleRedirect, t]
  )

  return (
    <AuthLayout
      title={t("auth.verifyAccount.title")}
      subtitle={t("auth.verifyAccount.subtitle")}
    >
      <Card className="mx-auto w-full max-w-md border-0 bg-white shadow-none">
        <CardHeader className="space-y-6 px-6 pt-2 pb-2 text-center">
          <div className="flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#F45B69]/10">
              <svg
                viewBox="0 0 120 120"
                className="h-14 w-14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="#F45B69"
                  fillOpacity="0.08"
                />

                <rect
                  x="26"
                  y="34"
                  width="68"
                  height="46"
                  rx="8"
                  fill="#F45B69"
                  fillOpacity="0.12"
                  stroke="#F45B69"
                  strokeWidth="2"
                />

                <path
                  d="M30 38L60 58L90 38"
                  stroke="#F45B69"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <circle cx="86" cy="78" r="14" fill="#F45B69" />

                <path
                  d="M81 78L85 82L92 74"
                  stroke="white"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {t("auth.verifyAccount.checkEmail") || "Check your email"}
            </CardTitle>

            <CardDescription className="mx-auto max-w-xs text-sm leading-6 text-gray-500">
              {t("auth.verifyAccount.otpSent") ||
                "We've sent a 6-digit verification code to"}

              <span className="mt-2 block font-semibold break-all text-gray-800">
                {email}
              </span>
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8 px-6">
            <div className="space-y-4">
              <p className="text-center text-xs font-semibold tracking-[0.25em] text-gray-400 uppercase">
                {t("auth.verifyAccount.enterCode") || "Enter Verification Code"}
              </p>

              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    aria-label={`Digit ${index + 1}`}
                    className="h-14 w-11 rounded-2xl border border-gray-200 bg-white p-0 text-center text-2xl font-bold shadow-none ring-0 transition-all duration-200 outline-none focus:border-[#F45B69] focus:ring-4 focus:ring-[#F45B69]/10 focus:outline-none focus-visible:border-[#F45B69] focus-visible:ring-0 focus-visible:ring-offset-0 sm:w-12 md:w-14"
                  />
                ))}
              </div>
            </div>

            {mutationError && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <p className="text-center text-sm text-red-500">
                  {(
                    mutationError as {
                      response?: {
                        data?: {
                          message?: string
                        }
                      }
                    }
                  )?.response?.data?.message ||
                    (mutationError as Error)?.message ||
                    t("auth.verifyAccount.errorMessage") ||
                    "Verification failed. Please try again."}
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-5 border-0 bg-white px-6 pt-2 pb-6">
            <Button
              type="submit"
              disabled={!isOtpComplete || isPending}
              className="h-14 w-full rounded-2xl bg-[#F45B69] text-sm font-semibold text-white shadow-lg shadow-[#F45B69]/20 transition-all duration-200 hover:bg-[#e04b59] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("auth.verifyAccount.verifying") || "Verifying..."}
                </>
              ) : (
                <>
                  {t("auth.verifyAccount.submitButton") || "Verify Email"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <div className="space-y-2 text-center">
              <p className="text-sm text-gray-400">
                {t("auth.verifyAccount.didntReceive") ||
                  "Didn't receive the code?"}
              </p>

              <button
                type="button"
                onClick={() =>
                  toast.info(
                    t("auth.verifyAccount.resendInfo") ||
                      "If you don't see the email, check your spam folder."
                  )
                }
                className="font-semibold text-[#F45B69] transition-colors hover:underline"
              >
                {t("auth.verifyAccount.resend") || "Resend Code"}
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </AuthLayout>
  )
}
