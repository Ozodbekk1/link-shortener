# Task: Fix ESLint errors in invite member service/controller

## Plan

- **File**: `apps/api/src/modules/members/invite.member.controller.ts`

### Steps

- [x] 1. Analyze codebase and identify actual ESLint errors (controller, not service)
- [x] 2. Get user approval on edit plan
- [x] 3. Edit `invite.member.controller.ts`:
  - Add `Request` from `express` import
  - Add `AuthTokenPayload` from `jwt.types` import
  - Type `req` as `Request & { user?: AuthTokenPayload }` on both endpoints
  - Remove unnecessary `as string` casts
- [x] 4. Run ESLint to verify no errors
- [x] 5. Update TODO.md as completed
