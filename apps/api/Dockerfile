FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat curl
WORKDIR /app


FROM base AS builder
RUN npm install -g turbo
COPY . .
RUN turbo prune api --docker


FROM base AS installer

RUN corepack enable 

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
COPY --from=builder /app/.yarnrc.yml ./.yarnrc.yml

RUN apk add --no-cache \
    build-base \
    g++ \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    librsvg-dev \
    pixman-dev \
    freetype-dev \
    fontconfig-dev \
    glib-dev \
    python3 \
    pkgconfig

RUN yarn install --immutable

COPY --from=builder /app/out/full/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/out/full/apps/api/prisma.config.ts ./apps/api/prisma.config.ts
RUN yarn dlx prisma generate --schema=apps/api/prisma/schema.prisma

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN yarn build --filter=api...


FROM base AS runner

RUN apk add --no-cache \
    cairo \
    pango \
    jpeg \
    giflib \
    librsvg \
    pixman \
    freetype \
    fontconfig \
    glib

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

USER nestjs

COPY --from=installer --chown=nestjs:nodejs /app/apps/api/dist ./apps/api/dist
COPY --from=installer --chown=nestjs:nodejs /app/apps/api/prisma ./apps/api/prisma
COPY --from=installer --chown=nestjs:nodejs /app/apps/api/package.json ./apps/api/package.json
COPY --from=installer --chown=nestjs:nodejs /app/package.json ./package.json
COPY --from=installer --chown=nestjs:nodejs /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl --fail http://localhost:${PORT}/docs || exit 1

CMD ["node", "apps/api/dist/src/main.js"]