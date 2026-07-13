import { Module } from '@nestjs/common';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';
import { DatabaseModule } from 'src/database/database.module';
import { JwtStrategyModule } from '../jwt/jwt.module';

@Module({
  imports: [DatabaseModule, JwtStrategyModule],
  controllers: [TelegramController],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramAuthModule {}
