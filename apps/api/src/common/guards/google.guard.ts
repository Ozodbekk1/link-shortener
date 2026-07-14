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
      prompt: 'select_account', //  This forces Google to show the account chooser
      accessType: 'offline', // (Optional) Keeps refresh token active
    };
  }

  // Override handleRequest to see if Passport threw an error during callback processing
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
