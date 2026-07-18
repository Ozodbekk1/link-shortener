import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './config/db.config';
import { DatabaseModule } from './database/database.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { GoogleModule } from './modules/auth/strategies/google/google.module';
import { JwtStrategyModule } from './modules/auth/strategies/jwt/jwt.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';
import { UserCleanupService } from './common/utils/task.utils';
import { TelegramAuthModule } from './modules/auth/strategies/telegram/telegram.module';
import { UsersModule } from './modules/users/users.module';
import { minutes, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                  colorize: true,
                },
              }
            : undefined,
      },
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default', // If name is not provided, the name is given as default
        ttl: minutes(1), // Time window in minutes
        limit: 80, // Number of allowed requests in that window
      },
    ]),
    DatabaseModule,
    JwtStrategyModule,
    GoogleModule,
    TelegramAuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [
    UserCleanupService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
