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

  const allowedOrigins = env.WEB_ORIGIN?.split(',').map((o) => o.trim()) || [];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      // Check against WEB_ORIGIN list
      const isExplicitlyAllowed = allowedOrigins.includes(origin);

      // Check if origin matches .uurl.uz or .uurl.uz subdomains
      const isUurlSubdomain = /^https:\/\/(.*\.)?uurl\.uz$/.test(origin);

      if (isExplicitlyAllowed || isUurlSubdomain) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        callback(null, true);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // app.enableCors({
  //   origin: env.WEB_ORIGIN
  //     ? env.WEB_ORIGIN.split(',').map((origin) => origin.trim())
  //     : true,
  //   credentials: true,
  // });
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
