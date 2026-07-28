# Dockerization Customization Plan

## Done

- [x] Analyze existing Dockerfiles and docker-compose.yml
- [x] Review project structure, dependencies, and configs
- [x] **Step 1**: Create `.env.example` with all required variables
- [x] **Step 2**: Create `.dockerignore` for build optimization
- [x] **Step 3**: Rewrite `docker-compose.yml`
  - Add PostgreSQL service (persistent volume, healthcheck)
  - Add Redis service (persistent volume, healthcheck)
  - Update backend: depends_on conditions, healthcheck, proper env
  - Update frontend: healthcheck
  - Fix cloudflared: hardcoded path → relative credentials.json
- [x] **Step 4**: Fix `apps/api/Dockerfile`
  - Switch from npm to yarn (corepack with yarn 4.9.2)
  - Add prisma generate in build stage
  - Add healthcheck in runner
- [x] **Step 5**: Fix `apps/web/next.config.ts`
  - Add `output: 'standalone'` (required for Docker)
- [x] **Step 6**: Fix `apps/web/Dockerfile`
  - Switch from npm ci to yarn install --immutable
  - Add healthcheck in runner
  - Clean copy of standalone output

## Done

- [x] **Step 7**: Final review and verification — all files consistent and ready
