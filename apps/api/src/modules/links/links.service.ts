// src/links/links.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service'; // Adjust path to your PrismaService
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { QueryLinkDto } from './dto/query-link.dto';
import { LinkStatus, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class LinksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, workspaceId: string, dto: CreateLinkDto) {
    const slug = dto.shortSlug || nanoid(7);

    // Check slug uniqueness
    const existing = await this.prisma.link.findUnique({
      where: { shortSlug: slug },
    });
    if (existing) {
      throw new ConflictException('Short slug is already in use');
    }

    let passwordHash: string | null = null;
    if (dto.passwordProtected && dto.password) {
      passwordHash = await bcrypt.hash(dto.password, 10);
    }

    return this.prisma.link.create({
      data: {
        userId,
        workspaceId,
        originalUrl: dto.originalUrl,
        shortSlug: slug,
        title: dto.title,
        campaignId: dto.campaignId,
        customDomain: dto.customDomain,
        clickLimit: dto.clickLimit,
        expiresAt: dto.expiresAt,
        passwordProtected: dto.passwordProtected ?? false,
        passwordHash,
        tags: dto.tags
          ? {
              create: dto.tags.map((tag) => ({ tag })),
            }
          : undefined,
        redirectRules: dto.redirectRules
          ? {
              create: dto.redirectRules,
            }
          : undefined,
      },
      include: {
        tags: true,
        redirectRules: true,
      },
    });
  }

  async findAll(workspaceId: string, query: QueryLinkDto) {
    const { page = 1, limit = 10, search, status, campaignId, tag } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.LinkWhereInput = {
      workspaceId,
      ...(status && { status }),
      ...(campaignId && { campaignId }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { originalUrl: { contains: search, mode: 'insensitive' } },
          { shortSlug: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(tag && {
        tags: {
          some: { tag },
        },
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.link.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          tags: true,
          redirectRules: true,
          _count: { select: { clicks: true } },
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

  async findOne(id: string, workspaceId: string) {
    const link = await this.prisma.link.findFirst({
      where: { id, workspaceId },
      include: {
        tags: true,
        redirectRules: true,
        qrCodes: true,
        _count: { select: { clicks: true } },
      },
    });

    if (!link) {
      throw new NotFoundException(`Link with ID ${id} not found`);
    }

    return link;
  }

  async findBySlug(slug: string) {
    const link = await this.prisma.link.findUnique({
      where: { shortSlug: slug },
      include: { redirectRules: true },
    });

    if (!link) {
      throw new NotFoundException('Short link not found');
    }

    // Status / Expiry Checks
    if (link.status !== LinkStatus.ACTIVE) {
      throw new BadRequestException('Link is no longer active');
    }
    if (link.expiresAt && new Date() > link.expiresAt) {
      throw new BadRequestException('Link has expired');
    }

    return link;
  }

  async update(id: string, workspaceId: string, dto: UpdateLinkDto) {
    await this.findOne(id, workspaceId);

    let passwordHash: string | undefined = undefined;
    if (dto.password) {
      passwordHash = await bcrypt.hash(dto.password, 10);
    }

    const { tags, redirectRules, password, ...rest } = dto;

    return this.prisma.$transaction(async (tx) => {
      // Handle tag updates if provided
      if (tags) {
        await tx.linkTag.deleteMany({ where: { linkId: id } });
        await tx.linkTag.createMany({
          data: tags.map((tag) => ({ linkId: id, tag })),
        });
      }

      // Handle redirect rule updates if provided
      if (redirectRules) {
        await tx.redirectRule.deleteMany({ where: { linkId: id } });
        await tx.redirectRule.createMany({
          data: redirectRules.map((rule) => ({ ...rule, linkId: id })),
        });
      }

      return tx.link.update({
        where: { id },
        data: {
          ...rest,
          ...(passwordHash && { passwordHash }),
        },
        include: {
          tags: true,
          redirectRules: true,
        },
      });
    });
  }

  async remove(id: string, workspaceId: string) {
    await this.findOne(id, workspaceId);
    return this.prisma.link.delete({
      where: { id },
    });
  }

  // ─── Analytics ───────────────────────────────────────────────

  /** Overview stats for the workspace */
  async getAnalyticsOverview(workspaceId: string) {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const links = await this.prisma.link.findMany({
      where: { workspaceId },
      select: { id: true, status: true, _count: { select: { clicks: true } } },
    });

    const totalLinks = links.length;
    const activeLinks = links.filter(
      (l) => l.status === LinkStatus.ACTIVE,
    ).length;
    const totalClicks = links.reduce((sum, l) => sum + l._count.clicks, 0);

    // Clicks today across all links in workspace
    const clicksToday = await this.prisma.click.count({
      where: {
        link: { workspaceId },
        clickedAt: { gte: startOfToday },
      },
    });

    // Unique clicks (by IP) for last 30 days
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const uniqueClicks = await this.prisma.click.groupBy({
      by: ['ip'],
      where: {
        link: { workspaceId },
        clickedAt: { gte: thirtyDaysAgo },
        ip: { not: null },
      },
    });

    return {
      totalLinks,
      activeLinks,
      totalClicks,
      clicksToday,
      uniqueVisitorsLast30Days: uniqueClicks.length,
    };
  }

  /** Realtime active visitors per link in workspace */
  async getRealtimeAnalytics(workspaceId: string) {
    const data = await this.prisma.realtimeAnalytics.findMany({
      where: { link: { workspaceId } },
      include: {
        link: {
          select: { id: true, shortSlug: true, title: true, originalUrl: true },
        },
      },
    });

    return data.map((entry) => ({
      linkId: entry.linkId,
      shortSlug: entry.link.shortSlug,
      title: entry.link.title,
      originalUrl: entry.link.originalUrl,
      activeVisitors: entry.activeVisitors,
      lastUpdated: entry.updatedAt,
    }));
  }

  /** Clicks grouped by country */
  async getCountriesAnalytics(workspaceId: string) {
    const result = await this.prisma.click.groupBy({
      by: ['country'],
      where: {
        link: { workspaceId },
        country: { not: null },
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    return result.map((r) => ({
      country: r.country,
      clicks: r._count.id,
    }));
  }

  /** Clicks grouped by device, OS, and browser */
  async getDevicesAnalytics(workspaceId: string) {
    const [byDevice, byOs, byBrowser] = await Promise.all([
      this.prisma.click.groupBy({
        by: ['device'],
        where: { link: { workspaceId }, device: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),
      this.prisma.click.groupBy({
        by: ['os'],
        where: { link: { workspaceId }, os: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),
      this.prisma.click.groupBy({
        by: ['browser'],
        where: { link: { workspaceId }, browser: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),
    ]);

    return {
      devices: byDevice.map((r) => ({ device: r.device, clicks: r._count.id })),
      os: byOs.map((r) => ({ os: r.os, clicks: r._count.id })),
      browsers: byBrowser.map((r) => ({
        browser: r.browser,
        clicks: r._count.id,
      })),
    };
  }

  /** Single link analytics */
  async getLinkAnalytics(linkId: string, workspaceId: string) {
    // Ensure the link exists and belongs to this workspace
    const link = await this.prisma.link.findFirst({
      where: { id: linkId, workspaceId },
      select: { id: true, shortSlug: true, title: true, originalUrl: true },
    });
    if (!link) {
      throw new NotFoundException(
        `Link with ID ${linkId} not found in this workspace`,
      );
    }

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalClicks,
      clicksToday,
      clicksLast7Days,
      uniqueIps,
      countries,
      devices,
      dailyAnalytics,
      realtime,
    ] = await Promise.all([
      this.prisma.click.count({ where: { linkId } }),
      this.prisma.click.count({
        where: { linkId, clickedAt: { gte: startOfToday } },
      }),
      this.prisma.click.count({
        where: { linkId, clickedAt: { gte: last7Days } },
      }),
      this.prisma.click.groupBy({
        by: ['ip'],
        where: { linkId, ip: { not: null } },
      }),
      this.prisma.click.groupBy({
        by: ['country'],
        where: { linkId, country: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),
      this.prisma.click.groupBy({
        by: ['device'],
        where: { linkId, device: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),
      this.prisma.dailyAnalytics.findMany({
        where: { linkId, day: { gte: last7Days } },
        orderBy: { day: 'asc' },
      }),
      this.prisma.realtimeAnalytics.findUnique({
        where: { linkId },
      }),
    ]);

    return {
      link,
      totalClicks,
      clicksToday,
      clicksLast7Days,
      uniqueVisitors: uniqueIps.length,
      countries: countries.map((r) => ({
        country: r.country,
        clicks: r._count.id,
      })),
      devices: devices.map((r) => ({ device: r.device, clicks: r._count.id })),
      daily: dailyAnalytics.map((d) => ({
        day: d.day,
        totalClicks: d.totalClicks,
        uniqueClicks: d.uniqueClicks,
      })),
      activeVisitors: realtime?.activeVisitors ?? 0,
    };
  }
}
