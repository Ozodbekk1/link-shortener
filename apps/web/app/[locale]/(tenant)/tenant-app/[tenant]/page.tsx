"use client"
import { useEffect } from "react"
import { useParams } from "next/navigation"

export default function ProfilePage() {
  const params = useParams()
  const locale = (params?.locale as string) || "en"

  useEffect(() => {
    window.location.replace(`/${locale}/dashboard`)
  }, [locale])
}
