export const LOCALES = ["en", "uz", "ru"] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = "en"

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  uz: "O'zbek",
  ru: "Русский",
}

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: "🇺🇸",
  uz: "🇺🇿",
  ru: "🇷🇺",
}
