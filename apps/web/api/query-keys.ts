export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  users: {
    all: (params?: Record<string, unknown>) =>
      ["users", "all", params].filter(
        (x) => x !== undefined
      ) as readonly string[],
    byId: (id: string) => ["users", "id", id] as const,
    me: ["users", "me"] as const,
  },
  organizations: {
    all: ["organizations", "all"] as const,
    byId: (id: string) => ["organizations", "id", id] as const,
    members: (id: string, params?: Record<string, unknown>) =>
      ["organizations", id, "members", params].filter(
        (x) => x !== undefined
      ) as readonly string[],
  },
} as const
