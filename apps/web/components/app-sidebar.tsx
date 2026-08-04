"use client"

import { usePathname } from "next/navigation"
import {
  BadgeCheck,
  Bell,
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  Link as LinkIcon,
  BarChart3,
  LogOut,
  QrCode,
  Settings,
  Sparkles,
  Users,
  UserPlus,
  Building2,
  Plus,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/common/providers/auth-provider"
import { useLocale } from "@/hooks/use-locale"
import { getUserOrganizations } from "@/lib/auth/post-auth-redirect"

interface AppSidebarProps {
  currentSubdomain?: string
}

export function AppSidebar({ currentSubdomain }: AppSidebarProps) {
  const pathname = usePathname()
  const locale = useLocale()
  const { user, logout } = useAuth()

  const userOrgs = user ? getUserOrganizations(user) : []
  const activeOrg =
    userOrgs.find(
      (o) => o.slug.toLowerCase() === (currentSubdomain ?? "").toLowerCase()
    ) ?? userOrgs[0]

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "uurl.uz"
  const protocol =
    typeof window !== "undefined" ? window.location.protocol : "https:"

  const handleSwitchOrg = (slug: string) => {
    if (slug.toLowerCase() === (currentSubdomain ?? "").toLowerCase()) return
    window.location.replace(`${protocol}//${slug}.${rootDomain}/${locale}/dashboard`)
  }

  const handleCreateOrg = () => {
    window.location.replace(`${protocol}//${rootDomain}/${locale}/onboarding/organization`)
  }

  const navigation = {
    main: [
      { title: "Dashboard", url: `/${locale}/dashboard`, icon: LayoutDashboard },
      { title: "Links", url: `/${locale}/links`, icon: LinkIcon },
      { title: "Analytics", url: `/${locale}/analytics`, icon: BarChart3 },
      { title: "QR Codes", url: `/${locale}/qr`, icon: QrCode },
    ],
    management: [
      { title: "Teams", url: `/${locale}/teams`, icon: Users },
      { title: "Members", url: `/${locale}/members`, icon: UserPlus },
    ],
    workspace: [
      { title: "Settings", url: `/${locale}/settings`, icon: Settings },
      { title: "Billing", url: `/${locale}/billing`, icon: CreditCard },
    ],
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold">
                      {activeOrg ? (
                        activeOrg.name.charAt(0).toUpperCase()
                      ) : (
                        <Sparkles className="size-4" />
                      )}
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {activeOrg?.name ?? "My Organization"}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {activeOrg ? `${activeOrg.slug}.${rootDomain}` : "No org"}
                      </span>
                    </div>
                    <ChevronDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width)"
                align="start"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                  {userOrgs.map((org) => (
                    <DropdownMenuItem
                      key={org.id}
                      onClick={() => handleSwitchOrg(org.slug)}
                      className={
                        org.slug.toLowerCase() === (currentSubdomain ?? "").toLowerCase()
                          ? "bg-muted font-semibold"
                          : ""
                      }
                    >
                      <Building2 className="size-4" />
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{org.name}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {org.slug}.{rootDomain}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleCreateOrg}>
                    <Plus className="size-4" />
                    Create organization
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarInput placeholder="Search..." />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.main.map((item) => {
                const isActive = pathname.startsWith(item.url)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<a href={item.url} />}
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.management.map((item) => {
                const isActive = pathname.startsWith(item.url)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<a href={item.url} />}
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.workspace.map((item) => {
                const isActive = pathname.startsWith(item.url)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<a href={item.url} />}
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground overflow-hidden font-bold">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-medium">
                          {user?.name?.charAt(0).toUpperCase() ?? "U"}
                        </span>
                      )}
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.name ?? "User"}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user?.email ?? ""}
                      </span>
                    </div>
                    <ChevronDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width)"
                align="start"
                side="right"
                sideOffset={4}
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <BadgeCheck className="size-4" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="size-4" />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="size-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
