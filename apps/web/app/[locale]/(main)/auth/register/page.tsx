"use client"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RegisterForm, registerSchema } from "@/lib/validations/auth"
import { GoogleButton } from "@/components/auth/google-btn"
import { TelegramWidget } from "@/components/auth/telegram-button"

export default function RegisterPage() {
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
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm rounded-xl border bg-background p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Create account</h1>

          <p className="mt-2 text-muted-foreground">
            Start shortening your links today.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label>Name</Label>

            <Input placeholder="John Doe" {...register("name")} />

            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

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

          <div className="space-y-2">
            <Label>Avatar URL</Label>

            <Input
              placeholder="https://example.com/avatar.png"
              {...register("avatar")}
            />

            {errors.avatar && (
              <p className="text-sm text-destructive">
                {errors.avatar.message}
              </p>
            )}
          </div>

          <Button className="w-full" disabled={isSubmitting} type="submit">
            Create account
          </Button>

          <p className="text-center text-sm">
            Already have an account ?{" "}
            <Link href="/auth/login" className="font-medium underline">
              Login
            </Link>
          </p>
        </form>
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
      </div>
    </div>
  )
}
