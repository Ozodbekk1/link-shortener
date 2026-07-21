import { SetMetadata } from '@nestjs/common';
import {
  PermissionActionType,
  PermissionResourceType,
} from '../constants/permissions.constants';

export interface RequiredPermission {
  action: PermissionActionType;
  resource: PermissionResourceType;
}

export const PERMISSIONS_KEY = 'permissions';

export const RequirePermission = (
  action: PermissionActionType,
  resource: PermissionResourceType,
) => SetMetadata(PERMISSIONS_KEY, { action, resource });
