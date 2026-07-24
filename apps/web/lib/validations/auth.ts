import { z } from "zod"

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export type LoginForm = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  avatar: z.union([z.url(), z.literal("")]).optional(),
})

export type RegisterForm = z.infer<typeof registerSchema>

export const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
})

export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z.object({
  email: z.email("Invalid email address"),

  otp: z.string().length(6, "OTP must be 6 digits"),

  newPassword: z.string().min(6, "Password must be at least 6 characters"),
})

export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>
