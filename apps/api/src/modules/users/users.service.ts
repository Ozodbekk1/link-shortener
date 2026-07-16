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
}
