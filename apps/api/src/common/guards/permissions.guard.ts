import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  PERMISSIONS_KEY,
  RequiredPermission,
} from '../decorators/permissions.decorator';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission =
      this.reflector.getAllAndOverride<RequiredPermission>(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User authentication required');
    }

    const userId = user.id || user.sub;

    if (!userId) {
      throw new ForbiddenException('User ID not found in request context');
    }

    const organizationId =
      request.headers['x-organization-id'] ||
      request.params.organizationId ||
      request.body.organizationId;

    if (!organizationId) {
      throw new BadRequestException('Header "x-organization-id" is missing');
    }

    const roles = await this.prisma.role.findMany({
      where: {
        organizationId,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    const userPermissions = roles.flatMap((role) =>
      role.permissions.map(
        (rp) => `${rp.permission.action}:${rp.permission.resource}`,
      ),
    );

    const requiredKey = `${requiredPermission.action}:${requiredPermission.resource}`;
    const wildcardKey = `manage:${requiredPermission.resource}`;

    const hasPermission =
      userPermissions.includes(requiredKey) ||
      userPermissions.includes(wildcardKey);

    if (!hasPermission) {
      throw new ForbiddenException(
        `Forbidden: Missing permission [${requiredPermission.action}] on [${requiredPermission.resource}]`,
      );
    }

    return true;
  }
}
