import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/database/prisma.service';
import { JwtService } from '../jwt/jwt.service';
import { env } from 'src/config/env.config';

export interface TelegramAuthPayload {
  hash: string;
  auth_date: string | number;
  id: string | number;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
  phone_number?: string;
  [key: string]: string | number | undefined;
}

@Injectable()
export class TelegramService {
  constructor(
    private prisma: PrismaService,
    // private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  private verifyTelegramHash(telegramData: TelegramAuthPayload): boolean {
    const { hash, ...dataCheck } = telegramData;

    if (!hash) return false;

    const dataCheckEntries = dataCheck as Record<
      string,
      string | number | undefined
    >;
    const dataCheckString = Object.keys(dataCheckEntries)
      .sort()
      .map((key) => `${key}=${dataCheckEntries[key]}`)
      .join('\n');

    const botToken = env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      throw new Error(
        'TELEGRAM_BOT_TOKEN is not defined in environment variables.',
      );
    }

    const secretKey = crypto.createHash('sha256').update(botToken).digest();

    const validationHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    const isHashValid = validationHash === hash;
    const now = Math.floor(Date.now() / 1000);
    const isFresh = now - Number(telegramData.auth_date) < 86400;

    return isHashValid && isFresh;
  }

  async loginWithTelegram(telegramPayload: TelegramAuthPayload) {
    // Validate that the request actually came from Telegram
    const isValid = this.verifyTelegramHash(telegramPayload);
    if (!isValid) {
      throw new UnauthorizedException(
        'Invalid or expired Telegram signature verification.',
      );
    }

    const telegramId = String(telegramPayload.id);
    const syntheticEmail = `tg-${telegramId}@uurl.tg.auth`;

    // Try finding the user by their unique placeholder email
    let user = await this.prisma.user.findUnique({
      where: { email: syntheticEmail },
    });

    // If they don't exist in our PostgreSQL instance, bootstrap a user profile safely
    if (!user) {
      // Create a complex password string that satisfies your Prisma NOT NULL validation
      // const jwtSecret = env.JWT_SECRET;
      // this.configService.get<string>('JWT_SECRET') || 'FALLBACK_SECRET';
      const dummyPassword = `TG_AUTH_BYPASS_${telegramId}_${env.TG_AUTH_BYPASS_SECRET}`;
      const passwordHash = await bcrypt.hash(dummyPassword, 10);

      // Build the display name string cleanly
      const fullName =
        `${telegramPayload.first_name || ''} ${telegramPayload.last_name || ''}`.trim();

      user = await this.prisma.user.create({
        data: {
          email: syntheticEmail,
          phone_number: telegramPayload.phone_number,
          passwordHash: passwordHash,
          name: fullName || `Telegram User ${telegramId}`,
          avatar: telegramPayload.photo_url || null,
          status: 'ACTIVE', // Pre-verified profile state
          emailVerified: true, // Bypasses email validation screens since TG identity is proven
        },
      });
    }

    return this.jwtService.issueSession(user);
  }
}
