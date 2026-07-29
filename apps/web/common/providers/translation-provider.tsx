"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react"
import { useLocale } from "@/hooks/use-locale"
import type { Locale } from "@/config/i18n.config"

type TranslationDictionary = Record<string, unknown>
const cache = new Map<Locale, TranslationDictionary>()

function getNestedValue(obj: TranslationDictionary, path: string): string {
  const keys = path.split(".")
  let current: unknown = obj

  for (const key of keys) {
    if (current == null || typeof current !== "object") return path
    current = (current as Record<string, unknown>)[key]
  }

  return typeof current === "string" ? current : path
}

async function loadTranslations(
  locale: Locale
): Promise<TranslationDictionary> {
  const cached = cache.get(locale)
  if (cached) return cached

  try {
    const response = await fetch(`/locales/${locale}/common.json`)
    if (!response.ok) return {}
    const data = (await response.json()) as TranslationDictionary
    cache.set(locale, data)
    return data
  } catch (error) {
    console.error(`Failed to load translations for ${locale}`, error)
    return {}
  }
}

interface TranslationContextType {
  t: (key: string) => string
  locale: Locale
  isLoading: boolean
}

const TranslationContext = createContext<TranslationContextType | null>(null)

export function TranslationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = useLocale() as Locale
  const [translations, setTranslations] = useState<TranslationDictionary>(
    () => cache.get(locale) ?? {}
  )
  const [isLoading, setIsLoading] = useState(!cache.has(locale))

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      const data = await loadTranslations(locale)
      if (!cancelled) {
        setTranslations(data)
        setIsLoading(false)
      }
    }

    if (cache.has(locale)) {
      setTranslations(cache.get(locale)!)
      setIsLoading(false)
    } else {
      load()
    }

    return () => {
      cancelled = true
    }
  }, [locale])

  const t = useCallback(
    (key: string): string => getNestedValue(translations, key),
    [translations]
  )

  // Block rendering children (or show your layout spinner) until translations load
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        {/* Your custom full-screen loader here */}
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
      </div>
    )
  }

  return (
    <TranslationContext.Provider value={{ t, locale, isLoading }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }
  return context
}
