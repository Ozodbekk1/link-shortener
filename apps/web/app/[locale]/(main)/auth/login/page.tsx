"use client"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoginForm, loginSchema } from "@/lib/validations/auth"
import { GoogleButton } from "@/components/auth/google-btn"
import { TelegramWidget } from "@/components/auth/telegram-button"

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  function onSubmit(data: LoginForm) {
    console.log(data)

    // loginMutation.mutate(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm rounded-xl border bg-background p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Welcome back</h1>

          <p className="mt-2 text-muted-foreground">
            Login to your UURL account.
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

          <div className="space-y-2">
            <Label>Password</Label>

            <Input type="password" {...register("password")} />

            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button className="w-full" disabled={isSubmitting} type="submit">
            Login
          </Button>

          <div className="text-md flex justify-between">
            <Link href="/auth/forget-password" className="underline">
              Forgot password ?
            </Link>

            <Link href="/auth/register" className="underline">
              Register
            </Link>
          </div>
          <div className="relative mt-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60" />
            </div>
            <div className="text-md relative flex justify-center">
              <span className="bg-background px-3 text-muted-foreground">
                Continue With
              </span>
            </div>
          </div>

          <div className="m-3.5 flex items-center justify-center">
            <GoogleButton
              onClick={() => {
                console.log("Google Login")
              }}
            />
          </div>

          <div className="m-3.5 flex items-center justify-center">
            <TelegramWidget
              onAuth={(user) => {
                console.log(user)

                // later:
                // await api.post("/auth/telegram", user)
              }}
            />
          </div>
        </form>
      </div>
    </div>
  )
}
