FROM node:20-slim AS base
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates && rm -rf /var/lib/apt/lists/*
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

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3 \
    pkg-config \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

RUN yarn install --immutable

COPY --from=builder /app/out/full/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/out/full/apps/api/prisma.config.ts ./apps/api/prisma.config.ts
RUN yarn dlx prisma generate --schema=apps/api/prisma/schema.prisma

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN yarn build --filter=api...


FROM base AS runner

RUN apt-get update && apt-get install -y --no-install-recommends \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libjpeg62-turbo \
    libgif7 \
    librsvg2-2 \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 nestjs

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