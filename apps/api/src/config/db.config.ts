import { registerAs } from '@nestjs/config';
import { env } from './env.config';

export const databaseConfig = registerAs('database', () => ({
  url: env.DATABASE_URL,
}));
