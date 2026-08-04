"use client"

import { Loader2, Plus, Users } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/tenant/page-header"
import { useTenantWorkspace } from "@/components/tenant/tenant-workspace-provider"
import { useCreateTeamMutation, useTeamsQuery } from "@/hooks/use-teams"

export function TeamsPage() {
  const { workspace } = useTenantWorkspace()
  const id = workspace?.id ?? ""
  const { data, isLoading } = useTeamsQuery(id, { limit: 50 })
  const createTeam = useCreateTeamMutation(id)
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState("")
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      await createTeam.mutateAsync({ name })
      setName("")
      setCreating(false)
      toast.success("Team created")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not create team"
      )
    }
  }
  return (
    <>
      <PageHeader
        title="Teams"
        description="Organize people and access within this workspace."
        actions={
          <Button onClick={() => setCreating((value) => !value)}>
            <Plus />
            New team
          </Button>
        }
      />
      <main className="space-y-5 p-5 sm:p-8">
        {creating && (
          <Card>
            <CardContent>
              <form onSubmit={submit} className="flex gap-2">
                <Input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Team name"
                />
                <Button disabled={createTeam.isPending}>
                  {createTeam.isPending && <Loader2 className="animate-spin" />}
                  Create team
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data?.data?.map((team) => (
            <Card key={team.id}>
              <CardContent className="flex items-start justify-between pt-1">
                <div>
                  <h2 className="font-medium">{team.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Created {new Date(team.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="size-4" />
                  {team._count?.members ?? 0}
                </span>
              </CardContent>
            </Card>
          ))}
        </section>
        {isLoading && (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin" />
          </div>
        )}
        {!isLoading && !data?.data?.length && (
          <Card>
            <CardContent>
              <p className="py-12 text-center text-sm text-muted-foreground">
                No teams yet. Create one to organize workspace members.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  )
}
