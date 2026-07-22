import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async getAllUsers(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [users, total] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          googleId: true,
          phone_number: true,
          name: true,
          avatar: true,
          emailVerified: true,
          twoFactorEnabled: true,
          status: true,
          userRole: true,
          createdAt: true,
          updatedAt: true,
          ownedOrganizations: true,
          memberships: true,
          teamMemberships: true,
          links: true,
          notifications: true,
        },
      }),
      this.prismaService.user.count(),
    ]);

    return {
      data: users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        googleId: true,
        phone_number: true,
        name: true,
        avatar: true,
        emailVerified: true,
        twoFactorEnabled: true,
        status: true,
        userRole: true,
        createdAt: true,
        updatedAt: true,
        ownedOrganizations: true,
        memberships: true,
        teamMemberships: true,
        links: true,
        notifications: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * GET /users/me — Full authenticated user profile with all related entities.
   * Fetches everything related to the user: organizations, workspaces, teams,
   * memberships, links (with qrCodes, tags, redirectRules), and notifications.
   */
  async getUserProfile(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        googleId: true,
        phone_number: true,
        name: true,
        avatar: true,
        emailVerified: true,
        twoFactorEnabled: true,
        status: true,
        userRole: true,
        createdAt: true,
        updatedAt: true,
        // Organizations the user owns
        ownedOrganizations: {
          include: {
            workspaces: {
              include: {
                teams: true,
                domains: true,
                _count: {
                  select: { links: true },
                },
              },
            },
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true,
                  },
                },
              },
            },
            _count: {
              select: { members: true, workspaces: true },
            },
          },
        },
        // Organizations the user is a member of
        memberships: {
          include: {
            organization: {
              select: {
                id: true,
                name: true,
                slug: true,
                ownerId: true,
              },
            },
          },
        },
        // Team memberships
        teamMemberships: {
          include: {
            team: {
              include: {
                workspace: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    organizationId: true,
                  },
                },
              },
            },
          },
        },
        // All links with full details
        links: {
          include: {
            tags: true,
            redirectRules: true,
            qrCodes: {
              select: {
                id: true,
                imageUrl: true,
                styleJson: true,
                createdAt: true,
              },
            },
            _count: {
              select: { clicks: true, qrCodes: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        // Notifications
        notifications: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { user };
  }
}
