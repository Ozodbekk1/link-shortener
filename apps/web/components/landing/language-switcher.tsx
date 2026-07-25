"use client"

import { usePathname, useRouter } from "next/navigation"
import { Globe } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useLocale } from "@/hooks/use-locale"
import { useTranslation } from "@/hooks/use-translation"
import {
  LOCALES,
  LOCALE_LABELS,
  LOCALE_FLAGS,
  type Locale,
} from "@/config/i18n.config"

// type Locale = "en" | "uz" | "ru"

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale() as Locale
  const { t } = useTranslation()

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === currentLocale) return

    const segments = pathname.split("/")
    segments[1] = newLocale
    const newPath = segments.join("/")

    router.push(newPath)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
        aria-label={t("locale.language")}
      >
        {/* <Globe size={16} /> */}
        <span className="hidden sm:inline">{LOCALE_FLAGS[currentLocale]}</span>
        <span className="hidden md:inline">{LOCALE_LABELS[currentLocale]}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("locale.language")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {LOCALES.map((locale) => (
            <DropdownMenuItem
              key={locale}
              onClick={() => switchLocale(locale)}
              className={
                locale === currentLocale
                  ? "bg-accent font-semibold"
                  : "cursor-pointer"
              }
            >
              <span className="mr-2">{LOCALE_FLAGS[locale]}</span>
              {LOCALE_LABELS[locale]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
