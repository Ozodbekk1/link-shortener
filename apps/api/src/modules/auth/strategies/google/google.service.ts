import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { JwtService } from '../jwt/jwt.service';
import { env } from 'src/config/env.config';
import * as bcrypt from 'bcrypt';

export type GoogleOAuthUserData = {
  googleId: string;
  email: string;
  name?: string;
  avatar?: string | null;
};

@Injectable()
export class GoogleAuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async googleLogin(userData: GoogleOAuthUserData) {
    const { email, name, avatar, googleId } = userData;

    if (!email) {
      throw new UnauthorizedException('Google account has no email');
    }

    const dummyPassword = `GOOGLE_AUTH_BYPASS_${googleId}_${env.GOOGLE_AUTH_BYPASS_SECRET}`;
    const passwordHash = await bcrypt.hash(dummyPassword, 10);

    const user = await this.prisma.user.upsert({
      where: { email },
      create: {
        email,
        name: name ?? 'Google User',
        avatar,
        passwordHash,
        googleId: googleId,
        status: 'ACTIVE',
        emailVerified: true,
      },
      update: {
        avatar,
        name: name ?? undefined,
      },
    });

    return user;
  }

  async generateJwtTokens(userData: GoogleOAuthUserData) {
    const user = await this.googleLogin(userData);
    const { accessToken, refreshToken } =
      await this.jwtService.issueSession(user);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
