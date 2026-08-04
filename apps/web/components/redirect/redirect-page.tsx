"use client"

import { useEffect, useState } from "react"
import {
  AlertCircle,
  KeyRound,
  LockKeyhole,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { ApiError } from "@/api/clients"
import { redirectsService } from "@/services/redirects.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function RedirectPage({ slug }: { slug: string }) {
  const [password, setPassword] = useState("")
  const [submittedPassword, setSubmittedPassword] = useState<
    string | undefined
  >()
  const validation = useQuery({
    queryKey: ["redirect", "validate", slug, submittedPassword],
    queryFn: () =>
      redirectsService.validateRedirect(slug, { password: submittedPassword }),
    retry: false,
  })

  const link = validation.data
  const isUnavailable =
    link &&
    (link.status !== "ACTIVE" ||
      link.isExpired ||
      (typeof link.clickLimit === "number" &&
        link.currentClicks >= link.clickLimit))

  useEffect(() => {
    if (!link || isUnavailable) return
    window.location.replace(
      redirectsService.getRedirectUrl(slug, { password: submittedPassword })
    )
  }, [isUnavailable, link, slug, submittedPassword])

  const error = validation.error instanceof ApiError ? validation.error : null
  const needsPassword =
    error?.status === 401 || link?.isPasswordProtected === true

  if (validation.isLoading) return null
  if (needsPassword)
    return (
      <RedirectShell>
        <LockKeyhole className="size-7" />
        <div>
          <h1 className="font-semibold">This link is protected</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter the password to continue.
          </p>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            setSubmittedPassword(password)
          }}
          className="flex w-full max-w-sm gap-2"
        >
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoFocus
            placeholder="Link password"
          />
          <Button type="submit">
            <KeyRound />
            Continue
          </Button>
        </form>
        {submittedPassword && error && (
          <p className="text-sm text-destructive">{error.message}</p>
        )}
      </RedirectShell>
    )
  if (validation.isError || isUnavailable)
    return (
      <RedirectShell>
        <AlertCircle className="size-7 text-destructive" />
        <div>
          <h1 className="font-semibold">This link isn’t available</h1>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {isUnavailable
              ? "The link has expired, been disabled, or reached its click limit."
              : error?.message || "The short link could not be found."}
          </p>
        </div>
      </RedirectShell>
    )
  return null
}

function RedirectShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-5">
      <section className="flex w-full max-w-md flex-col items-center gap-5 rounded-2xl border bg-background p-8 text-center shadow-sm">
        {children}
      </section>
    </main>
  )
}
