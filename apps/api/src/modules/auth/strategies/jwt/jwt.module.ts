import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/database/database.module';
import { CookieService } from 'src/common/utils/cookie.util';
import { TokenService } from 'src/common/utils/jwt.util';
import { JwtStrategy } from 'src/common/guards/jwt.guard';
import { JwtController } from './jwt.controller';
import { JwtService } from './jwt.service';
import { EmailService } from 'src/common/utils/sendEmail.utils';

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
})
export class JwtStrategyModule {}
