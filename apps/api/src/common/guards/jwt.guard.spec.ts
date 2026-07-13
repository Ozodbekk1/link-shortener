jest.mock('src/config/env.config', () => ({
  env: {
    JWT_ACCESS_SECRET: 'test-access-secret',
    JWT_SECRET: 'test-secret',
  },
}));

import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let prismaService: {
    user: {
      findUnique: jest.Mock;
    };
  };

  beforeEach(() => {
    prismaService = {
      user: {
        findUnique: jest.fn(),
      },
    };
  });

  it('allows access for verified active users', async () => {
    prismaService.user.findUnique.mockResolvedValue({
      emailVerified: true,
      status: 'ACTIVE',
    });

    const strategy = new JwtStrategy(prismaService as never);

    await expect(
      strategy.validate({
        sub: 'user-1',
        email: 'test@example.com',
        tokenKind: 'access',
      }),
    ).resolves.toEqual({
      sub: 'user-1',
      email: 'test@example.com',
      tokenKind: 'access',
    });
  });

  it('rejects access for unverified users', async () => {
    prismaService.user.findUnique.mockResolvedValue({
      emailVerified: false,
      status: 'PENDING',
    });

    const strategy = new JwtStrategy(prismaService as never);

    await expect(
      strategy.validate({
        sub: 'user-1',
        email: 'test@example.com',
        tokenKind: 'access',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects access for inactive users', async () => {
    prismaService.user.findUnique.mockResolvedValue({
      emailVerified: true,
      status: 'SUSPENDED',
    });

    const strategy = new JwtStrategy(prismaService as never);

    await expect(
      strategy.validate({
        sub: 'user-1',
        email: 'test@example.com',
        tokenKind: 'access',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
