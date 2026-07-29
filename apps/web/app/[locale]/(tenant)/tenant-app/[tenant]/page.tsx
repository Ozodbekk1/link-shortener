"use client"
import { useEffect } from "react"
import { useParams } from "next/navigation"

export default function ProfilePage() {
  const params = useParams()
  const locale = (params?.locale as string) || "en"

  useEffect(() => {
    // Use a hard navigation (not client-side router) so the browser makes a
    // real HTTP request. This ensures the middleware runs, detects the
    // subdomain from the Host header, and rewrites to the correct tenant
    // dashboard route internally. router.replace() is a client-side nav that
    // can bypass the middleware rewrite and land on the wrong page.
    window.location.replace(`/${locale}/dashboard`)
  }, [locale])
}

