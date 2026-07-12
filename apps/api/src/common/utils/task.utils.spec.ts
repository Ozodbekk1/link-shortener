import { Test, TestingModule } from '@nestjs/testing';
import { UserCleanupService } from './task.utils';
import { PrismaService } from 'src/database/prisma.service';

describe('UserCleanupService', () => {
  let service: UserCleanupService;
  let prismaService: {
    user: {
      deleteMany: jest.Mock;
    };
  };

  beforeEach(async () => {
    prismaService = {
      user: {
        deleteMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCleanupService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<UserCleanupService>(UserCleanupService);
  });

  it('deletes expired pending users', async () => {
    prismaService.user.deleteMany.mockResolvedValue({ count: 2 });

    await service.handlePendingUsersCleanup();

    expect(prismaService.user.deleteMany).toHaveBeenCalledWith({
      where: {
        status: 'PENDING',
        otpExpires: {
          lt: expect.any(Date),
        },
      },
    });
  });
});
