"use client"
import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const params = useParams()
  const locale = params?.locale || "en"

  useEffect(() => {
    // Redirect to /{locale}/dashboard — the middleware rewrites subdomain
    // requests internally, so the browser URL stays clean (no /tenant-app/slug)
    router.replace(`/${locale}/dashboard`)
  }, [router, locale])
}
