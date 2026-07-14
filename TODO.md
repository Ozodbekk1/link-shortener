# TODO

## Google OAuth integration finish

- [ ] Update `google.service.ts` to issue JWT cookies using existing `JwtService.issueSession()` after `googleLogin()`.
- [ ] Update `google.controller.ts` to use existing `CookieService.setAuthCookies()` and fix missing `Response` import.
- [ ] Update `google.module.ts` to register `GoogleStrategy` provider.
- [ ] Quick sanity check by running API build/start and hitting `/google/auth`.
