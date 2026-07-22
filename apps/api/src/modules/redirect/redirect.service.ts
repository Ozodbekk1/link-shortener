import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { LinkStatus, RedirectType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import type { Request } from 'express';
import { UAParser } from 'ua-parser-js';

export interface RedirectRuleMatch {
  ruleType: string;
  ruleValue: string;
  destinationUrl: string;
  matched: boolean;
  reason?: string;
}

export interface RedirectValidationResult {
  slug: string;
  title: string | null;
  originalUrl: string;
  customDomain: string | null;
  shortUrl: string;
  status: string;
  isExpired: boolean;
  isPasswordProtected: boolean;
  clickLimit: number | null;
  currentClicks: number;
  totalClicks: number;
  redirectRules: {
    type: string;
    value: string;
    destinationUrl: string;
  }[];
}

export interface RulesPreviewResult {
  slug: string;
  title: string | null;
  originalUrl: string;
  fallbackUrl: string;
  context: {
    userAgent: string;
    device: string;
    browser: string | undefined;
    os: string | undefined;
    language: string | undefined;
    ip: string | undefined;
  };
  rules: RedirectRuleMatch[];
  matchedRule: RedirectRuleMatch | null;
  finalDestinationUrl: string;
}

@Injectable()
export class RedirectService {
  private readonly logger = new Logger(RedirectService.name);

  constructor(private readonly prisma: PrismaService) {}

  async resolveAndRedirect(
    slug: string,
    req: Request,
    password?: string,
  ): Promise<string> {
    const link = await this.prisma.link.findUnique({
      where: { shortSlug: slug },
      include: { redirectRules: true },
    });

    if (!link) {
      throw new NotFoundException('Short link not found');
    }

    await this.validateLink(link, password);

    const context = this.extractRequestContext(req);

    const destinationUrl = this.applyRedirectRules(
      link.redirectRules.map((r) => ({
        type: r.type,
        value: r.value,
        destinationUrl: r.destinationUrl,
      })),
      link.originalUrl,
      context,
    );

    try {
      await this.recordAnalytics(link.id, {
        ip: context.ip,
        country: undefined,
        city: undefined,
        region: undefined,
        device: context.device,
        browser: context.browser,
        os: context.os,
        referrer: context.referrer,
        language: context.language,
      });
    } catch (error) {
      this.logger.error(
        `Failed to record analytics for link ${link.id}: ${(error as Error).message}`,
      );
    }

    return destinationUrl;
  }

  async validateSlug(
    slug: string,
    req: Request,
    password?: string,
  ): Promise<RedirectValidationResult> {
    const link = await this.prisma.link.findUnique({
      where: { shortSlug: slug },
      include: {
        redirectRules: true,
        _count: { select: { clicks: true } },
      },
    });

    if (!link) {
      throw new NotFoundException('Short link not found');
    }

    if (link.passwordProtected && link.passwordHash) {
      if (!password) {
        throw new UnauthorizedException(
          'This link is password protected. Provide ?password= query parameter.',
        );
      }
      const isValid = await bcrypt.compare(password, link.passwordHash);
      if (!isValid) {
        throw new UnauthorizedException('Invalid password');
      }
    }

    const host = req.headers['host'] || 'inks.uz';
    const protocol = req.protocol || 'https';

    return {
      slug: link.shortSlug,
      title: link.title,
      originalUrl: link.originalUrl,
      customDomain: link.customDomain,
      shortUrl: link.customDomain
        ? `${protocol}://${link.customDomain}/${link.shortSlug}`
        : `${protocol}://${host}/r/${link.shortSlug}`,
      status: link.status,
      isExpired: link.expiresAt ? new Date() > link.expiresAt : false,
      isPasswordProtected: link.passwordProtected,
      clickLimit: link.clickLimit,
      currentClicks: link._count.clicks,
      totalClicks: link._count.clicks,
      redirectRules: link.redirectRules.map((r) => ({
        type: r.type,
        value: r.value,
        destinationUrl: r.destinationUrl,
      })),
    };
  }

  async previewRules(
    slug: string,
    req: Request,
    password?: string,
  ): Promise<RulesPreviewResult> {
    const link = await this.prisma.link.findUnique({
      where: { shortSlug: slug },
      include: { redirectRules: true },
    });

    if (!link) {
      throw new NotFoundException('Short link not found');
    }

    if (link.passwordProtected && link.passwordHash) {
      if (!password) {
        throw new UnauthorizedException(
          'This link is password protected. Provide ?password= query parameter.',
        );
      }
      const isValid = await bcrypt.compare(password, link.passwordHash);
      if (!isValid) {
        throw new UnauthorizedException('Invalid password');
      }
    }

    const context = this.extractRequestContext(req);

    const rules: RedirectRuleMatch[] = link.redirectRules.map((rule) => {
      let matched = false;
      let reason: string | undefined;

      switch (rule.type) {
        case 'COUNTRY': {
          const ctxCountry = context.country?.toLowerCase() || '';
          const ruleVal = rule.value.toLowerCase();
          matched = ctxCountry === ruleVal;
          reason = matched
            ? `Country "${ctxCountry}" matches rule value "${ruleVal}"`
            : `Country "${ctxCountry || 'unknown'}" does not match "${ruleVal}"`;
          break;
        }
        case 'DEVICE': {
          const ctxDevice = context.device?.toLowerCase() || '';
          const ruleVal = rule.value.toLowerCase();
          matched = ctxDevice === ruleVal;
          reason = matched
            ? `Device "${ctxDevice}" matches rule value "${ruleVal}"`
            : `Device "${ctxDevice || 'unknown'}" does not match "${ruleVal}"`;
          break;
        }
        case 'LANGUAGE': {
          const ctxLang = context.language?.toLowerCase() || '';
          const ruleVal = rule.value.toLowerCase();
          matched = ctxLang.startsWith(ruleVal);
          reason = matched
            ? `Language "${ctxLang}" starts with rule value "${ruleVal}"`
            : `Language "${ctxLang || 'unknown'}" does not start with "${ruleVal}"`;
          break;
        }
        case 'OS': {
          const ctxOs = context.os?.toLowerCase() || '';
          const ruleVal = rule.value.toLowerCase();
          matched = ctxOs === ruleVal;
          reason = matched
            ? `OS "${ctxOs}" matches rule value "${ruleVal}"`
            : `OS "${ctxOs || 'unknown'}" does not match "${ruleVal}"`;
          break;
        }
        default:
          reason = `Unknown rule type: ${String(rule.type)}`;
      }

      return {
        ruleType: rule.type,
        ruleValue: rule.value,
        destinationUrl: rule.destinationUrl,
        matched,
        reason,
      };
    });

    const matchedRule = rules.find((r) => r.matched) || null;
    const finalDestinationUrl = matchedRule
      ? matchedRule.destinationUrl
      : link.originalUrl;

    return {
      slug: link.shortSlug,
      title: link.title,
      originalUrl: link.originalUrl,
      fallbackUrl: link.originalUrl,
      context: {
        userAgent: req.headers['user-agent'] || '',
        device: context.device,
        browser: context.browser,
        os: context.os,
        language: context.language,
        ip: context.ip,
      },
      rules,
      matchedRule,
      finalDestinationUrl,
    };
  }

  private async validateLink(
    link: {
      id: string;
      status: string;
      expiresAt: Date | null;
      passwordProtected: boolean;
      passwordHash: string | null;
      clickLimit: number | null;
    },
    password?: string,
  ): Promise<void> {
    if (link.status !== LinkStatus.ACTIVE) {
      throw new BadRequestException('This link is no longer active');
    }

    if (link.expiresAt && new Date() > link.expiresAt) {
      throw new BadRequestException('This link has expired');
    }

    if (link.passwordProtected && link.passwordHash) {
      if (!password) {
        throw new UnauthorizedException(
          'This link is password protected. Provide ?password= query parameter.',
        );
      }
      const isValid = await bcrypt.compare(password, link.passwordHash);
      if (!isValid) {
        throw new UnauthorizedException('Invalid password');
      }
    }

    if (link.clickLimit !== null && link.clickLimit !== undefined) {
      const clickCount = await this.prisma.click.count({
        where: { linkId: link.id },
      });
      if (clickCount >= link.clickLimit) {
        await this.prisma.link.update({
          where: { id: link.id },
          data: { status: LinkStatus.DISABLED },
        });
        throw new BadRequestException('This link has reached its click limit');
      }
    }
  }

  private extractRequestContext(req: Request): {
    device: string;
    browser: string | undefined;
    os: string | undefined;
    language: string | undefined;
    ip: string | undefined;
    country: string | undefined;
    referrer: string | undefined;
  } {
    const userAgent = req.headers['user-agent'] || '';
    const parser = new UAParser(userAgent);

    return {
      device: parser.getDevice().type || 'desktop',
      browser: parser.getBrowser().name || undefined,
      os: parser.getOS().name || undefined,
      language:
        req.headers['accept-language']?.split(',')[0]?.trim() || undefined,
      ip: req.ip || req.socket.remoteAddress || undefined,
      country: undefined, // Geo-IP lookup can be added later (e.g. geoip-lite, maxmind)
      referrer:
        req.headers['referer'] ||
        (req.headers['referrer'] as string) ||
        undefined,
    };
  }

  applyRedirectRules(
    rules: { type: string; value: string; destinationUrl: string }[],
    fallbackUrl: string,
    context: {
      country?: string;
      device?: string;
      language?: string;
      os?: string;
    },
  ): string {
    if (!rules || rules.length === 0) {
      return fallbackUrl;
    }

    for (const rule of rules) {
      switch (rule.type) {
        case RedirectType.COUNTRY:
          if (context.country?.toLowerCase() === rule.value.toLowerCase()) {
            return rule.destinationUrl;
          }
          break;
        case RedirectType.DEVICE:
          if (context.device?.toLowerCase() === rule.value.toLowerCase()) {
            return rule.destinationUrl;
          }
          break;
        case RedirectType.LANGUAGE:
          if (
            context.language?.toLowerCase().startsWith(rule.value.toLowerCase())
          ) {
            return rule.destinationUrl;
          }
          break;
        case RedirectType.OS:
          if (context.os?.toLowerCase() === rule.value.toLowerCase()) {
            return rule.destinationUrl;
          }
          break;
      }
    }

    return fallbackUrl;
  }

  private async recordAnalytics(
    linkId: string,
    data: {
      ip?: string;
      country?: string;
      city?: string;
      region?: string;
      device?: string;
      browser?: string;
      os?: string;
      referrer?: string;
      language?: string;
    },
  ): Promise<void> {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    await this.prisma.$transaction(async (tx) => {
      await tx.click.create({
        data: {
          linkId,
          ip: data.ip,
          country: data.country,
          city: data.city,
          region: data.region,
          device: data.device,
          browser: data.browser,
          os: data.os,
          referrer: data.referrer,
          language: data.language,
          isBot: false,
          clickedAt: now,
        },
      });

      const existingDaily = await tx.dailyAnalytics.findUnique({
        where: { linkId_day: { linkId, day: startOfToday } },
      });

      if (existingDaily) {
        let incrementUnique = 0;
        if (data.ip) {
          const priorClicksToday = await tx.click.count({
            where: {
              linkId,
              ip: data.ip,
              clickedAt: { gte: startOfToday, lt: now },
            },
          });

          if (priorClicksToday === 0) {
            incrementUnique = 1;
          }
        }

        await tx.dailyAnalytics.update({
          where: { linkId_day: { linkId, day: startOfToday } },
          data: {
            totalClicks: { increment: 1 },
            ...(incrementUnique > 0 ? { uniqueClicks: { increment: 1 } } : {}),
          },
        });
      } else {
        await tx.dailyAnalytics.create({
          data: {
            linkId,
            day: startOfToday,
            totalClicks: 1,
            uniqueClicks: 1,
          },
        });
      }

      await tx.realtimeAnalytics.upsert({
        where: { linkId },
        create: {
          linkId,
          activeVisitors: 1,
        },
        update: {
          activeVisitors: { increment: 1 },
        },
      });
    });
  }

  async decrementActiveVisitors(linkId: string): Promise<void> {
    await this.prisma.realtimeAnalytics.update({
      where: { linkId },
      data: { activeVisitors: { decrement: 1 } },
    });
  }
}
