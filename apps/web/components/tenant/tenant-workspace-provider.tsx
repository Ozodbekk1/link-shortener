"use client"

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { Building2, Loader2, Plus } from "lucide-react"
import { toast } from "sonner"
import type { Workspace } from "@/api/types"
import { useAuth } from "@/common/providers/auth-provider"
import { getUserOrganizations } from "@/lib/auth/post-auth-redirect"
import {
  useCreateWorkspaceMutation,
  useWorkspacesQuery,
} from "@/hooks/use-workspaces"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type TenantWorkspaceContextValue = {
  organization: { id: string; name: string; slug: string } | null
  workspace: Workspace | null
  workspaces: Workspace[]
  isLoading: boolean
  setWorkspaceId: (id: string) => void
}

const TenantWorkspaceContext = createContext<
  TenantWorkspaceContextValue | undefined
>(undefined)

export function TenantWorkspaceProvider({
  tenant,
  children,
}: {
  tenant: string
  children: ReactNode
}) {
  const { user } = useAuth()
  const organization = useMemo(
    () =>
      user
        ? (getUserOrganizations(user).find(
            (org) => org.slug.toLowerCase() === tenant.toLowerCase()
          ) ?? null)
        : null,
    [tenant, user]
  )
  const { data, isLoading } = useWorkspacesQuery(organization?.id ?? "")
  const workspaces = useMemo(() => data?.workspaces ?? [], [data?.workspaces])
  const [workspaceId, setWorkspaceId] = useState("")
  const selectedWorkspaceId = workspaces.some(
    (workspace) => workspace.id === workspaceId
  )
    ? workspaceId
    : workspaces[0]?.id

  const value = {
    organization,
    workspace:
      workspaces.find((item) => item.id === selectedWorkspaceId) ?? null,
    workspaces,
    isLoading,
    setWorkspaceId,
  }

  return (
    <TenantWorkspaceContext.Provider value={value}>
      {children}
    </TenantWorkspaceContext.Provider>
  )
}

export function useTenantWorkspace() {
  const context = useContext(TenantWorkspaceContext)
  if (!context)
    throw new Error(
      "useTenantWorkspace must be used within TenantWorkspaceProvider"
    )
  return context
}

export function WorkspacePicker() {
  const { organization, workspace, workspaces, isLoading, setWorkspaceId } =
    useTenantWorkspace()
  const createWorkspace = useCreateWorkspaceMutation(organization?.id ?? "")
  const [isCreating, setIsCreating] = useState(false)
  const [name, setName] = useState("")

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return
    try {
      const created = await createWorkspace.mutateAsync({ name: name.trim() })
      setWorkspaceId(created.id)
      setName("")
      setIsCreating(false)
      toast.success("Workspace created")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not create workspace"
      )
    }
  }

  if (isLoading)
    return (
      <div className="flex h-8 items-center text-sm text-muted-foreground">
        <Loader2 className="mr-2 size-4 animate-spin" />
        Loading workspace
      </div>
    )

  if (!workspaces.length || isCreating) {
    return (
      <form
        onSubmit={submit}
        className="flex w-full max-w-sm items-center gap-2"
      >
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Workspace name"
          autoFocus
        />
        <Button type="submit" disabled={createWorkspace.isPending}>
          {createWorkspace.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Plus />
          )}{" "}
          Create
        </Button>
        {workspaces.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsCreating(false)}
          >
            Cancel
          </Button>
        )}
      </form>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Building2 className="size-4" />
      </div>
      <select
        aria-label="Current workspace"
        value={workspace?.id ?? ""}
        onChange={(event) => setWorkspaceId(event.target.value)}
        className="h-8 max-w-48 rounded-lg border border-input bg-background px-2 text-sm font-medium outline-none focus:ring-2 focus:ring-ring/50"
      >
        {workspaces.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setIsCreating(true)}
        aria-label="Create workspace"
      >
        <Plus />
      </Button>
    </div>
  )
}
