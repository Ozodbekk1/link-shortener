import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from './jwt.service';
import { PrismaService } from 'src/database/prisma.service';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { EmailService } from 'src/common/utils/sendEmail.utils';
import { TokenService } from 'src/common/utils/jwt.util';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('JwtService', () => {
  let service: JwtService;
  let prismaService: {
    user: {
      findUnique: jest.Mock;
      update: jest.Mock;
    };
  };
  let tokenService: {
    signToken: jest.Mock;
    hashData: jest.Mock;
    compareData: jest.Mock;
  };

  beforeEach(async () => {
    prismaService = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    tokenService = {
      signToken: jest.fn(),
      hashData: jest.fn(),
      compareData: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
        {
          provide: NestJwtService,
          useValue: {},
        },
        {
          provide: TokenService,
          useValue: tokenService,
        },
        {
          provide: EmailService,
          useValue: {
            generateOTP: jest.fn(),
            sendOtpEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('verifies email and issues a session', async () => {
    const now = new Date();
    prismaService.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      passwordHash: 'hashed-password',
      refreshTokenHash: null,
      name: 'Test User',
      avatar: null,
      otpCode: '123456',
      otpExpires: new Date(now.getTime() + 60_000),
      emailVerified: false,
      twoFactorEnabled: false,
      status: 'PENDING',
      createdAt: now,
      updatedAt: now,
    });
    prismaService.user.update.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      passwordHash: 'hashed-password',
      refreshTokenHash: null,
      name: 'Test User',
      avatar: null,
      otpCode: null,
      otpExpires: null,
      emailVerified: true,
      twoFactorEnabled: false,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    });
    tokenService.signToken.mockResolvedValueOnce('access-token');
    tokenService.signToken.mockResolvedValueOnce('refresh-token');
    tokenService.hashData.mockResolvedValue('refresh-token-hash');

    const result = await service.verifyEmail({
      email: 'TEST@example.com',
      otpCode: '123456',
    });

    expect(prismaService.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
    expect(prismaService.user.update).toHaveBeenNthCalledWith(1, {
      where: { id: 'user-1' },
      data: {
        emailVerified: true,
        otpCode: null,
        otpExpires: null,
        status: 'ACTIVE',
      },
    });
    expect(prismaService.user.update).toHaveBeenNthCalledWith(2, {
      where: { id: 'user-1' },
      data: {
        refreshTokenHash: 'refresh-token-hash',
      },
    });
    expect(result).toEqual({
      user: {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        avatar: null,
        emailVerified: true,
        twoFactorEnabled: false,
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
      },
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
  });

  it('throws when the verification code is expired', async () => {
    prismaService.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      passwordHash: 'hashed-password',
      refreshTokenHash: null,
      name: 'Test User',
      avatar: null,
      otpCode: '123456',
      otpExpires: new Date(Date.now() - 60_000),
      emailVerified: false,
      twoFactorEnabled: false,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      service.verifyEmail({
        email: 'test@example.com',
        otpCode: '123456',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws when the email does not exist', async () => {
    prismaService.user.findUnique.mockResolvedValue(null);

    await expect(
      service.verifyEmail({
        email: 'missing@example.com',
        otpCode: '123456',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
