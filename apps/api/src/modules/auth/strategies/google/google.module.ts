import { Module } from '@nestjs/common';
import { GoogleStrategy } from './google.startegy';
import { GoogleAuthService } from './google.service';
import { GoogleAuthController } from './google.controller';
import { JwtStrategyModule } from '../jwt/jwt.module';

@Module({
  imports: [JwtStrategyModule],
  providers: [GoogleAuthService, GoogleStrategy],
  controllers: [GoogleAuthController],
})
export class GoogleModule {}
