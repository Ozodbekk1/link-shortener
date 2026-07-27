export type QueryValue = string | number | boolean | null | undefined

export type QueryParams = object

export interface ApiErrorPayload {
  message?: string
  error?: string
  errors?: Array<{ msg?: string; path?: string }>
  [key: string]: unknown
}

export interface AppUser {
  id: string
  email: string
  name: string
  avatar: string
  userRole: string
  emailVerified: boolean
  twoFactorEnabled: boolean
  status: string
  createdAt: Date
  updatedAt: Date
}

export interface UsersQueryParams {
  page?: number
  limit?: number
}

export interface OrganizationRef {
  id: string
  name: string
  slug: string
  ownerId: string
}

export interface WorkspaceRef {
  id: string
  name: string
  slug: string
  organizationId: string
}

export interface TeamRef {
  id: string
  name: string
  workspace: WorkspaceRef
}

export interface TeamMemberRef {
  team: TeamRef
}

export interface OrgMemberRef {
  id: string
  role: string
  user: { id: string; name: string; email: string; avatar: string | null }
}

export interface WorkspaceDetail {
  id: string
  name: string
  slug: string
  teams: unknown[]
  domains: unknown[]
  _count: { links: number }
}

export interface OwnedOrganization {
  id: string
  name: string
  slug: string
  ownerId: string
  createdAt: string
  workspaces: WorkspaceDetail[]
  members: OrgMemberRef[]
  _count: { members: number; workspaces: number }
}

export interface MembershipRef {
  organization: OrganizationRef
}

export interface QrCodeRef {
  id: string
  imageUrl: string
  styleJson: unknown
  createdAt: string
}

export interface LinkRef {
  id: string
  title: string | null
  originalUrl: string
  shortSlug: string
  status: string
  tags: { id: string; tag: string }[]
  redirectRules: unknown[]
  qrCodes: QrCodeRef[]
  _count: { clicks: number; qrCodes: number }
  createdAt: string
}

export interface NotificationRef {
  id: string
  type: string
  message: string
  read: boolean
  createdAt: string
}

export interface User {
  id: string
  email: string
  googleId: string | null
  phone_number: string | null
  name: string
  avatar: string | null
  emailVerified: boolean
  twoFactorEnabled: boolean
  status: string
  userRole: string
  createdAt: string
  updatedAt: string
  ownedOrganizations: OwnedOrganization[]
  memberships: MembershipRef[]
  teamMemberships: TeamMemberRef[]
  links: LinkRef[]
  notifications: NotificationRef[]
}

export interface UsersListResponse {
  data: User[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface UserProfileResponse {
  user: User
}

// ── Organizations API types ──────────────────────────────────────────────────

export interface CreateOrganizationPayload {
  name: string
  slug: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  subdomain: string
  role: string
  joinedAt: string
  createdAt: string
  memberCount: number
  workspaceCount: number
}

export interface OrganizationsListResponse {
  organizations: Organization[]
}

export interface OrganizationOwner {
  id: string
  name: string
  email: string
  avatar: string | null
}

export interface OrganizationStatistics {
  members: number
  workspaces: number
  roles: number
}

export interface OrganizationDetailResponse {
  id: string
  name: string
  slug: string
  subdomain: string
  role: string
  joinedAt: string
  createdAt: string
  owner: OrganizationOwner
  statistics: OrganizationStatistics
}

export interface OrganizationMemberUser {
  id: string
  name: string
  email: string
  avatar: string | null
  status: string
  createdAt: string
}

export interface OrganizationMember {
  id: string
  role: string
  joinedAt: string
  user: OrganizationMemberUser
}

export interface OrganizationMembersPagination {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface OrganizationMembersResponse {
  members: OrganizationMember[]
  pagination: OrganizationMembersPagination
}

export interface OrganizationMembersQueryParams {
  page?: number
  limit?: number
}
