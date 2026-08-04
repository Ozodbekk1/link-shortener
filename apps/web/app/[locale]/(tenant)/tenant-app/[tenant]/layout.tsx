import React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { OrgGuard } from "@/components/auth/org-guard"
import { TenantWorkspaceProvider } from "@/components/tenant/tenant-workspace-provider"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard — UURL",
  description: "Manage your links and workspaces.",
}

interface TenantLayoutProps {
  children: React.ReactNode
  params: Promise<{
    tenant: string
    locale: string
  }>
}

export default async function TenantLayout({
  children,
  params,
}: TenantLayoutProps) {
  const { tenant } = await params

  return (
    <OrgGuard expectedTenant={tenant}>
      <TenantWorkspaceProvider tenant={tenant}>
        <SidebarProvider>
          <AppSidebar currentSubdomain={tenant} />
          <SidebarInset>
            <SidebarTrigger className="absolute top-3 left-3 z-10" />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </TenantWorkspaceProvider>
    </OrgGuard>
  )
}
