import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    const isValid = this.verifyTelegramHash(telegramPayload);
    if (!isValid) {
      throw new UnauthorizedException(
        'Invalid or expired Telegram signature verification.',
      );
    }

    const telegramId = String(telegramPayload.id);
    const syntheticEmail = `tg-${telegramId}@uurl.tg.auth`;

    let user = await this.prisma.user.findUnique({
      where: { email: syntheticEmail },
    });

    if (!user) {
      const dummyPassword = `TG_AUTH_BYPASS_${telegramId}_${env.TG_AUTH_BYPASS_SECRET}`;
      const passwordHash = await bcrypt.hash(dummyPassword, 10);

      const fullName =
        `${telegramPayload.first_name || ''} ${telegramPayload.last_name || ''}`.trim();

      user = await this.prisma.user.create({
        data: {
          email: syntheticEmail,
          phone_number: telegramPayload.phone_number,
          passwordHash: passwordHash,
          name: fullName || `Telegram User ${telegramId}`,
          avatar: telegramPayload.photo_url || null,
          status: 'ACTIVE',
          emailVerified: true,
        },
      });
    }

    return this.jwtService.issueSession(user);
  }
}
