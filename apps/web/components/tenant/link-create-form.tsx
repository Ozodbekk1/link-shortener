"use client"

import {
  ChevronDown,
  ChevronUp,
  Loader2,
  Plus,
  Shield,
  SlidersHorizontal,
  Trash2,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import type {
  CreateLinkPayload,
  RedirectRulePayload,
  RedirectRuleType,
} from "@/api/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCreateLinkMutation } from "@/hooks/use-links"

const ruleOptions: Array<{
  value: RedirectRuleType
  label: string
  placeholder: string
}> = [
  { value: "COUNTRY", label: "Country", placeholder: "US, UZ, GB" },
  { value: "DEVICE", label: "Device", placeholder: "mobile, desktop, tablet" },
  { value: "LANGUAGE", label: "Language", placeholder: "en, uz, ru" },
  {
    value: "OS",
    label: "Operating system",
    placeholder: "iOS, Android, Windows",
  },
]

type DraftRule = RedirectRulePayload

export function LinkCreateForm({
  workspaceId,
  onComplete,
}: {
  workspaceId: string
  onComplete: () => void
}) {
  const createLink = useCreateLinkMutation(workspaceId)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [passwordProtected, setPasswordProtected] = useState(false)
  const [rules, setRules] = useState<DraftRule[]>([])

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const expiresAt = String(form.get("expiresAt") || "")
    const clickLimit = Number(form.get("clickLimit") || 0)
    const tags = String(form.get("tags") || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
    const invalidRule = rules.some(
      (rule) => !rule.value.trim() || !rule.destinationUrl.trim()
    )
    if (invalidRule)
      return toast.error(
        "Every redirect rule needs a value and destination URL"
      )

    const payload: CreateLinkPayload = {
      originalUrl: String(form.get("originalUrl")),
      title: String(form.get("title") || "") || undefined,
      shortSlug: String(form.get("shortSlug") || "") || undefined,
      customDomain: String(form.get("customDomain") || "") || undefined,
      clickLimit: clickLimit || undefined,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      passwordProtected,
      password: passwordProtected
        ? String(form.get("password") || "") || undefined
        : undefined,
      tags: tags.length ? tags : undefined,
      redirectRules: rules.length ? rules : undefined,
    }

    if (passwordProtected && !payload.password)
      return toast.error("Enter a password or disable password protection")

    try {
      await createLink.mutateAsync(payload)
      toast.success("Link created")
      onComplete()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not create link"
      )
    }
  }

  const addRule = () =>
    setRules((current) => [
      ...current,
      { type: "COUNTRY", value: "", destinationUrl: "" },
    ])
  const updateRule = (index: number, patch: Partial<DraftRule>) =>
    setRules((current) =>
      current.map((rule, i) => (i === index ? { ...rule, ...patch } : rule))
    )

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Destination URL" required>
          <Input
            name="originalUrl"
            type="url"
            required
            placeholder="https://destination.com/your-long-link"
          />
        </Field>
        <Field label="Link title">
          <Input name="title" placeholder="Summer campaign" />
        </Field>
        <Field label="Custom back-half">
          <Input
            name="shortSlug"
            pattern="[A-Za-z0-9_-]+"
            placeholder="summer-sale"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Letters, numbers, hyphens, and underscores only.
          </p>
        </Field>
        <Field label="Tags">
          <Input name="tags" placeholder="campaign, social, summer" />
          <p className="mt-1 text-xs text-muted-foreground">
            Separate tags with commas.
          </p>
        </Field>
      </div>
      <button
        type="button"
        onClick={() => setShowAdvanced((value) => !value)}
        className="flex items-center gap-2 text-sm font-medium hover:text-primary"
      >
        <SlidersHorizontal className="size-4" />
        Advanced settings{" "}
        {showAdvanced ? (
          <ChevronUp className="size-4" />
        ) : (
          <ChevronDown className="size-4" />
        )}
      </button>
      {showAdvanced && (
        <div className="space-y-5 rounded-xl border bg-muted/20 p-4">
          <div className="grid gap-3 md:grid-cols-3">
            <Field label="Custom domain">
              <Input name="customDomain" placeholder="go.example.com" />
            </Field>
            <Field label="Expiration">
              <Input name="expiresAt" type="datetime-local" />
            </Field>
            <Field label="Click limit">
              <Input
                name="clickLimit"
                type="number"
                min="1"
                placeholder="Unlimited"
              />
            </Field>
          </div>
          <div className="rounded-lg border bg-background p-3">
            <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
              <input
                type="checkbox"
                checked={passwordProtected}
                onChange={(event) => setPasswordProtected(event.target.checked)}
                className="size-4 rounded border-input"
              />
              <Shield className="size-4 text-muted-foreground" />
              Password protection
            </label>
            {passwordProtected && (
              <Input
                className="mt-3"
                name="password"
                type="password"
                minLength={4}
                required
                placeholder="Password for visitors"
              />
            )}
          </div>
          <RedirectRules
            rules={rules}
            onAdd={addRule}
            onUpdate={updateRule}
            onRemove={(index) =>
              setRules((current) => current.filter((_, i) => i !== index))
            }
          />
        </div>
      )}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onComplete}>
          Cancel
        </Button>
        <Button type="submit" disabled={createLink.isPending}>
          {createLink.isPending && <Loader2 className="animate-spin" />}Create
          short link
        </Button>
      </div>
    </form>
  )
}

function RedirectRules({
  rules,
  onAdd,
  onUpdate,
  onRemove,
}: {
  rules: DraftRule[]
  onAdd: () => void
  onUpdate: (index: number, patch: Partial<DraftRule>) => void
  onRemove: (index: number) => void
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Redirect rules</p>
          <p className="text-xs text-muted-foreground">
            Send visitors to a tailored destination based on their context.
          </p>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={onAdd}>
          <Plus />
          Add rule
        </Button>
      </div>
      {rules.map((rule, index) => {
        const option =
          ruleOptions.find((item) => item.value === rule.type) ?? ruleOptions[0]
        return (
          <div
            key={index}
            className="grid gap-2 rounded-lg border bg-background p-3 md:grid-cols-[10rem_1fr_1fr_auto]"
          >
            <select
              value={rule.type}
              onChange={(event) =>
                onUpdate(index, {
                  type: event.target.value as RedirectRuleType,
                })
              }
              className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
            >
              {ruleOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <Input
              value={rule.value}
              onChange={(event) =>
                onUpdate(index, { value: event.target.value })
              }
              placeholder={option.placeholder}
            />
            <Input
              value={rule.destinationUrl}
              type="url"
              onChange={(event) =>
                onUpdate(index, { destinationUrl: event.target.value })
              }
              placeholder="https://tailored-destination.com"
            />
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() => onRemove(index)}
              aria-label="Remove redirect rule"
            >
              <Trash2 className="text-destructive" />
            </Button>
          </div>
        )
      })}
    </div>
  )
}
function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </span>
      {children}
    </label>
  )
}
