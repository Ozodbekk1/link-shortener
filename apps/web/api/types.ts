export type QueryValue = string | number | boolean | null | undefined

export type QueryParams = object

export interface ApiErrorPayload {
  message?: string
  error?: string
  errors?: Array<{ msg?: string; path?: string }>
  [key: string]: unknown
}

export interface AppUser {
  _id: string
  fullName?: string
  username?: string
  email?: string
  role?: "user" | "admin" | "superadmin"
  plan?: "free" | "pro" | "premium"
  xp?: number
  streak?: number
  eloRating?: number
  level?: number
  photoUrl?: string
  avatar?: string
  profileBg?: string
  bio?: string
  [key: string]: unknown
}
