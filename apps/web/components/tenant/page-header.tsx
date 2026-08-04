import type { ReactNode } from "react"
import { WorkspacePicker } from "@/components/tenant/tenant-workspace-provider"

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description: string
  actions?: ReactNode
}) {
  return (
    <header className="flex flex-col gap-4 border-b px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="mb-2">
          <WorkspacePicker />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </header>
  )
}
