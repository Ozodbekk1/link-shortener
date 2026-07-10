import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { LoginDto, RegisterDto } from '../../dto/auth.dto';
import type { PublicUser } from './jwt.types';
import { TokenService } from 'src/common/utils/jwt.util';

type SessionResult = {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class JwtService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async register(dto: RegisterDto): Promise<SessionResult> {
    const normalizedEmail = dto.email.toLowerCase();
    const existingUser = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await this.tokenService.hashData(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        name: dto.name,
        avatar: dto.avatar,
      },
    });

    return this.issueSession(user);
  }

  async login(dto: LoginDto): Promise<SessionResult> {
    const normalizedEmail = dto.email.toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (
      !user ||
      !(await this.tokenService.compareData(dto.password, user.passwordHash))
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.issueSession(user);
  }

  async refresh(refreshToken: string): Promise<SessionResult> {
    const payload = await this.tokenService.verifyToken(
      refreshToken,
      'refresh',
    );
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (
      !user?.refreshTokenHash ||
      !(await this.tokenService.compareData(
        refreshToken,
        user.refreshTokenHash,
      ))
    ) {
      throw new UnauthorizedException('Refresh session is not active');
    }

    return this.issueSession(user);
  }

  async revokeSession(refreshToken: string): Promise<void> {
    try {
      const payload = await this.tokenService.verifyToken(
        refreshToken,
        'refresh',
      );
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (
        user?.refreshTokenHash &&
        (await this.tokenService.compareData(
          refreshToken,
          user.refreshTokenHash,
        ))
      ) {
        await this.prisma.user.update({
          where: { id: user.id },
          data: { refreshTokenHash: null },
        });
      }
    } catch {
      // Intentionally silent: clean client side state even if token is dead/altered
    }
  }

  async getProfile(userId: string): Promise<PublicUser> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User session no longer exists');
    return this.toPublicUser(user);
  }

  private async issueSession(user: User): Promise<SessionResult> {
    const accessToken = await this.tokenService.signToken(user, 'access');
    const refreshToken = await this.tokenService.signToken(user, 'refresh');
    const refreshTokenHash = await this.tokenService.hashData(refreshToken);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash },
    });

    return { user: this.toPublicUser(user), accessToken, refreshToken };
  }

  private toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      emailVerified: user.emailVerified,
      twoFactorEnabled: user.twoFactorEnabled,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
