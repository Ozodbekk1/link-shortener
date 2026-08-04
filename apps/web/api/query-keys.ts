export const queryKeys = {
  users: {
    all: (params?: Record<string, unknown>) =>
      ["users", "all", params].filter(
        (x) => x !== undefined
      ) as readonly unknown[],
    byId: (id: string) => ["users", "id", id] as const,
    me: ["users", "me"] as const,
  },
  organizations: {
    all: ["organizations", "all"] as const,
    byId: (id: string) => ["organizations", "id", id] as const,
    members: (id: string, params?: Record<string, unknown>) =>
      ["organizations", id, "members", params].filter(
        (x) => x !== undefined
      ) as readonly unknown[],
  },
  workspaces: {
    all: (orgId: string, params?: Record<string, unknown>) =>
      ["organizations", orgId, "workspaces", "all", params].filter(
        (x) => x !== undefined
      ) as readonly unknown[],
    byId: (orgId: string, workspaceId: string) =>
      ["organizations", orgId, "workspaces", "id", workspaceId] as const,
  },
  teams: {
    all: (workspaceId: string, params?: Record<string, unknown>) =>
      ["workspaces", workspaceId, "teams", "all", params].filter(
        (x) => x !== undefined
      ) as readonly unknown[],
    byId: (workspaceId: string, teamId: string) =>
      ["workspaces", workspaceId, "teams", "id", teamId] as const,
    members: (teamId: string) => ["teams", teamId, "members"] as const,
  },
  links: {
    all: (workspaceId: string, params?: Record<string, unknown>) =>
      ["workspaces", workspaceId, "links", "all", params].filter(
        (x) => x !== undefined
      ) as readonly unknown[],
    byId: (workspaceId: string, linkId: string) =>
      ["workspaces", workspaceId, "links", "id", linkId] as const,
    bySlug: (slug: string) => ["links", "slug", slug] as const,
  },
  analytics: {
    overview: (workspaceId: string) =>
      ["workspaces", workspaceId, "analytics", "overview"] as const,
    realtime: (workspaceId: string) =>
      ["workspaces", workspaceId, "analytics", "realtime"] as const,
    countries: (workspaceId: string) =>
      ["workspaces", workspaceId, "analytics", "countries"] as const,
    devices: (workspaceId: string) =>
      ["workspaces", workspaceId, "analytics", "devices"] as const,
    singleLink: (workspaceId: string, linkId: string) =>
      ["workspaces", workspaceId, "links", linkId, "analytics"] as const,
  },
  redirects: {
    validate: (slug: string, password?: string) =>
      ["redirects", "validate", slug, password].filter(
        (x) => x !== undefined
      ) as readonly unknown[],
    rules: (slug: string, password?: string) =>
      ["redirects", "rules", slug, password].filter(
        (x) => x !== undefined
      ) as readonly unknown[],
  },
  roles: {
    all: (orgId: string) => ["roles", "organization", orgId] as const,
  },
  permissions: {
    all: ["permissions", "all"] as const,
    byId: (id: string) => ["permissions", "id", id] as const,
  },
  qr: {
    all: (workspaceId: string, params?: Record<string, unknown>) =>
      ["workspaces", workspaceId, "qr", "all", params].filter(
        (x) => x !== undefined
      ) as readonly unknown[],
    byId: (workspaceId: string, qrId: string) =>
      ["workspaces", workspaceId, "qr", "id", qrId] as const,
  },
  admin: {
    overview: ["admin", "dashboard", "overview"] as const,
    dailyStats: (days?: number) =>
      ["admin", "dashboard", "dailyStats", days].filter(
        (x) => x !== undefined
      ) as readonly unknown[],
    users: (params?: Record<string, unknown>) =>
      ["admin", "users", params].filter(
        (x) => x !== undefined
      ) as readonly unknown[],
    links: (params?: Record<string, unknown>) =>
      ["admin", "links", params].filter(
        (x) => x !== undefined
      ) as readonly unknown[],
    organizations: (params?: Record<string, unknown>) =>
      ["admin", "organizations", params].filter(
        (x) => x !== undefined
      ) as readonly unknown[],
    topLinks: (limit?: number) =>
      ["admin", "analytics", "topLinks", limit].filter(
        (x) => x !== undefined
      ) as readonly unknown[],
    devices: ["admin", "analytics", "devices"] as const,
  },
} as const
