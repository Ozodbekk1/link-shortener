"use client"

import { Activity, Link2, MousePointerClick, Users } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageHeader } from "@/components/tenant/page-header"
import { useTenantWorkspace } from "@/components/tenant/tenant-workspace-provider"
import {
  useAnalyticsOverviewQuery,
  useRealtimeAnalyticsQuery,
} from "@/hooks/use-analytics"
import { useLinksQuery } from "@/hooks/use-links"

const formatNumber = (value: number) => new Intl.NumberFormat().format(value)

export function DashboardPage() {
  const { workspace } = useTenantWorkspace()
  const workspaceId = workspace?.id ?? ""
  const { data: overview } = useAnalyticsOverviewQuery(workspaceId)
  const { data: recentLinks } = useLinksQuery(workspaceId, { limit: 5 })
  const { data: realtime } = useRealtimeAnalyticsQuery(workspaceId)

  const stats = [
    { label: "Total links", value: overview?.totalLinks ?? 0, icon: Link2 },
    {
      label: "Active links",
      value: overview?.activeLinks ?? 0,
      icon: Activity,
    },
    {
      label: "Total clicks",
      value: overview?.totalClicks ?? 0,
      icon: MousePointerClick,
    },
    {
      label: "Visitors (30 days)",
      value: overview?.uniqueVisitorsLast30Days ?? 0,
      icon: Users,
    },
  ]

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="A live view of your workspace performance."
      />
      <main className="space-y-6 p-5 sm:p-8">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex-row items-center justify-between">
                <CardDescription>{stat.label}</CardDescription>
                <stat.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">
                  {formatNumber(stat.value)}
                </p>
                {stat.label === "Total clicks" && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatNumber(overview?.clicksToday ?? 0)} today
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </section>
        <section className="grid gap-6 xl:grid-cols-5">
          <Card className="xl:col-span-3">
            <CardHeader>
              <CardTitle>Recent links</CardTitle>
              <CardDescription>
                Latest shortened links in {workspace?.name ?? "this workspace"}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentLinks?.data?.length ? (
                <div className="divide-y">
                  {recentLinks.data.map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {link.title || link.shortSlug}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {link.originalUrl}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-medium">
                          {formatNumber(link._count?.clicks ?? 0)}
                        </p>
                        <p className="text-xs text-muted-foreground">clicks</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyCopy text="Create your first link to start seeing activity here." />
              )}
            </CardContent>
          </Card>
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Live visitors</CardTitle>
              <CardDescription>
                Visitors active on your links now.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {realtime?.length ? (
                <div className="space-y-3">
                  {realtime.slice(0, 5).map((item) => (
                    <div
                      key={item.linkId}
                      className="flex items-center justify-between"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {item.title || item.shortSlug}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          /{item.shortSlug}
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        {item.activeVisitors} active
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyCopy text="No visitors are active right now." />
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  )
}

function EmptyCopy({ text }: { text: string }) {
  return (
    <p className="py-8 text-center text-sm text-muted-foreground">{text}</p>
  )
}
