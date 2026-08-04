"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageHeader } from "@/components/tenant/page-header"
import { ClickMap } from "@/components/tenant/click-map"
import { useTenantWorkspace } from "@/components/tenant/tenant-workspace-provider"
import {
  useAnalyticsOverviewQuery,
  useCountriesAnalyticsQuery,
  useDevicesAnalyticsQuery,
  useRecentClickActivityQuery,
} from "@/hooks/use-analytics"

export function AnalyticsPage() {
  const { workspace } = useTenantWorkspace()
  const id = workspace?.id ?? ""
  const { data: overview } = useAnalyticsOverviewQuery(id)
  const { data: countries } = useCountriesAnalyticsQuery(id)
  const { data: devices } = useDevicesAnalyticsQuery(id)
  const { data: clickActivity } = useRecentClickActivityQuery(id)
  const maxCountryClicks = Math.max(
    ...(countries?.map((country) => country.clicks) ?? [1])
  )
  return (
    <>
      <PageHeader
        title="Analytics"
        description="Understand how people engage with your links."
      />
      <main className="space-y-6 p-5 sm:p-8">
        <section className="grid gap-4 sm:grid-cols-3">
          {[
            ["Total clicks", overview?.totalClicks ?? 0],
            ["Clicks today", overview?.clicksToday ?? 0],
            ["Unique visitors", overview?.uniqueVisitorsLast30Days ?? 0],
          ].map(([label, value]) => (
            <Card key={String(label)}>
              <CardHeader>
                <CardDescription>{label}</CardDescription>
                <CardTitle className="text-2xl">
                  {Number(value).toLocaleString()}
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </section>
        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Top countries</CardTitle>
              <CardDescription>
                Clicks grouped by visitor country.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {countries?.length ? (
                <div className="space-y-4">
                  {countries.map((country) => (
                    <div key={country.country}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span>{country.country}</span>
                        <span className="text-muted-foreground">
                          {country.clicks.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${Math.max(4, (country.clicks / maxCountryClicks) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty text="Country data will appear after your links receive clicks." />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Devices</CardTitle>
              <CardDescription>How visitors access your links.</CardDescription>
            </CardHeader>
            <CardContent>
              {devices?.devices?.length ? (
                <div className="divide-y">
                  {devices.devices.map((device) => (
                    <div
                      key={device.device}
                      className="flex justify-between py-3 first:pt-0 last:pb-0"
                    >
                      <span className="text-sm font-medium">
                        {device.device}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {device.clicks.toLocaleString()} clicks
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty text="Device data will appear after your links receive clicks." />
              )}
            </CardContent>
          </Card>
        </section>
        <ClickMap countries={countries ?? []} />
        <VisitorActivity activity={clickActivity?.activity ?? []} />
      </main>
    </>
  )
}
function Empty({ text }: { text: string }) {
  return (
    <p className="py-8 text-center text-sm text-muted-foreground">{text}</p>
  )
}
function VisitorActivity({
  activity,
}: {
  activity: Array<{
    id: string
    clickedAt: string
    country: string | null
    city: string | null
    device: string | null
    browser: string | null
    os: string | null
    referrer: string | null
    language: string | null
    userAgent: string | null
    link: { shortSlug: string; title: string | null }
  }>
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent visitor activity</CardTitle>
        <CardDescription>
          Latest recorded clicks with browser and device details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activity.length ? (
          <div className="divide-y">
            {activity.map((click) => (
              <div
                key={click.id}
                className="grid gap-2 py-4 first:pt-0 last:pb-0 md:grid-cols-[minmax(9rem,1fr)_minmax(12rem,2fr)_auto]"
              >
                <div>
                  <p className="text-sm font-medium">
                    {click.link.title || `/${click.link.shortSlug}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(click.clickedAt).toLocaleString()}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-sm">
                    {[click.browser, click.os, click.device]
                      .filter(Boolean)
                      .join(" · ") || "Unknown device"}
                  </p>
                  <p
                    className="truncate text-xs text-muted-foreground"
                    title={click.userAgent ?? undefined}
                  >
                    {click.userAgent || "User-Agent unavailable"}
                  </p>
                  {click.referrer && (
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      From: {click.referrer}
                    </p>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {[click.city, click.country].filter(Boolean).join(", ") ||
                    click.language ||
                    "Unknown location"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty text="Visitor details will appear after the first click." />
        )}
      </CardContent>
    </Card>
  )
}
