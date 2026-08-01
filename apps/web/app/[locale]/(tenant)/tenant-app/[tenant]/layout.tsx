import React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { OrgGuard } from "@/components/auth/org-guard"
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
      <SidebarProvider>
        <AppSidebar currentSubdomain={tenant} />
        <SidebarInset>
          <SidebarTrigger className="mt-1 ml-1" />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </OrgGuard>
  )
}
