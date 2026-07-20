import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class WorkspaceMemberGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const workspaceId = request.params.workspaceId as string;
    const userId = request.user.sub as string;

    const workspace = await this.prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        organization: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!workspace) {
      throw new ForbiddenException('Workspace not found');
    }

    const isMember = workspace.organization.members.some(
      (member) => member.userId === userId,
    );

    if (!isMember) {
      throw new ForbiddenException('You are not a member of this workspace');
    }

    return true;
  }
}
