"use client"

import { Building2, Globe2, Users } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageHeader } from "@/components/tenant/page-header"
import { useTenantWorkspace } from "@/components/tenant/tenant-workspace-provider"
import { useOrganizationByIdQuery } from "@/hooks/use-organizations"

export function SettingsPage() {
  const { organization, workspace } = useTenantWorkspace()
  const { data } = useOrganizationByIdQuery(organization?.id ?? "")
  return (
    <>
      <PageHeader
        title="Settings"
        description="Organization and workspace information."
      />
      <main className="grid gap-6 p-5 sm:p-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
            <CardDescription>Your shared tenant identity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Setting
              icon={Building2}
              label="Organization"
              value={data?.name ?? organization?.name ?? "—"}
            />
            <Setting
              icon={Globe2}
              label="Subdomain"
              value={`${data?.subdomain ?? organization?.slug ?? "—"}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN || "uurl.uz"}`}
            />
            <Setting
              icon={Users}
              label="Members"
              value={String(data?.statistics.members ?? "—")}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Current workspace</CardTitle>
            <CardDescription>
              The workspace selected in the header.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Setting
              icon={Building2}
              label="Name"
              value={workspace?.name ?? "Create a workspace to begin"}
            />
            <Setting
              icon={Users}
              label="Teams"
              value={String(workspace?.statistics?.teams ?? 0)}
            />
            <Setting
              icon={Globe2}
              label="Links"
              value={String(workspace?.statistics?.links ?? 0)}
            />
          </CardContent>
        </Card>
      </main>
    </>
  )
}
function Setting({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}
