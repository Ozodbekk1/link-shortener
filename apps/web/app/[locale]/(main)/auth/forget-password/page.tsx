"use client"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  ForgotPasswordForm,
  forgotPasswordSchema,
} from "@/lib/validations/auth"

export default function ForgotPasswordPage() {
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
    //
    // await forgotPassword({
    //   email:data.email
    // })

    // redirect:
    // router.push(
    // `/auth/reset-password?email=${data.email}`
    // )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm rounded-xl border bg-background p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Forgot password?</h1>

          <p className="mt-2 text-muted-foreground">
            We will send a reset OTP to your email.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label>Email</Label>

            <Input
              type="email"
              placeholder="john@example.com"
              {...register("email")}
            />

            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <Button className="w-full" disabled={isSubmitting} type="submit">
            Send OTP
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
