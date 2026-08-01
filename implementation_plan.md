# Production-Grade Authentication & Onboarding Flow Implementation

Implement a unified, enterprise-grade authentication system with centralized post-auth routing driven exclusively by `GET /api/v1/users/me`, replacing all cookie-based and client-side routing assumptions.

## User Review Required

> [!IMPORTANT]
> **Breaking Change — Middleware:** The current middleware uses `hasOrganization` cookie to redirect users. This will be **removed entirely**. Middleware will only handle locale detection and subdomain rewriting — all auth/org routing decisions move to client-side React components driven by the `/users/me` API response.

> [!IMPORTANT]
> **Breaking Change — Verify Account Page:** Currently sets `hasOrganization=false` cookie and pushes to `/onboarding/organization`. This will be replaced with a unified `usePostAuthRedirect()` hook that fetches `/users/me` and routes accordingly.

> [!WARNING]
> **Tenant Layout Nesting:** The current [tenant/layout.tsx](file:///Users/ozodbek/Coding/uurl.uz/apps/web/app/%5Blocale%5D/%28tenant%29/tenant-app/%5Btenant%5D/layout.tsx) renders a nested `<html>` and `<body>` inside the root layout. This is invalid HTML and will be fixed.

## Open Questions

> [!IMPORTANT]
> **Google OAuth Callback:** The [google/callback](file:///Users/ozodbek/Coding/uurl.uz/apps/web/app/%5Blocale%5D/%28main%29/auth/google/callback) directory exists but is empty. **Does the backend redirect to `/{locale}/auth/google/callback?token=...` after Google OAuth, or does it set cookies and redirect?** The plan assumes the backend sets HTTP-only cookies and redirects to `/auth/google/callback`, where the frontend simply calls `/users/me` to complete the flow.

> [!IMPORTANT]
> **Telegram Bot Name:** Currently hardcoded as `uurl_uz_oauth_bot`. Is this the correct bot for production?

> [!IMPORTANT]
> **`/users/me` vs `/jwt/auth/me`:** The codebase has two "me" endpoints — [authService.me](file:///Users/ozodbek/Coding/uurl.uz/apps/web/services/auth.service.ts#L73-L78) calls `/jwt/auth/me` (returns `AppUser`) and [usersService.getMyProfile](file:///Users/ozodbek/Coding/uurl.uz/apps/web/services/users.service.ts#L15) calls `/users/me` (returns `UserProfileResponse` with organizations). Per the requirement, **`/users/me` is the source of truth**. The plan will use `/users/me` for all post-auth routing and profile data, and deprecate `authService.me` / `useMeQuery` from `use-auth.ts`.

---

## Proposed Changes

### 1. Centralized Post-Auth Routing Engine

Create a single reusable function that ALL authentication providers call after successful auth. This is the core of the entire implementation — no auth flow should duplicate this logic.

---

#### [NEW] [post-auth-redirect.ts](file:///Users/ozodbek/Coding/uurl.uz/apps/web/lib/auth/post-auth-redirect.ts)

Centralized function `resolvePostAuthRedirect(user: UserProfileResponse)` that:
- Examines `user.ownedOrganizations` and `user.memberships` 
- If user has **no organizations** → returns `/{locale}/onboarding/organization`
- If user has **organizations** → returns `https://{org.slug}.{ROOT_DOMAIN}/{locale}/dashboard`
- Handles protocol detection (http vs https) based on environment

#### [NEW] [use-post-auth-redirect.ts](file:///Users/ozodbek/Coding/uurl.uz/apps/web/hooks/use-post-auth-redirect.ts)

React hook `usePostAuthRedirect()` that:
1. Calls `usersService.getMyProfile()` (which hits `GET /users/me`)
2. Waits for the response
3. Calls `resolvePostAuthRedirect(user)`
4. Performs the redirect (`window.location.replace` for cross-subdomain, `router.push` for same-domain)
5. Returns `{ redirect, isRedirecting, error }` for loading state management

---

### 2. Auth Service & Hook Consolidation

Clean up the dual "me" endpoint confusion.

---

#### [MODIFY] [auth.service.ts](file:///Users/ozodbek/Coding/uurl.uz/apps/web/services/auth.service.ts)

- Remove `me()` method (was hitting `/jwt/auth/me` which returns incomplete data)
- Keep all mutation methods (login, register, verifyOtp, logout, etc.)
- Add `telegramLogin` return type to be `{ message: string }` (consistent)

#### [MODIFY] [users.service.ts](file:///Users/ozodbek/Coding/uurl.uz/apps/web/services/users.service.ts)

- `getMyProfile()` is the canonical `/users/me` call — no changes needed, already correct

#### [MODIFY] [use-auth.ts](file:///Users/ozodbek/Coding/uurl.uz/apps/web/hooks/use-auth.ts)

- Remove `useMeQuery` (was using `authService.me` → `/jwt/auth/me`)
- Update `useLoginMutation` to invalidate `queryKeys.users.me` instead of `queryKeys.auth.me`
- Update `useLogoutMutation` to clear `queryKeys.users.me` and redirect to login
- Add `useTelegramLoginMutation` hook

#### [MODIFY] [query-keys.ts](file:///Users/ozodbek/Coding/uurl.uz/apps/web/api/query-keys.ts)

- Remove `auth.me` key (no longer needed)
- `users.me` becomes the single source of truth key

---

### 3. Auth Guard & Protected Route Components

Create proper route protection that blocks rendering until auth state is resolved.

---

#### [NEW] [auth-provider.tsx](file:///Users/ozodbek/Coding/uurl.uz/apps/web/common/providers/auth-provider.tsx)

React context provider `AuthProvider` that:
- On mount, calls `/users/me` via React Query
- Exposes `{ user, isLoading, isAuthenticated, error, refetchUser }`
- Shows a fullscreen loading splash while resolving
- If 401 → marks as unauthenticated (no redirect — that's the guard's job)

#### [NEW] [auth-guard.tsx](file:///Users/ozodbek/Coding/uurl.uz/apps/web/components/auth/auth-guard.tsx)

`AuthGuard` component that:
- Wraps protected pages
- Uses `AuthProvider` context
- While loading → shows fullscreen splash (animated UURL logo)
- If not authenticated → redirect to `/{locale}/auth/login`
- If authenticated → render children

#### [NEW] [org-guard.tsx](file:///Users/ozodbek/Coding/uurl.uz/apps/web/components/auth/org-guard.tsx)

`OrgGuard` component that:
- Requires authentication (uses `AuthGuard` internally)
- Checks if user has organizations
- No org → redirect to `/{locale}/onboarding/organization`
- Has org but on wrong subdomain → redirect to correct subdomain
- On correct subdomain → render children

#### [NEW] [guest-guard.tsx](file:///Users/ozodbek/Coding/uurl.uz/apps/web/components/auth/guest-guard.tsx)

`GuestGuard` component for login/register pages:
- If already authenticated → redirect using `usePostAuthRedirect`
- If not authenticated → render children (show login/register form)

#### [NEW] [fullscreen-loader.tsx](file:///Users/ozodbek/Coding/uurl.uz/apps/web/components/auth/fullscreen-loader.tsx)

Premium animated fullscreen loading screen shown during auth resolution:
- UURL logo with pulse animation
- Gradient background matching brand colors
- "Loading your workspace..." text with shimmer effect

---

### 4. Login Page Refactor

---

#### [MODIFY] [login/page.tsx](file:///Users/ozodbek/Coding/uurl.uz/apps/web/app/%5Blocale%5D/%28main%29/auth/login/page.tsx)

- Wrap with `GuestGuard` (redirects already-authed users)
- Replace `router.push('/${locale}/dashboard')` with `usePostAuthRedirect()` call
- Wire up `GoogleButton` to redirect to Google OAuth URL (`authService.googleAuthUrl()`)
- Wire up `TelegramWidget` to call `authService.telegramLogin()` then `usePostAuthRedirect()`
- All three auth methods (email, Google, Telegram) converge on the same post-auth flow

---

### 5. Register Page Refactor

---

#### [MODIFY] [register/page.tsx](file:///Users/ozodbek/Coding/uurl.uz/apps/web/app/%5Blocale%5D/%28main%29/auth/register/page.tsx)

- Wrap with `GuestGuard`
- Keep registration → verify flow as-is (register → redirect to verify-account page)
- Wire up Google and Telegram buttons same as login page

---

### 6. Verify Account Page Refactor

---

#### [MODIFY] [verify-account/page.tsx](file:///Users/ozodbek/Coding/uurl.uz/apps/web/app/%5Blocale%5D/%28main%29/auth/verify-account/page.tsx)

- Remove cookie manipulation (`hasOrganization=false`)
- On successful verification, use `usePostAuthRedirect()` hook
- This will call `/users/me`, see no org → redirect to `/onboarding/organization`

---

### 7. Google OAuth Callback Page

---

#### [NEW] [google/callback/page.tsx](file:///Users/ozodbek/Coding/uurl.uz/apps/web/app/%5Blocale%5D/%28main%29/auth/google/callback/page.tsx)

- Show fullscreen loader
- Backend has already set HTTP-only cookies at this point
- Immediately call `usePostAuthRedirect()` to fetch `/users/me` and route

---

### 8. Onboarding Organization Page Refactor

---

#### [MODIFY] [onboarding/organization/page.tsx](file:///Users/ozodbek/Coding/uurl.uz/apps/web/app/%5Blocale%5D/%28main%29/onboarding/organization/page.tsx)

- Wrap with `AuthGuard` (must be authenticated to create org)
- Remove cookie manipulation (`organization_slug`, `hasOrganization`)
- After successful org creation:
  1. Call `refetchUser()` from `AuthProvider` (re-fetches `/users/me`)
  2. Use `resolvePostAuthRedirect(user)` to get the correct subdomain URL
  3. `window.location.replace(...)` to the org's subdomain dashboard

---

### 9. Middleware Cleanup

---

#### [MODIFY] [middleware.ts](file:///Users/ozodbek/Coding/uurl.uz/apps/web/middleware.ts)

- **Remove** the `hasOrganization` cookie check block (lines 92-104)
- Keep locale detection and subdomain rewriting logic intact
- The middleware should only handle:
  1. Static file passthrough
  2. Locale detection + redirect
  3. Subdomain → tenant-app rewriting

---

### 10. Tenant Layout Fix & Auth Integration

---

#### [MODIFY] [tenant/layout.tsx](file:///Users/ozodbek/Coding/uurl.uz/apps/web/app/%5Blocale%5D/%28tenant%29/tenant-app/%5Btenant%5D/layout.tsx)

- Remove the nested `<html>` and `<body>` tags (invalid HTML, already in root layout)
- Wrap children with `AuthProvider` and `OrgGuard`
- Keep `SidebarProvider` + `AppSidebar` + `SidebarInset`

#### [MODIFY] [tenant/page.tsx](file:///Users/ozodbek/Coding/uurl.uz/apps/web/app/%5Blocale%5D/%28tenant%29/tenant-app/%5Btenant%5D/page.tsx)

- Instead of blindly redirecting to `/${locale}/dashboard`, redirect to `/${locale}/tenant-app/${tenant}/dashboard` or just let `OrgGuard` handle it

---

### 11. App Sidebar — Dynamic Organization Data

---

#### [MODIFY] [app-sidebar.tsx](file:///Users/ozodbek/Coding/uurl.uz/apps/web/components/app-sidebar.tsx)

- Use `AuthProvider` context to get real user + organization data
- Replace hardcoded `workspaces` array with user's actual `ownedOrganizations`
- Organization switcher: clicking a different org → `window.location.replace` to that org's subdomain
- User footer: show real user name, email, avatar
- Sign out button: call `useLogoutMutation` → clear query cache → redirect to login

---

### 12. API Client Enhancement

---

#### [MODIFY] [clients.ts](file:///Users/ozodbek/Coding/uurl.uz/apps/web/api/clients.ts)

- Add logout side effect on refresh token failure: clear React Query cache and redirect to login
- Import a `getQueryClient` singleton to enable cache clearing from the interceptor
- Add `onRefreshFailure` callback pattern to avoid circular dependencies

---

### 13. Root Layout — AuthProvider Integration

---

#### [MODIFY] [layout.tsx](file:///Users/ozodbek/Coding/uurl.uz/apps/web/app/layout.tsx)

- Add `AuthProvider` inside `QueryProvider` (needs React Query to function)
- This makes auth state available globally

---

### 14. Types Enhancement

---

#### [MODIFY] [types.ts](file:///Users/ozodbek/Coding/uurl.uz/apps/web/api/types.ts)

- Add a `UserOrganization` union type that combines owned orgs + memberships for routing logic
- Ensure `OwnedOrganization` has `slug` field (confirmed from API response — it does)

---

## File Summary

| Action | File | Purpose |
|--------|------|---------|
| NEW | `lib/auth/post-auth-redirect.ts` | Centralized routing logic |
| NEW | `hooks/use-post-auth-redirect.ts` | React hook for post-auth redirect |
| NEW | `common/providers/auth-provider.tsx` | Global auth context provider |
| NEW | `components/auth/auth-guard.tsx` | Protected route guard |
| NEW | `components/auth/org-guard.tsx` | Organization-required guard |
| NEW | `components/auth/guest-guard.tsx` | Guest-only (login/register) guard |
| NEW | `components/auth/fullscreen-loader.tsx` | Premium loading screen |
| NEW | `auth/google/callback/page.tsx` | Google OAuth completion |
| MODIFY | `middleware.ts` | Remove cookie-based org routing |
| MODIFY | `services/auth.service.ts` | Remove `me()`, keep mutations |
| MODIFY | `hooks/use-auth.ts` | Remove `useMeQuery`, add Telegram hook |
| MODIFY | `api/query-keys.ts` | Remove `auth.me` |
| MODIFY | `api/clients.ts` | Add refresh failure handling |
| MODIFY | `app/layout.tsx` | Add `AuthProvider` |
| MODIFY | `auth/login/page.tsx` | Use `GuestGuard` + unified post-auth |
| MODIFY | `auth/register/page.tsx` | Use `GuestGuard` |
| MODIFY | `auth/verify-account/page.tsx` | Use `usePostAuthRedirect` |
| MODIFY | `onboarding/organization/page.tsx` | Remove cookies, use API-driven routing |
| MODIFY | `tenant/[tenant]/layout.tsx` | Fix HTML, add auth guards |
| MODIFY | `tenant/[tenant]/page.tsx` | Fix redirect logic |
| MODIFY | `components/app-sidebar.tsx` | Dynamic org/user data |
| MODIFY | `api/types.ts` | Add helper types |

---

## Verification Plan

### Automated Tests
```bash
cd apps/web && npx tsc --noEmit
```
TypeScript compilation should pass with zero errors.

### Manual Verification
1. **Email Login Flow:** Login → `/users/me` called → org exists → redirect to `{slug}.uurl.uz/dashboard`
2. **Email Registration Flow:** Register → verify OTP → `/users/me` called → no org → redirect to `/onboarding/organization`
3. **Google OAuth Flow:** Click Google → backend OAuth → callback page → `/users/me` called → route accordingly
4. **Telegram Login Flow:** Telegram widget → `telegramLogin()` → `/users/me` called → route accordingly
5. **Organization Creation:** Create org → refetch `/users/me` → redirect to new org's subdomain
6. **Token Refresh:** Simulate expired access token → automatic refresh → request retried transparently
7. **Session Expiry:** Simulate expired refresh token → redirect to login, no infinite loop
8. **Guest Guard:** Visit `/auth/login` while authenticated → auto-redirect to dashboard
9. **Auth Guard:** Visit `/onboarding/organization` while unauthenticated → redirect to login
10. **Sidebar:** Organization name, user data shown from API. Org switcher navigates to correct subdomain.
