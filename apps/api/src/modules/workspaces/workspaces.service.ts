import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { OrganizationRole } from '@prisma/client';

@Injectable()
export class WorkspacesService {
  constructor(private prisma: PrismaService) {}

  async createWorkspace(
    userId: string,
    organizationId: string,
    dto: CreateWorkspaceDto,
  ) {
    // Check user access
    const membership = await this.prisma.organizationMember.findFirst({
      where: {
        organizationId,
        userId,
      },
      select: {
        role: true,
      },
    });

    if (!membership) {
      throw new ForbiddenException('You do not belong to this organization');
    }

    // Only OWNER and ADMIN can create workspace
    if (
      membership.role !== OrganizationRole.OWNER &&
      membership.role !== OrganizationRole.ADMIN
    ) {
      throw new ForbiddenException('You cannot create workspace');
    }

    // Generate slug

    const slug = dto.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    // Create workspace

    const workspace = await this.prisma.workspace.create({
      data: {
        name: dto.name,
        slug,

        organization: {
          connect: {
            id: organizationId,
          },
        },
      },

      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
      },
    });

    return workspace;
  }

  async getOrganizationWorkspaces(
    userId: string,
    organizationId: string,
    page = 1,
    limit = 20,
  ) {
    // Check user membership
    const membership = await this.prisma.organizationMember.findFirst({
      where: {
        organizationId,
        userId,
      },
      select: {
        role: true,
      },
    });

    if (!membership) {
      throw new ForbiddenException(
        'You do not have access to this organization',
      );
    }

    const skip = (page - 1) * limit;

    const [workspaces, total] = await this.prisma.$transaction([
      this.prisma.workspace.findMany({
        where: {
          organizationId,
        },

        skip,
        take: limit,

        orderBy: {
          createdAt: 'desc',
        },

        select: {
          id: true,
          name: true,
          slug: true,
          createdAt: true,

          _count: {
            select: {
              teams: true,
              links: true,
              campaigns: true,
              domains: true,
            },
          },
        },
      }),

      this.prisma.workspace.count({
        where: {
          organizationId,
        },
      }),
    ]);

    return {
      workspaces: workspaces.map((workspace) => ({
        id: workspace.id,

        name: workspace.name,

        slug: workspace.slug,

        createdAt: workspace.createdAt,

        statistics: {
          teams: workspace._count.teams,
          links: workspace._count.links,
          campaigns: workspace._count.campaigns,
          domains: workspace._count.domains,
        },
      })),

      pagination: {
        total,

        page,

        limit,

        totalPages: Math.ceil(total / limit),

        hasNext: page * limit < total,

        hasPrevious: page > 1,
      },
    };
  }

  async getWorkspace(
    userId: string,
    organizationId: string,
    workspaceId: string,
  ) {
    // 1. Check user membership in organization

    const membership = await this.prisma.organizationMember.findFirst({
      where: {
        organizationId,
        userId,
      },

      select: {
        role: true,
      },
    });

    if (!membership) {
      throw new ForbiddenException(
        'You do not have access to this organization',
      );
    }

    // 2. Get workspace

    const workspace = await this.prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        organizationId,
      },

      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        organizationId: true,

        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },

        _count: {
          select: {
            teams: true,
            links: true,
            campaigns: true,
            domains: true,
            webhooks: true,
          },
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    return {
      id: workspace.id,

      name: workspace.name,

      slug: workspace.slug,

      organization: {
        id: workspace.organization.id,
        name: workspace.organization.name,
        slug: workspace.organization.slug,
      },

      createdAt: workspace.createdAt,

      statistics: {
        teams: workspace._count.teams,

        links: workspace._count.links,

        campaigns: workspace._count.campaigns,

        domains: workspace._count.domains,

        webhooks: workspace._count.webhooks,
      },
    };
  }

  async deleteWorkspace(
    userId: string,
    organizationId: string,
    workspaceId: string,
  ) {
    // 1. Check organization membership
    const membership = await this.prisma.organizationMember.findFirst({
      where: {
        organizationId,
        userId,
      },
      select: {
        role: true,
      },
    });

    if (!membership) {
      throw new ForbiddenException(
        'You do not have access to this organization',
      );
    }

    // 2. Only OWNER and ADMIN can delete workspace

    if (
      membership.role !== OrganizationRole.OWNER &&
      membership.role !== OrganizationRole.ADMIN
    ) {
      throw new ForbiddenException(
        'You do not have permission to delete workspace',
      );
    }

    // 3. Check workspace exists inside organization

    const workspace = await this.prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        organizationId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    // 4. Delete workspace

    await this.prisma.workspace.delete({
      where: {
        id: workspaceId,
      },
    });

    return {
      message: 'Workspace deleted successfully',
      workspace: {
        id: workspace.id,
        name: workspace.name,
      },
    };
  }
}
