export const PermissionAction = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage', // All actions
} as const;

export type PermissionActionType =
  (typeof PermissionAction)[keyof typeof PermissionAction];

export const PermissionResource = {
  LINKS: 'links',
  CAMPAIGNS: 'campaigns',
  WORKSPACES: 'workspaces',
  DOMAINS: 'domains',
  TEAMS: 'teams',
  WEBHOOKS: 'webhooks',
} as const;

export type PermissionResourceType =
  (typeof PermissionResource)[keyof typeof PermissionResource];
