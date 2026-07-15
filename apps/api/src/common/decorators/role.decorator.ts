import { SetMetadata } from '@nestjs/common';
import { Role } from '../constants/role.enums';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
