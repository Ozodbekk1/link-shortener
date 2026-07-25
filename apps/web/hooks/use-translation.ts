"use client"

import { useCallback, useEffect, useState } from "react"
import { useLocale } from "@/hooks/use-locale"
import type { Locale } from "@/config/i18n.config"

type TranslationDictionary = Record<string, unknown>

const cache = new Map<Locale, TranslationDictionary>()

function getNestedValue(obj: TranslationDictionary, path: string): string {
  const keys = path.split(".")
  let current: unknown = obj

  for (const key of keys) {
    if (current == null || typeof current !== "object") {
      return path
    }
    current = (current as Record<string, unknown>)[key]
  }

  if (typeof current === "string") {
    return current
  }

  return path
}

async function loadTranslations(
  locale: Locale
): Promise<TranslationDictionary> {
  const cached = cache.get(locale)
  if (cached) return cached

  const response = await fetch(`/locales/${locale}/common.json`)
  if (!response.ok) {
    console.error(`Failed to load translations for locale: ${locale}`)
    return {}
  }

  const data = (await response.json()) as TranslationDictionary
  cache.set(locale, data)
  return data
}

export function useTranslation() {
  const locale = useLocale() as Locale
  const [translations, setTranslations] = useState<TranslationDictionary>(
    () => cache.get(locale) ?? {}
  )
  const [isLoading, setIsLoading] = useState(!cache.has(locale))

  useEffect(() => {
    let cancelled = false

    const load = async () => {
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
    (key: string): string => {
      return getNestedValue(translations, key)
    },
    [translations]
  )

  return { t, locale, isLoading }
}
