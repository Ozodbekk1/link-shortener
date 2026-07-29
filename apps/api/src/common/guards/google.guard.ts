import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions(context: ExecutionContext) {
    return {
      prompt: 'select_account',
      accessType: 'offline',
    };
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      console.error(' GOOGLE AUTH GUARD ERROR ');
      console.error('Error details:', err);
      console.error('Info details:', info);
      throw err || new UnauthorizedException('Google authentication failed');
    }
    return user;
  }
}
