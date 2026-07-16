import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtStrategyModule } from '../auth/strategies/jwt/jwt.module';

@Module({
  imports: [JwtStrategyModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
