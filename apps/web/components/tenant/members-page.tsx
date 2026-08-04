"use client"

import { UserRound } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/tenant/page-header"
import { useTenantWorkspace } from "@/components/tenant/tenant-workspace-provider"
import { useOrganizationMembersQuery } from "@/hooks/use-organizations"

export function MembersPage() {
  const { organization } = useTenantWorkspace()
  const { data, isLoading } = useOrganizationMembersQuery(
    organization?.id ?? "",
    { limit: 100 }
  )
  return (
    <>
      <PageHeader
        title="Members"
        description="People who have access to this organization."
      />
      <main className="p-5 sm:p-8">
        <Card>
          <CardContent>
            {isLoading ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Loading members…
              </p>
            ) : data?.members?.length ? (
              <div className="divide-y">
                {data.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-sm font-medium">
                      {member.user.avatar ? (
                        <img
                          src={member.user.avatar}
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : (
                        <UserRound className="size-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {member.user.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {member.user.email}
                      </p>
                    </div>
                    <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium capitalize">
                      {member.role.toLowerCase()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No members found.
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  )
}
