import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../../../../database/database.module';
import { CookieService } from '../../../../common/utils/cookie.util';
import { TokenService } from '../../../../common/utils/jwt.util';
import { JwtController } from './jwt.controller';
import { JwtService } from './jwt.service';
import { EmailService } from '../../../../common/utils/sendEmail.utils';
import { JwtStrategy } from '../../../../common/guards/jwt.strategy';

@Module({
  imports: [NestJwtModule.register({}), DatabaseModule],
  controllers: [JwtController],
  providers: [
    JwtService,
    TokenService,
    CookieService,
    JwtStrategy,
    EmailService,
  ],
  exports: [JwtService, CookieService],
})
export class JwtStrategyModule {}
