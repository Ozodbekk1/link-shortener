import {
  Injectable,
  ConflictException,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationRole } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { BLOCKED_DOMAINS } from 'src/common/constants/blocked.domains.constants';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrganization(dto: CreateOrganizationDto, ownerId: string) {
    const { name, slug } = dto;

    if (BLOCKED_DOMAINS.includes(slug.toLowerCase())) {
      throw new BadRequestException(
        `"${slug}" is a reserved keyword and cannot be used as a subdomain.`,
      );
    }

    const existingOrg = await this.prisma.organization.findUnique({
      where: { slug: slug.toLowerCase() },
    });
    if (existingOrg) {
      throw new ConflictException('This subdomain is already taken.');
    }

    return this.prisma.$transaction(async (tx) => {
      const newOrganization = await tx.organization.create({
        data: {
          name,
          slug: slug.toLowerCase(),
          ownerId,
        },
      });

      await tx.organizationMember.create({
        data: {
          organizationId: newOrganization.id,
          userId: ownerId,
          role: OrganizationRole.OWNER,
        },
      });

      // Auto-create default workspace for newly created organization
      // Requirement: workspace name must be "personal"
      await tx.workspace.create({
        data: {
          name: 'personal',
          slug: 'personal',
          organizationId: newOrganization.id,
        },
      });

      return newOrganization;
    });
  }

  async getAllOrganizations(userId: string) {
    const organizations = await this.prisma.organizationMember.findMany({
      where: {
        userId,
      },
      select: {
        role: true,
        joinedAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            createdAt: true,
            _count: {
              select: {
                members: true,
                workspaces: true,
              },
            },
          },
        },
      },
      orderBy: {
        joinedAt: 'asc',
      },
    });

    return {
      organizations: organizations.map((item) => ({
        id: item.organization.id,
        name: item.organization.name,
        slug: item.organization.slug,
        subdomain: `${item.organization.slug}.uurl.uz`,
        role: item.role,
        joinedAt: item.joinedAt,
        createdAt: item.organization.createdAt,
        memberCount: item.organization._count.members,
        workspaceCount: item.organization._count.workspaces,
      })),
    };
  }

  async getOrganizationById(userId: string, organizationId: string) {
    const membership = await this.prisma.organizationMember.findFirst({
      where: {
        userId,
        organizationId,
      },
      select: {
        role: true,
        joinedAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            createdAt: true,

            owner: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },

            _count: {
              select: {
                members: true,
                workspaces: true,
                roles: true,
              },
            },
          },
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException(
        'You do not have access to this organization.',
      );
    }

    return {
      id: membership.organization.id,
      name: membership.organization.name,
      slug: membership.organization.slug,
      subdomain: `${membership.organization.slug}.uurl.uz`,

      role: membership.role,
      joinedAt: membership.joinedAt,
      createdAt: membership.organization.createdAt,

      owner: membership.organization.owner,

      statistics: {
        members: membership.organization._count.members,
        workspaces: membership.organization._count.workspaces,
        roles: membership.organization._count.roles,
      },
    };
  }

  async getOrganizationMembers(
    userId: string,
    organizationId: string,
    page = 1,
    limit = 20,
  ) {
    // Verify user belongs to the organization
    const membership = await this.prisma.organizationMember.findFirst({
      where: {
        organizationId,
        userId,
      },
    });

    if (!membership) {
      throw new ForbiddenException(
        'You are not a member of this organization.',
      );
    }

    const skip = (page - 1) * limit;

    const [members, total] = await this.prisma.$transaction([
      this.prisma.organizationMember.findMany({
        where: {
          organizationId,
        },
        skip,
        take: limit,
        orderBy: {
          joinedAt: 'desc',
        },
        select: {
          id: true,
          role: true,
          joinedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              status: true,
              createdAt: true,
            },
          },
        },
      }),

      this.prisma.organizationMember.count({
        where: {
          organizationId,
        },
      }),
    ]);

    return {
      members: members.map((member) => ({
        id: member.id,
        role: member.role,
        joinedAt: member.joinedAt,

        user: {
          id: member.user.id,
          name: member.user.name,
          email: member.user.email,
          avatar: member.user.avatar,
          status: member.user.status,
          createdAt: member.user.createdAt,
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

  async deleteOrganization(userId: string, organizationId: string) {
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
        'You are not a member of this organization.',
      );
    }

    if (membership.role !== OrganizationRole.OWNER) {
      throw new ForbiddenException(
        'Only the organization owner can delete the organization.',
      );
    }

    const organization = await this.prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found.');
    }

    await this.prisma.organization.delete({
      where: {
        id: organizationId,
      },
    });

    return {
      message: 'Organization deleted successfully.',
    };
  }
}
