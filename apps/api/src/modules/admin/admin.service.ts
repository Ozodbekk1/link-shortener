import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UserStatus, LinkStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      usersToday,
      usersThisMonth,
      totalLinks,
      linksToday,
      linksThisMonth,
      totalClicks,
      clicksToday,
      clicksThisMonth,
      totalOrganizations,
      totalWorkspaces,
      totalQrCodes,
      activeLinks,
      disabledLinks,
      pendingUsers,
      activeUsers,
      suspendedUsers,
    ] = await Promise.all([
      // Users
      this.prisma.user.count(),
      this.prisma.user.count({
        where: { createdAt: { gte: startOfToday } },
      }),
      this.prisma.user.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      // Links
      this.prisma.link.count(),
      this.prisma.link.count({
        where: { createdAt: { gte: startOfToday } },
      }),
      this.prisma.link.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      // Clicks
      this.prisma.click.count(),
      this.prisma.click.count({
        where: { clickedAt: { gte: startOfToday } },
      }),
      this.prisma.click.count({
        where: { clickedAt: { gte: startOfMonth } },
      }),
      // Organizations & Workspaces
      this.prisma.organization.count(),
      this.prisma.workspace.count(),
      // QR Codes
      this.prisma.qRCode.count(),
      // Link statuses
      this.prisma.link.count({ where: { status: LinkStatus.ACTIVE } }),
      this.prisma.link.count({ where: { status: LinkStatus.DISABLED } }),
      // User statuses
      this.prisma.user.count({ where: { status: UserStatus.PENDING } }),
      this.prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
      this.prisma.user.count({ where: { status: UserStatus.SUSPENDED } }),
    ]);

    return {
      users: {
        total: totalUsers,
        today: usersToday,
        thisMonth: usersThisMonth,
        byStatus: {
          pending: pendingUsers,
          active: activeUsers,
          suspended: suspendedUsers,
        },
      },
      links: {
        total: totalLinks,
        today: linksToday,
        thisMonth: linksThisMonth,
        byStatus: {
          active: activeLinks,
          disabled: disabledLinks,
        },
      },
      clicks: {
        total: totalClicks,
        today: clicksToday,
        thisMonth: clicksThisMonth,
      },
      organizations: {
        total: totalOrganizations,
      },
      workspaces: {
        total: totalWorkspaces,
      },
      qrCodes: {
        total: totalQrCodes,
      },
    };
  }

  async getDailyStats(days = 30) {
    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // Generate array of dates
    const dates: string[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      dates.push(d.toISOString().split('T')[0]);
    }

    // Get users per day
    const usersPerDay = await this.prisma.user.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    // Get links per day
    const linksPerDay = await this.prisma.link.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    // Get clicks per day
    const clicksPerDay = await this.prisma.click.findMany({
      where: { clickedAt: { gte: startDate } },
      select: { clickedAt: true },
      orderBy: { clickedAt: 'asc' },
    });

    // Group by date
    const userCounts: Record<string, number> = {};
    const linkCounts: Record<string, number> = {};
    const clickCounts: Record<string, number> = {};

    for (const u of usersPerDay) {
      const dateKey = u.createdAt.toISOString().split('T')[0];
      userCounts[dateKey] = (userCounts[dateKey] || 0) + 1;
    }

    for (const l of linksPerDay) {
      const dateKey = l.createdAt.toISOString().split('T')[0];
      linkCounts[dateKey] = (linkCounts[dateKey] || 0) + 1;
    }

    for (const c of clicksPerDay) {
      const dateKey = c.clickedAt.toISOString().split('T')[0];
      clickCounts[dateKey] = (clickCounts[dateKey] || 0) + 1;
    }

    const dailyStats = dates.map((date) => ({
      date,
      newUsers: userCounts[date] || 0,
      newLinks: linkCounts[date] || 0,
      clicks: clickCounts[date] || 0,
    }));

    return {
      days,
      startDate: startDate.toISOString(),
      endDate: now.toISOString(),
      data: dailyStats,
    };
  }

  async getUsers(page = 1, limit = 20, search?: string, status?: UserStatus) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          userRole: true,
          status: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              links: true,
              ownedOrganizations: true,
              memberships: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateUserStatus(userId: string, status: UserStatus) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { status },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        updatedAt: true,
      },
    });

    this.logger.log(`Admin updated user ${userId} status to ${status}`);

    return updated;
  }

  async getLinks(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { originalUrl: { contains: search, mode: 'insensitive' } },
        { shortSlug: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.link.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          workspace: {
            select: { id: true, name: true, slug: true },
          },
          _count: {
            select: { clicks: true, qrCodes: true },
          },
        },
      }),
      this.prisma.link.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOrganizations(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.organization.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: {
              members: true,
              workspaces: true,
              roles: true,
            },
          },
        },
      }),
      this.prisma.organization.count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTopLinks(limit = 10) {
    const links = await this.prisma.link.findMany({
      take: limit,
      orderBy: { clicks: { _count: 'desc' } },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { clicks: true },
        },
      },
    });

    return links.map((link, index) => ({
      rank: index + 1,
      id: link.id,
      title: link.title,
      shortSlug: link.shortSlug,
      originalUrl: link.originalUrl,
      clicks: link._count.clicks,
      createdBy: link.user,
      createdAt: link.createdAt,
    }));
  }

  async getDeviceAnalytics() {
    const byDevice = await this.prisma.click.groupBy({
      by: ['device'],
      where: { device: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    const byBrowser = await this.prisma.click.groupBy({
      by: ['browser'],
      where: { browser: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    const byOs = await this.prisma.click.groupBy({
      by: ['os'],
      where: { os: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    const byCountry = await this.prisma.click.groupBy({
      by: ['country'],
      where: { country: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 20,
    });

    return {
      devices: byDevice.map((r) => ({
        type: r.device,
        clicks: r._count.id,
      })),
      browsers: byBrowser.map((r) => ({
        name: r.browser,
        clicks: r._count.id,
      })),
      operatingSystems: byOs.map((r) => ({
        name: r.os,
        clicks: r._count.id,
      })),
      countries: byCountry.map((r) => ({
        country: r.country,
        clicks: r._count.id,
      })),
    };
  }
}
