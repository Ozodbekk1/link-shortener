import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UserCleanupService {
  private readonly logger = new Logger(UserCleanupService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handlePendingUsersCleanup() {
    this.logger.log(
      'Initiating periodic cleanup for expired pending accounts...',
    );

    const tenMinutesAgo = new Date();
    tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);

    try {
      const deleteResult = await this.prisma.user.deleteMany({
        where: {
          status: 'PENDING',
          createdAt: {
            lt: tenMinutesAgo,
          },
        },
      });

      if (deleteResult.count > 0) {
        this.logger.warn(
          `Successfully purged ${deleteResult.count} expired pending users from the database.`,
        );
      } else {
        this.logger.log('Cleanup finished. No expired pending users found.');
      }
    } catch (error) {
      this.logger.error('Failed to execute pending user cleanup job:', error);
    }
  }
}
