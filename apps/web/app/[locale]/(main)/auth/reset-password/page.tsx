"use client"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ResetPasswordForm, resetPasswordSchema } from "@/lib/validations/auth"

export default function ResetPasswordPage() {
  const params = useSearchParams()

  const email = params.get("email") || ""

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),

    defaultValues: {
      email,
    },
  })

  function onSubmit(data: ResetPasswordForm) {
    console.log(data)
    console.log("data")

    // later:
    //
    // resetPasswordMutation.mutate(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm rounded-xl border bg-background p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Reset password</h1>

          <p className="mt-2 text-muted-foreground">
            Enter the OTP from your email.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <input type="hidden" {...register("email")} />

          <div className="space-y-2">
            <Label>OTP</Label>

            <Input placeholder="123456" maxLength={6} {...register("otp")} />

            {errors.otp && (
              <p className="text-sm text-destructive">{errors.otp.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>New password</Label>

            <Input
              type="password"
              placeholder="New password"
              {...register("newPassword")}
            />

            {errors.newPassword && (
              <p className="text-sm text-destructive">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <Button className="w-full" disabled={isSubmitting} type="submit">
            Reset password
          </Button>

          <div className="text-center text-sm">
            <Link href="/auth/login" className="underline">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
