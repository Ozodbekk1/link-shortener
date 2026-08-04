"use client"

import {
  Copy,
  ExternalLink,
  Loader2,
  Plus,
  SlidersHorizontal,
  Trash2,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LinkCreateForm } from "@/components/tenant/link-create-form"
import { PageHeader } from "@/components/tenant/page-header"
import { useTenantWorkspace } from "@/components/tenant/tenant-workspace-provider"
import { useDeleteLinkMutation, useLinksQuery } from "@/hooks/use-links"

export function LinksPage() {
  const { workspace } = useTenantWorkspace()
  const workspaceId = workspace?.id ?? ""
  const [isCreating, setIsCreating] = useState(false)
  const { data, isLoading } = useLinksQuery(workspaceId, { limit: 50 })
  const removeLink = useDeleteLinkMutation(workspaceId)
  const copy = async (slug: string) => {
    await navigator.clipboard.writeText(`${window.location.origin}/r/${slug}`)
    toast.success("Short link copied")
  }
  return (
    <>
      <PageHeader
        title="Links"
        description="Create, share, and manage the links in this workspace."
        actions={
          <Button onClick={() => setIsCreating((value) => !value)}>
            <Plus />
            New link
          </Button>
        }
      />
      <main className="space-y-5 p-5 sm:p-8">
        {isCreating && (
          <Card>
            <CardContent>
              <LinkCreateForm
                workspaceId={workspaceId}
                onComplete={() => setIsCreating(false)}
              />
            </CardContent>
          </Card>
        )}
        <Card>
          <CardContent>
            {isLoading ? (
              <Loading />
            ) : data?.data?.length ? (
              <div className="divide-y">
                {data.data.map((link) => (
                  <div
                    key={link.id}
                    className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">
                        {link.title || "Untitled link"}
                      </p>
                      <a
                        className="mt-1 flex items-center gap-1 text-sm text-primary hover:underline"
                        href={`/r/${link.shortSlug}`}
                        target="_blank"
                      >
                        /{link.shortSlug}
                        <ExternalLink className="size-3" />
                      </a>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {link.originalUrl}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {link.tags?.map((tag) => (
                          <span
                            key={tag.id}
                            className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                          >
                            {tag.tag}
                          </span>
                        ))}
                        {link.redirectRules?.length ? (
                          <span className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                            <SlidersHorizontal className="size-3" />
                            {link.redirectRules.length} rule
                            {link.redirectRules.length === 1 ? "" : "s"}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="mr-2 text-sm text-muted-foreground">
                        {link._count?.clicks ?? 0} clicks
                      </span>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => copy(link.shortSlug)}
                        aria-label="Copy short link"
                      >
                        <Copy />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeLink.mutate(link.id)}
                        aria-label="Delete link"
                      >
                        <Trash2 className="text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No links yet. Create one to get started.
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  )
}
function Loading() {
  return (
    <div className="flex justify-center py-12">
      <Loader2 className="animate-spin text-muted-foreground" />
    </div>
  )
}
