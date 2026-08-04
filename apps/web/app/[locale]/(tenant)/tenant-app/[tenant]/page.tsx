"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

export default function TenantIndexPage() {
  const params = useParams()
  const router = useRouter()
  const locale = (params?.locale as string) || "en"

  useEffect(() => {
    router.replace(`/${locale}/dashboard`)
  }, [locale, router])

  return null
}
