"use client"

import { useEffect, useRef } from "react"

type TelegramUser = {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramUser) => void
  }
}

type TelegramWidgetProps = {
  onAuth?: (user: TelegramUser) => void
}

export function TelegramWidget({ onAuth }: TelegramWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.onTelegramAuth = (user) => {
      console.log("Telegram user:", user)

      onAuth?.(user)
    }

    const script = document.createElement("script")

    script.src = "https://telegram.org/js/telegram-widget.js?22"

    script.async = true

    script.setAttribute("data-telegram-login", "uurl_uz_oauth_bot")

    script.setAttribute("data-size", "large")

    script.setAttribute("data-request-access", "write")

    script.setAttribute("data-onauth", "onTelegramAuth(user)")

    containerRef.current?.appendChild(script)

    return () => {
      containerRef.current?.replaceChildren()
      delete window.onTelegramAuth
    }
  }, [onAuth])

  return <div ref={containerRef} className="flex justify-center" />
}
