import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { env } from './config/env.config';
import cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import dns from 'node:dns';

dns.setDefaultResultOrder('ipv4first');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.use(cookieParser());
  app.useLogger(app.get(Logger));
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  const allowedOrigins = env.WEB_ORIGIN
    ? env.WEB_ORIGIN.split(',').map((o) => o.trim())
    : ['http://localhost:3000', 'https://uurl.uz'];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. server-to-server, curl, mobile apps)
      if (!origin) return callback(null, true);

      const isAllowed = allowedOrigins.some((allowedOrigin) => {
        try {
          const originHost = new URL(origin).hostname;
          const allowedHost = new URL(
            allowedOrigin.startsWith('http')
              ? allowedOrigin
              : `https://${allowedOrigin}`,
          ).hostname;

          // Exact host match (e.g. uurl.uz === uurl.uz or localhost === localhost)
          if (originHost === allowedHost) return true;

          // Subdomain host match (e.g. donknow.uurl.uz ends with .uurl.uz)
          if (originHost.endsWith(`.${allowedHost}`)) return true;

          return false;
        } catch {
          return false;
        }
      });

      if (isAllowed) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
  });

  app.setGlobalPrefix('api/v1', {
    exclude: [
      // Redirect routes must be at root level for clean short URLs
      { path: 'r/:slug', method: 0 as const }, // GET /r/:slug — Core redirect
      { path: 'redirect/:slug', method: 0 as const }, // GET /redirect/:slug — Validate
      { path: 'redirect/rules/:slug', method: 0 as const }, // GET /redirect/rules/:slug — Rules preview
    ],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
