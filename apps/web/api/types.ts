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

export interface WorkspaceStatistics {
  teams: number
  links: number
  campaigns: number
  domains: number
  webhooks?: number
}

export interface Workspace {
  id: string
  name: string
  slug: string
  createdAt: string
  statistics?: WorkspaceStatistics
  organization?: {
    id: string
    name: string
    slug: string
  }
}

export interface CreateWorkspacePayload {
  name: string
}

export interface WorkspacesQueryParams {
  page?: number
  limit?: number
}

export interface WorkspacesPagination {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface WorkspacesListResponse {
  workspaces: Workspace[]
  pagination: WorkspacesPagination
}

export interface DeleteWorkspaceResponse {
  message: string
  workspace: {
    id: string
    name: string
  }
}

export type TeamRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER"

export interface TeamMemberUser {
  id: string
  name: string
  email: string
  avatar?: string | null
}

export interface TeamMember {
  id: string
  role: TeamRole
  userId: string
  teamId?: string
  user: TeamMemberUser
}

export interface Team {
  id: string
  workspaceId: string
  name: string
  createdAt: string
  workspace?: {
    id: string
    name: string
    slug: string
  }
  members?: TeamMember[]
  _count?: {
    members: number
  }
}

export interface CreateTeamPayload {
  name: string
}

export interface TeamsQueryParams {
  page?: number
  limit?: number
  search?: string
}

export interface TeamsListMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface TeamsListResponse {
  data: Team[]
  meta: TeamsListMeta
}

export interface AddTeamMemberPayload {
  userId: string
  role?: TeamRole
}

export interface UpdateTeamMemberPayload {
  role: TeamRole
}

export type LinkStatus = "ACTIVE" | "DISABLED" | "EXPIRED" | "ARCHIVED"
export type RedirectRuleType = "COUNTRY" | "DEVICE" | "LANGUAGE" | "OS"

export interface RedirectRulePayload {
  type: RedirectRuleType
  value: string
  destinationUrl: string
}

export interface RedirectRule extends RedirectRulePayload {
  id: string
  linkId: string
}

export interface LinkTag {
  id: string
  linkId: string
  tag: string
}

export interface Link {
  id: string
  userId: string
  workspaceId: string
  campaignId?: string | null
  title?: string | null
  originalUrl: string
  shortSlug: string
  customDomain?: string | null
  status: LinkStatus
  clickLimit?: number | null
  expiresAt?: string | null
  passwordProtected: boolean
  createdAt: string
  updatedAt?: string
  tags?: LinkTag[]
  redirectRules?: RedirectRule[]
  _count?: {
    clicks: number
  }
}

export interface CreateLinkPayload {
  originalUrl: string
  shortSlug?: string
  title?: string
  campaignId?: string
  customDomain?: string
  clickLimit?: number
  expiresAt?: string
  passwordProtected?: boolean
  password?: string
  tags?: string[]
  redirectRules?: RedirectRulePayload[]
}

export type UpdateLinkPayload = Partial<CreateLinkPayload> & {
  status?: LinkStatus
}

export interface LinksQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: LinkStatus
  campaignId?: string
  tag?: string
}

export interface LinksListMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface LinksListResponse {
  data: Link[]
  meta: LinksListMeta
}

export interface PublicLinkResponse {
  id: string
  title?: string | null
  originalUrl: string
  shortSlug: string
  status: LinkStatus
  redirectRules?: RedirectRule[]
}

export interface AnalyticsOverview {
  totalLinks: number
  activeLinks: number
  totalClicks: number
  clicksToday: number
  uniqueVisitorsLast30Days: number
}

export interface RealtimeAnalyticsItem {
  linkId: string
  shortSlug: string
  title: string
  originalUrl: string
  activeVisitors: number
  lastUpdated: string
}

export interface CountryAnalyticsItem {
  country: string
  clicks: number
}

export interface DeviceAnalyticsItem {
  device: string
  clicks: number
}

export interface OsAnalyticsItem {
  os: string
  clicks: number
}

export interface BrowserAnalyticsItem {
  browser: string
  clicks: number
}

export interface DeviceAnalyticsResponse {
  devices: DeviceAnalyticsItem[]
  os: OsAnalyticsItem[]
  browsers: BrowserAnalyticsItem[]
}

export interface DailyAnalyticsItem {
  day: string
  totalClicks: number
  uniqueClicks: number
}

export interface SingleLinkAnalyticsResponse {
  link: {
    id: string
    shortSlug: string
    title: string
    originalUrl: string
  }
  totalClicks: number
  clicksToday: number
  clicksLast7Days: number
  uniqueVisitors: number
  countries: CountryAnalyticsItem[]
  devices: DeviceAnalyticsItem[]
  daily: DailyAnalyticsItem[]
  activeVisitors: number
}

export interface RedirectQueryParams {
  password?: string
}

export interface ValidateRedirectResponse {
  slug: string
  title?: string | null
  originalUrl: string
  customDomain?: string | null
  shortUrl: string
  status: "ACTIVE" | "DISABLED" | "EXPIRED" | "ARCHIVED"
  isExpired: boolean
  isPasswordProtected: boolean
  clickLimit?: number | null
  currentClicks: number
  totalClicks: number
  redirectRules: Array<{
    type: "COUNTRY" | "DEVICE" | "LANGUAGE" | "OS"
    value: string
    destinationUrl: string
  }>
}

export interface RedirectRuleMatchResult {
  ruleType: "COUNTRY" | "DEVICE" | "LANGUAGE" | "OS"
  ruleValue: string
  destinationUrl: string
  matched: boolean
  reason: string
}

export interface PreviewRedirectRulesResponse {
  slug: string
  title?: string | null
  originalUrl: string
  fallbackUrl: string
  context: {
    userAgent: string
    device: string
    browser: string
    os: string
    language: string
    ip: string
  }
  rules: RedirectRuleMatchResult[]
  matchedRule: RedirectRuleMatchResult | null
  finalDestinationUrl: string
}

export interface Permission {
  id: string
  action: string
  resource: string
}

export interface Role {
  id: string
  name: string
  description?: string | null
  organizationId: string
  permissions?: Permission[]
  createdAt?: string
}

export interface CreateRolePayload {
  name: string
  description?: string
  organizationId: string
  permissionIds?: string[]
}

export interface UpdateRolePayload {
  name?: string
  description?: string
  permissionIds?: string[]
}

export interface AssignRolePayload {
  userId: string
  roleId: string
  organizationId: string
}

export interface RolesQueryParams {
  organizationId: string
}

export interface CreatePermissionPayload {
  action: string
  resource: string
}

export type UpdatePermissionPayload = Partial<CreatePermissionPayload>

export type QrStyleType = "square" | "dot" | "rounded"
export type QrGradientDirection = "horizontal" | "vertical" | "diagonal"

export interface QrCodeStyleJson {
  foregroundColor?: string
  backgroundColor?: string
  size?: number
  margin?: number
  logoUrl?: string
  logoSize?: number
  dotStyle?: QrStyleType
  cornerStyle?: QrStyleType
  gradientStart?: string
  gradientEnd?: string
  gradientDirection?: QrGradientDirection
}

export interface GenerateQrPayload extends QrCodeStyleJson {
  linkId: string
}

export type UpdateQrPayload = Omit<GenerateQrPayload, "linkId">

export interface QrCode {
  id: string
  linkId: string
  imageUrl: string
  styleJson: QrCodeStyleJson
  createdAt: string
  link?: {
    id: string
    shortSlug: string
    title?: string | null
    originalUrl: string
  }
}

export interface GenerateQrResponse {
  qrCode: QrCode
  imageUrl: string
}

export interface QrQueryParams {
  linkId?: string
  page?: number
  limit?: number
}

export interface QrListResponse {
  data?: QrCode[]
  qrCodes?: QrCode[]
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface AdminDashboardOverview {
  users: {
    total: number
    today: number
    thisMonth: number
    byStatus: { pending: number; active: number; suspended: number }
  }
  links: {
    total: number
    today: number
    thisMonth: number
    byStatus: { active: number; disabled: number }
  }
  clicks: {
    total: number
    today: number
    thisMonth: number
  }
  organizations: { total: number }
  workspaces: { total: number }
  qrCodes: { total: number }
}

export interface AdminDailyStat {
  date: string
  newUsers: number
  newLinks: number
  clicks: number
}

export interface AdminDailyStatsResponse {
  days: number
  startDate: string
  endDate: string
  data: AdminDailyStat[]
}

export interface AdminUsersQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: "PENDING" | "ACTIVE" | "SUSPENDED" | "DELETED"
}

export interface AdminLinksQueryParams {
  page?: number
  limit?: number
  search?: string
}

export interface AdminOrganizationsQueryParams {
  page?: number
  limit?: number
}

export interface AdminTopLinksQueryParams {
  limit?: number
}

export interface AdminDeviceAnalyticsResponse {
  devices: Array<{ type: string; clicks: number }>
  browsers: Array<{ name: string; clicks: number }>
  operatingSystems: Array<{ name: string; clicks: number }>
  countries: Array<{ country: string; clicks: number }>
}
