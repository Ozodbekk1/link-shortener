# 🚀 Inks API — Backend (NestJS)

A production-ready URL shortener API built with **NestJS**, **Prisma ORM**, **PostgreSQL**, and **JWT cookie-based authentication**. This API powers [uurl.uz](https://uurl.uz) — a modern link management platform with teams, workspaces, QR codes, redirect rules, and deep analytics.

---

## 📡 Base URL

```
http://localhost:3000/api/v1
```

All endpoints are prefixed with `/api/v1` except:

| Route                   | Method | Purpose                  |
| ----------------------- | ------ | ------------------------ |
| `/r/:slug`              | GET    | Public redirect          |
| `/redirect/:slug`       | GET    | Validate before redirect |
| `/redirect/rules/:slug` | GET    | Preview redirect rules   |

---

## 🧩 Tech Stack

| Layer            | Technology                                                  |
| ---------------- | ----------------------------------------------------------- |
| Framework        | NestJS                                                      |
| ORM              | Prisma (PostgreSQL)                                         |
| Auth             | JWT (access + refresh tokens via httpOnly cookies)          |
| Rate Limiting    | `@nestjs/throttler` (80 req/min default)                    |
| Validation       | `class-validator` + `class-transformer` (whitelist enabled) |
| Logging          | `nestjs-pino` (pretty-printed in dev)                       |
| Docs             | Swagger at `/docs`                                          |
| Password Hashing | bcryptjs                                                    |
| QR Generation    | `qrcode` + `sharp` (with custom styling, gradients, logos)  |

---

## 🔐 Authentication

Auth uses **httpOnly cookies** for secure token storage:

- **`access_token`** — short-lived JWT (default 15 min), sent automatically by browser
- **`refresh_token`** — long-lived JWT (default 7 days), used to rotate sessions

All authenticated endpoints require `@UseGuards(JwtAuthGuard)`. The guard reads the `access_token` cookie.

### Auth Flow

```
        User                    API
         |                       |
         |── POST register ──────|── Create user, send OTP email
         |                       |
         |── POST verify-email ──|── Verify OTP → set httpOnly cookies
         |                       |
         |── POST login ─────────|── Validate credentials → set httpOnly cookies
         |                       |
         |── POST refresh ───────|── Rotate tokens via refresh_token cookie
         |                       |
         |── POST logout ────────|── Clear cookies + revoke refresh token
```

> **Frontend Dev Note:** Since cookies are `httpOnly`, you cannot read them from JavaScript. Use `credentials: 'include'` in `fetch`/`axios` and rely on the `/auth/refresh` endpoint to silently re-authenticate when the access token expires.

---

## 📦 Standard Response Format

All responses are wrapped in a global interceptor:

```json
{
  "success": true,
  "message": "Success",
  "data": { ... }
}
```

> Some endpoints return `data` directly (e.g., `{ "user": {...} }`). Paginated responses include `meta`:
>
> ```json
> {
>   "data": [...],
>   "meta": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 }
> }
> ```

---

## 📋 Module API Reference

---

### 1. 🔑 Auth — JWT (`/api/v1/jwt/auth`)

Rate-limited to **3 requests per minute**.

#### 1.1 Register

Creates a new user account and sends a 6-digit OTP to the provided email.

```
POST /api/v1/jwt/auth/register
```

**Request Body**

```json
{
  "email": "user@example.com",
  "password": "min6chars",
  "name": "John Doe",
  "avatar": "https://..." // optional
}
```

**Response** (201 Created)

- Sets `access_token` + `refresh_token` httpOnly cookies

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": null,
    "emailVerified": false,
    "userRole": "USER",
    "twoFactorEnabled": false,
    "status": "PENDING",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Errors:** `409 Conflict` — Email already registered

---

#### 1.2 Verify Email

Verify the email using the OTP sent during registration.

```
POST /api/v1/jwt/auth/verify-email
```

**Request Body**

```json
{
  "email": "user@example.com",
  "otpCode": "123456"
}
```

**Response** (200 OK)

- Same as Register response, but `emailVerified: true`, `status: "ACTIVE"`
- Sets new httpOnly cookies

**Errors:** `400 Bad Request` — Invalid/expired OTP

---

#### 1.3 Login

Authenticate with email + password.

```
POST /api/v1/jwt/auth/login
```

**Request Body**

```json
{
  "email": "user@example.com",
  "password": "min6chars"
}
```

**Response** (200 OK)

- Sets httpOnly cookies

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    ...
  }
}
```

**Errors:** `401 Unauthorized` — Invalid credentials, email not verified, or account not active

---

#### 1.4 Refresh Token

Silently rotate both tokens via the httpOnly `refresh_token` cookie.

```
POST /api/v1/jwt/auth/refresh
```

**Cookies required:** `refresh_token` (auto-sent)

**Response** (200 OK)

- Sets new `access_token` + `refresh_token` cookies

```json
{
  "user": { ... }
}
```

**Errors:** `401 Unauthorized` — Missing/invalid refresh token

---

#### 1.5 Logout

Revoke the current session and clear cookies.

```
POST /api/v1/jwt/auth/logout
```

**Cookies required:** `refresh_token` (auto-sent)

**Response** (200 OK)

- Clears httpOnly cookies

```json
{
  "status": "logout"
}
```

---

#### 1.6 Forgot Password

Send a password reset OTP to the user's email.

```
POST /api/v1/jwt/auth/forgot-password
```

**Request Body**

```json
{
  "email": "user@example.com"
}
```

**Response** (201 Created)

```json
{
  "message": "OTP sent successfully"
}
```

---

#### 1.7 Reset Password

Reset password using the OTP from forgot-password flow.

```
POST /api/v1/jwt/auth/reset-password
```

**Request Body**

```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newPassword123"
}
```

**Response** (201 Created)

```json
{
  "message": "Password reset successfully"
}
```

**Errors:** `400 Bad Request` — Invalid/expired OTP

---

#### 1.8 Get Current User (JWT)

Returns the authenticated user's public profile.

```
GET /api/v1/jwt/auth/me
```

**Auth:** JwtAuthGuard + RolesGuard (requires `USER` role)

**Response** (200 OK)

```json
{
  "user": { ... public user fields ... }
}
```

---

### 2. 🔑 Auth — Google OAuth (`/api/v1/google/auth`)

Rate-limited to **3 requests per minute**.

#### 2.1 Initiate Google Login

Redirects user to Google's OAuth consent screen.

```
GET /api/v1/google/auth
```

**No body required** — browser redirect handled by Passport.js

---

#### 2.2 Google OAuth Callback

Google redirects here after consent.

```
GET /api/v1/google/auth/callback
```

**Response** (302 Redirect — dashboard URL)

- Sets httpOnly cookies on redirect

```json
{
  "url": "http://localhost:3000/dashboard",
  "statusCode": 302
}
```

**Behavior:**

- If user exists → updates avatar/name
- If user is new → creates account with `emailVerified: true`, `status: ACTIVE` (password auto-generated with bypass secret)

---

### 3. 🔑 Auth — Telegram (`/api/v1/telegram/auth`)

Rate-limited to **3 requests per minute**.

#### 3.1 Login with Telegram

Validates Telegram login widget data and creates/authenticates the user.

```
POST /api/v1/telegram/auth/login
```

**Request Body**

```json
{
  "hash": "abc123...",
  "auth_date": "1700000000",
  "id": "123456789",
  "first_name": "John",
  "last_name": "Doe",
  "photo_url": "https://t.me/i/userpic/...",
  "phone_number": "+998901234567"
}
```

**Response** (200 OK)

- Sets httpOnly cookies

```json
{
  "user": { ... public user fields ... }
}
```

**Validation:**

- HMAC-SHA256 signature verification using bot token
- Auth data must be < 24 hours old
- Creates user with synthetic email `tg-{id}@uurl.tg.auth`

---

### 4. 👤 Users (`/api/v1/users`)

#### 4.1 List All Users (Admin only)

```
GET /api/v1/users?page=1&limit=20
```

**Auth:** JwtAuthGuard + RolesGuard (`ADMIN` role required)

**Query Params**

| Param   | Type   | Default | Description    |
| ------- | ------ | ------- | -------------- |
| `page`  | number | 1       | Page number    |
| `limit` | number | 20      | Items per page |

**Response** (200 OK)

```json
{
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "googleId": null,
      "phone_number": null,
      "name": "John Doe",
      "avatar": null,
      "emailVerified": true,
      "twoFactorEnabled": false,
      "status": "ACTIVE",
      "userRole": "USER",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z",
      "ownedOrganizations": [...],
      "memberships": [...],
      "teamMemberships": [...],
      "links": [...],
      "notifications": [...]
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

---

#### 4.2 Get User by ID

```
GET /api/v1/users/id/:id
```

**Auth:** JwtAuthGuard

**Path Params**

| Param | Type | Description |
| ----- | ---- | ----------- |
| `id`  | uuid | User ID     |

**Response** (200 OK) — Same shape as user object above.

**Errors:** `404 Not Found`

---

#### 4.3 Get My Profile (Full)

Returns the authenticated user's **complete** profile with all related entities nested.

```
GET /api/v1/users/me
```

**Auth:** JwtAuthGuard

**Response** (200 OK)

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "googleId": null,
    "phone_number": null,
    "name": "John Doe",
    "avatar": null,
    "emailVerified": true,
    "twoFactorEnabled": false,
    "status": "ACTIVE",
    "userRole": "USER",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z",

    "ownedOrganizations": [
      {
        "id": "uuid",
        "name": "My Org",
        "slug": "my-org",
        "ownerId": "uuid",
        "createdAt": "...",
        "workspaces": [
          {
            "id": "uuid",
            "name": "personal",
            "slug": "personal",
            "teams": [...],
            "domains": [...],
            "_count": { "links": 10 }
          }
        ],
        "members": [
          {
            "id": "uuid",
            "role": "OWNER",
            "user": { "id": "uuid", "name": "...", "email": "...", "avatar": null }
          }
        ],
        "_count": { "members": 2, "workspaces": 1 }
      }
    ],

    "memberships": [
      {
        "organization": { "id": "uuid", "name": "...", "slug": "...", "ownerId": "uuid" }
      }
    ],

    "teamMemberships": [
      {
        "team": {
          "id": "uuid",
          "name": "Engineering",
          "workspace": { "id": "uuid", "name": "...", "slug": "...", "organizationId": "uuid" }
        }
      }
    ],

    "links": [
      {
        "id": "uuid",
        "title": "My Link",
        "originalUrl": "https://...",
        "shortSlug": "abc1234",
        "status": "ACTIVE",
        "tags": [{ "id": "uuid", "tag": "promo" }],
        "redirectRules": [...],
        "qrCodes": [{ "id": "uuid", "imageUrl": "data:image/png;base64,...", "styleJson": {...}, "createdAt": "..." }],
        "_count": { "clicks": 50, "qrCodes": 1 },
        "createdAt": "..."
      }
    ],

    "notifications": [
      {
        "id": "uuid",
        "type": "INFO",
        "message": "Welcome!",
        "read": false,
        "createdAt": "..."
      }
    ]
  }
}
```

---

### 5. 🏢 Organizations (`/api/v1/organizations`)

#### 5.1 Create Organization

Rate-limited to **3 requests per minute**.

```
POST /api/v1/organizations
```

**Auth:** JwtAuthGuard

**Request Body**

```json
{
  "name": "My Company",
  "slug": "mycompany"
}
```

| Field  | Rules                                                                                                  |
| ------ | ------------------------------------------------------------------------------------------------------ |
| `name` | Required, non-empty                                                                                    |
| `slug` | Required, 3-25 chars, lowercase letters + numbers only (`^[a-z0-9]+$`), must not be a reserved keyword |

**Response** (201 Created)

```json
{
  "id": "uuid",
  "name": "My Company",
  "slug": "mycompany",
  "ownerId": "uuid",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

**Auto-creation:** A default workspace named `"personal"` is automatically created for the organization.

**Errors:** `400 Bad Request` — Reserved slug / invalid format. `409 Conflict` — Slug taken.

---

#### 5.2 List My Organizations

```
GET /api/v1/organizations
```

**Auth:** JwtAuthGuard

**Response** (200 OK)

```json
{
  "organizations": [
    {
      "id": "uuid",
      "name": "My Company",
      "slug": "mycompany",
      "subdomain": "mycompany.uurl.uz",
      "role": "OWNER",
      "joinedAt": "2025-01-01T00:00:00.000Z",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "memberCount": 5,
      "workspaceCount": 3
    }
  ]
}
```

---

#### 5.3 Get Organization by ID

```
GET /api/v1/organizations/:organizationId
```

**Auth:** JwtAuthGuard

**Path Params**

| Param            | Type |
| ---------------- | ---- |
| `organizationId` | uuid |

**Response** (200 OK)

```json
{
  "id": "uuid",
  "name": "My Company",
  "slug": "mycompany",
  "subdomain": "mycompany.uurl.uz",
  "role": "OWNER",
  "joinedAt": "2025-01-01T00:00:00.000Z",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "owner": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": null
  },
  "statistics": {
    "members": 5,
    "workspaces": 3,
    "roles": 2
  }
}
```

**Errors:** `403 Forbidden` — You are not a member.

---

#### 5.4 Get Organization Members

```
GET /api/v1/organizations/:organizationId/members?page=1&limit=20
```

**Auth:** JwtAuthGuard

**Query Params**

| Param   | Type   | Default |
| ------- | ------ | ------- |
| `page`  | number | 1       |
| `limit` | number | 20      |

**Response** (200 OK)

```json
{
  "members": [
    {
      "id": "uuid",
      "role": "OWNER",
      "joinedAt": "2025-01-01T00:00:00.000Z",
      "user": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "avatar": null,
        "status": "ACTIVE",
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "hasNext": false,
    "hasPrevious": false
  }
}
```

---

#### 5.5 Delete Organization

```
DELETE /api/v1/organizations/:organizationId
```

**Auth:** JwtAuthGuard

**Access:** Only `OWNER` can delete.

**Response** (200 OK)

```json
{
  "message": "Organization deleted successfully."
}
```

---

### 6. 📂 Workspaces (`/api/v1/organizations/:orgId/workspaces`)

#### 6.1 Create Workspace

```
POST /api/v1/organizations/:organizationId/workspaces
```

**Auth:** JwtAuthGuard

**Access:** `OWNER` or `ADMIN` of the organization.

**Path Params**

| Param            | Type |
| ---------------- | ---- |
| `organizationId` | uuid |

**Request Body**

```json
{
  "name": "Marketing"
}
```

| Field  | Rules                |
| ------ | -------------------- |
| `name` | Required, 3-20 chars |

Slug is auto-generated from name.

**Response** (201 Created)

```json
{
  "id": "uuid",
  "name": "Marketing",
  "slug": "marketing",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

---

#### 6.2 List Organization Workspaces

```
GET /api/v1/organizations/:organizationId/workspaces?page=1&limit=20
```

**Auth:** JwtAuthGuard

**Response** (200 OK)

```json
{
  "workspaces": [
    {
      "id": "uuid",
      "name": "Marketing",
      "slug": "marketing",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "statistics": {
        "teams": 2,
        "links": 15,
        "campaigns": 3,
        "domains": 1
      }
    }
  ],
  "pagination": {
    "total": 3,
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "hasNext": false,
    "hasPrevious": false
  }
}
```

---

#### 6.3 Get Workspace

```
GET /api/v1/organizations/:organizationId/workspaces/:workspaceId
```

**Auth:** JwtAuthGuard

**Response** (200 OK)

```json
{
  "id": "uuid",
  "name": "Marketing",
  "slug": "marketing",
  "organization": { "id": "uuid", "name": "My Company", "slug": "mycompany" },
  "createdAt": "2025-01-01T00:00:00.000Z",
  "statistics": {
    "teams": 2,
    "links": 15,
    "campaigns": 3,
    "domains": 1,
    "webhooks": 0
  }
}
```

---

#### 6.4 Delete Workspace

```
DELETE /api/v1/organizations/:organizationId/workspaces/:workspaceId
```

**Auth:** JwtAuthGuard

**Access:** `OWNER` or `ADMIN` of the organization.

**Response** (200 OK)

```json
{
  "message": "Workspace deleted successfully",
  "workspace": { "id": "uuid", "name": "Marketing" }
}
```

---

### 7. 👥 Teams (`/api/v1/workspaces/:workspaceId/teams`)

All routes protected by `JwtAuthGuard` + `WorkspaceMemberGuard` (must be org member).

#### 7.1 Create Team

```
POST /api/v1/workspaces/:workspaceId/teams
```

**Request Body**

```json
{
  "name": "Engineering"
}
```

| Field  | Rules                                                 |
| ------ | ----------------------------------------------------- |
| `name` | Required, 3-20 chars, must be unique within workspace |

**Response** (201 Created)

```json
{
  "id": "uuid",
  "workspaceId": "uuid",
  "name": "Engineering",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "members": [
    {
      "id": "uuid",
      "role": "OWNER",
      "userId": "uuid",
      "teamId": "uuid",
      "user": { "id": "uuid", "name": "...", "email": "..." }
    }
  ]
}
```

> The creator is automatically added as `OWNER` of the team.

---

#### 7.2 List Teams

```
GET /api/v1/workspaces/:workspaceId/teams?page=1&limit=10&search=eng
```

**Query Params**

| Param    | Type   | Default | Description                  |
| -------- | ------ | ------- | ---------------------------- |
| `page`   | number | 1       |                              |
| `limit`  | number | 10      |                              |
| `search` | string | —       | Case-insensitive name search |

**Response** (200 OK)

```json
{
  "data": [
    {
      "id": "uuid",
      "workspaceId": "uuid",
      "name": "Engineering",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "_count": { "members": 5 }
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 3, "totalPages": 1 }
}
```

---

#### 7.3 Get Team

```
GET /api/v1/workspaces/:workspaceId/teams/:teamId
```

**Response** (200 OK)

```json
{
  "id": "uuid",
  "workspaceId": "uuid",
  "name": "Engineering",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "workspace": { "id": "uuid", "name": "Marketing", "slug": "marketing" },
  "members": [
    {
      "id": "uuid",
      "role": "OWNER",
      "userId": "uuid",
      "user": { "id": "uuid", "name": "John", "email": "...", "avatar": null }
    }
  ]
}
```

---

### 8. 🧑‍🤝‍🧑 Team Members (`/api/v1/teams/:teamId/members`)

#### 8.1 Add Member

```
POST /api/v1/teams/:teamId/members
```

**Auth:** JwtAuthGuard

**Request Body**

```json
{
  "userId": "uuid",
  "role": "MEMBER"
}
```

| Field    | Rules                                                                        |
| -------- | ---------------------------------------------------------------------------- |
| `userId` | Required, valid UUID                                                         |
| `role`   | Optional, defaults to `MEMBER`. Values: `OWNER`, `ADMIN`, `MEMBER`, `VIEWER` |

**Auto-provisioning:** If the user is not already a member of the parent organization, they are automatically added with `MEMBER` role.

**Response** (201 Created)

```json
{
  "id": "uuid",
  "teamId": "uuid",
  "userId": "uuid",
  "role": "MEMBER",
  "user": { "id": "uuid", "name": "John", "email": "...", "avatar": null }
}
```

**Errors:** `409 Conflict` — User is already a member.

---

#### 8.2 List Team Members

```
GET /api/v1/teams/:teamId/members
```

**Auth:** JwtAuthGuard

**Response** (200 OK)

```json
[
  {
    "id": "uuid",
    "teamId": "uuid",
    "userId": "uuid",
    "role": "OWNER",
    "user": { "id": "uuid", "name": "...", "email": "...", "avatar": null }
  }
]
```

---

#### 8.3 Update Member Role

```
PATCH /api/v1/teams/:teamId/members/:memberId
```

**Auth:** JwtAuthGuard

**Request Body**

```json
{
  "role": "ADMIN"
}
```

| Field  | Rules                                                 |
| ------ | ----------------------------------------------------- |
| `role` | Required. Must not remove the sole `OWNER` of a team. |

**Response** (200 OK) — Updated member object.

---

#### 8.4 Remove Member

```
DELETE /api/v1/teams/:teamId/members/:memberId
```

**Auth:** JwtAuthGuard

**Prevents:** Removing the sole `OWNER` of a team.

**Response** (200 OK) — Deleted member object.

---

### 9. 🔗 Links (`/api/v1/:workspaceId/links`)

#### 9.1 Create Link

```
POST /api/v1/:workspaceId/links
```

**Auth:** JwtAuthGuard

**Path Params**

| Param         | Type |
| ------------- | ---- |
| `workspaceId` | uuid |

**Request Body**

```json
{
  "originalUrl": "https://example.com/very/long/url",
  "shortSlug": "custom-slug",
  "title": "My Link",
  "campaignId": "uuid",
  "customDomain": "links.mycompany.com",
  "clickLimit": 1000,
  "expiresAt": "2026-01-01T00:00:00.000Z",
  "passwordProtected": true,
  "password": "secret123",
  "tags": ["promo", "summer"],
  "redirectRules": [
    {
      "type": "COUNTRY",
      "value": "UZ",
      "destinationUrl": "https://uz.example.com"
    },
    {
      "type": "DEVICE",
      "value": "mobile",
      "destinationUrl": "https://m.example.com"
    },
    {
      "type": "LANGUAGE",
      "value": "ru",
      "destinationUrl": "https://ru.example.com"
    },
    {
      "type": "OS",
      "value": "iOS",
      "destinationUrl": "https://ios.example.com"
    }
  ]
}
```

**Field Rules**

| Field               | Validation                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| `originalUrl`       | Required, valid URL                                                                               |
| `shortSlug`         | Optional (auto-generated 7-char nanoid if not provided), only letters/numbers/hyphens/underscores |
| `title`             | Optional                                                                                          |
| `campaignId`        | Optional, valid UUID                                                                              |
| `customDomain`      | Optional                                                                                          |
| `clickLimit`        | Optional, integer >= 1                                                                            |
| `expiresAt`         | Optional, ISO date                                                                                |
| `passwordProtected` | Optional, boolean (default false)                                                                 |
| `password`          | Required if `passwordProtected` is true                                                           |
| `tags`              | Optional, array of strings                                                                        |
| `redirectRules`     | Optional, array of objects with `type` (COUNTRY/DEVICE/LANGUAGE/OS), `value`, `destinationUrl`    |

**Response** (201 Created)

```json
{
  "id": "uuid",
  "userId": "uuid",
  "workspaceId": "uuid",
  "campaignId": null,
  "title": "My Link",
  "originalUrl": "https://example.com/very/long/url",
  "shortSlug": "custom-slug",
  "customDomain": null,
  "status": "ACTIVE",
  "clickLimit": 1000,
  "expiresAt": "2026-01-01T00:00:00.000Z",
  "passwordProtected": true,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "tags": [{ "id": "uuid", "linkId": "uuid", "tag": "promo" }],
  "redirectRules": [
    {
      "id": "uuid",
      "linkId": "uuid",
      "type": "COUNTRY",
      "value": "UZ",
      "destinationUrl": "https://uz.example.com"
    }
  ]
}
```

---

#### 9.2 List Links

```
GET /api/v1/:workspaceId/links?page=1&limit=10&search=example&status=ACTIVE&campaignId=uuid&tag=promo
```

**Auth:** JwtAuthGuard

**Query Params**

| Param        | Type   | Default | Description                                 |
| ------------ | ------ | ------- | ------------------------------------------- |
| `page`       | number | 1       |                                             |
| `limit`      | number | 10      |                                             |
| `search`     | string | —       | Searches title, originalUrl, shortSlug      |
| `status`     | enum   | —       | `ACTIVE`, `DISABLED`, `EXPIRED`, `ARCHIVED` |
| `campaignId` | uuid   | —       | Filter by campaign                          |
| `tag`        | string | —       | Filter by exact tag                         |

**Response** (200 OK)

```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "workspaceId": "uuid",
      "title": "My Link",
      "originalUrl": "https://...",
      "shortSlug": "abc1234",
      "status": "ACTIVE",
      "createdAt": "...",
      "tags": [...],
      "redirectRules": [...],
      "_count": { "clicks": 50 }
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 100, "totalPages": 10 }
}
```

---

#### 9.3 Get Link

```
GET /api/v1/:workspaceId/links/:id
```

**Auth:** JwtAuthGuard

**Response** (200 OK) — Full link with tags, redirectRules, qrCodes, click count.

---

#### 9.4 Update Link

```
PATCH /api/v1/:workspaceId/links/:id
```

**Auth:** JwtAuthGuard

**Request Body**

All fields optional (partial update via `PartialType`). Same shape as Create, plus:

```json
{
  "status": "DISABLED" // LinkStatus enum values: ACTIVE, DISABLED, EXPIRED, ARCHIVED
}
```

**Response** (200 OK) — Updated link with tags and redirectRules.

---

#### 9.5 Delete Link

```
DELETE /api/v1/:workspaceId/links/:id
```

**Auth:** JwtAuthGuard

**Response** (204 No Content)

---

#### 9.6 Find Link by Slug (Public)

```
GET /api/v1/links/slug/:slug
```

**No Auth required.** Returns link metadata with status/expiry validation.

**Response** (200 OK)

```json
{
  "id": "uuid",
  "title": "My Link",
  "originalUrl": "https://...",
  "shortSlug": "abc1234",
  "status": "ACTIVE",
  "redirectRules": [...]
}
```

**Errors:** `404 Not Found`, `400 Bad Request` — Link inactive or expired.

---

### 10. 📊 Link Analytics (`/api/v1/:workspaceId/links/analytics`)

#### 10.1 Analytics Overview

```
GET /api/v1/:workspaceId/links/analytics/overview
```

**Auth:** JwtAuthGuard

**Response** (200 OK)

```json
{
  "totalLinks": 50,
  "activeLinks": 45,
  "totalClicks": 10000,
  "clicksToday": 234,
  "uniqueVisitorsLast30Days": 420
}
```

---

#### 10.2 Realtime Analytics

```
GET /api/v1/:workspaceId/links/analytics/realtime
```

**Auth:** JwtAuthGuard

**Response** (200 OK)

```json
[
  {
    "linkId": "uuid",
    "shortSlug": "abc1234",
    "title": "My Link",
    "originalUrl": "https://...",
    "activeVisitors": 3,
    "lastUpdated": "2025-01-01T12:00:00.000Z"
  }
]
```

---

#### 10.3 Country Analytics

```
GET /api/v1/:workspaceId/links/analytics/countries
```

**Auth:** JwtAuthGuard

**Response** (200 OK)

```json
[
  { "country": "UZ", "clicks": 5000 },
  { "country": "US", "clicks": 2500 }
]
```

---

#### 10.4 Device Analytics

```
GET /api/v1/:workspaceId/links/analytics/devices
```

**Auth:** JwtAuthGuard

**Response** (200 OK)

```json
{
  "devices": [{ "device": "mobile", "clicks": 6000 }],
  "os": [{ "os": "iOS", "clicks": 3000 }],
  "browsers": [{ "browser": "Chrome", "clicks": 7000 }]
}
```

---

#### 10.5 Single Link Analytics

```
GET /api/v1/:workspaceId/links/:id/analytics
```

**Auth:** JwtAuthGuard

**Response** (200 OK)

```json
{
  "link": {
    "id": "uuid",
    "shortSlug": "abc1234",
    "title": "My Link",
    "originalUrl": "https://..."
  },
  "totalClicks": 500,
  "clicksToday": 12,
  "clicksLast7Days": 89,
  "uniqueVisitors": 320,
  "countries": [{ "country": "UZ", "clicks": 300 }],
  "devices": [{ "device": "mobile", "clicks": 350 }],
  "daily": [
    { "day": "2025-01-01T00:00:00.000Z", "totalClicks": 45, "uniqueClicks": 30 }
  ],
  "activeVisitors": 2
}
```

---

### 11. 🔀 Redirect (Root-level, no prefix)

#### 11.1 Redirect (302)

```
GET /r/:slug?password=secret123
```

**No Auth required.** This is the core redirect endpoint.

**Query Params**

| Param      | Type   | Description                            |
| ---------- | ------ | -------------------------------------- |
| `password` | string | Required if link is password-protected |

**Behavior:**

1. Looks up link by `shortSlug`
2. Validates status (must be `ACTIVE`), expiry, click limit
3. Checks password if protected
4. Evaluates redirect rules (COUNTRY/DEVICE/LANGUAGE/OS) against request context
5. Records click analytics (IP, device, browser, OS, referrer, language)
6. Returns **HTTP 302 redirect** to destination URL

**Errors:** `404 Not Found`, `400 Bad Request`, `401 Unauthorized`

---

#### 11.2 Validate Redirect

```
GET /redirect/:slug?password=secret123
```

**No Auth required.** Returns link validation info without actually redirecting.

**Response** (200 OK)

```json
{
  "slug": "abc1234",
  "title": "My Link",
  "originalUrl": "https://...",
  "customDomain": null,
  "shortUrl": "http://localhost:3000/r/abc1234",
  "status": "ACTIVE",
  "isExpired": false,
  "isPasswordProtected": false,
  "clickLimit": 1000,
  "currentClicks": 50,
  "totalClicks": 50,
  "redirectRules": [
    {
      "type": "COUNTRY",
      "value": "UZ",
      "destinationUrl": "https://uz.example.com"
    }
  ]
}
```

---

#### 11.3 Preview Redirect Rules

```
GET /redirect/rules/:slug?password=secret123
```

**No Auth required.** Shows which rule would match for the current request.

**Response** (200 OK)

```json
{
  "slug": "abc1234",
  "title": "My Link",
  "originalUrl": "https://fallback.example.com",
  "fallbackUrl": "https://fallback.example.com",
  "context": {
    "userAgent": "Mozilla/5.0 ...",
    "device": "desktop",
    "browser": "Chrome",
    "os": "macOS",
    "language": "en-US",
    "ip": "::1"
  },
  "rules": [
    {
      "ruleType": "COUNTRY",
      "ruleValue": "UZ",
      "destinationUrl": "https://uz.example.com",
      "matched": false,
      "reason": "Country 'unknown' does not match 'UZ'"
    }
  ],
  "matchedRule": null,
  "finalDestinationUrl": "https://fallback.example.com"
}
```

---

### 12. 🎭 Roles (`/api/v1/roles`)

#### 12.1 Create Role

```
POST /api/v1/roles/create
```

**Auth:** JwtAuthGuard

**Request Body**

```json
{
  "name": "Editor",
  "description": "Can edit links",
  "organizationId": "uuid",
  "permissionIds": ["uuid1", "uuid2"]
}
```

**Response** (201 Created) — Role object with permissions included.

---

#### 12.2 List Roles

```
GET /api/v1/roles?organizationId=uuid
```

**Auth:** JwtAuthGuard

**Query Params**

| Param            | Type | Description            |
| ---------------- | ---- | ---------------------- |
| `organizationId` | uuid | Filter by organization |

**Response** (200 OK) — Array of roles with permissions.

---

#### 12.3 Update Role

```
PATCH /api/v1/roles/update/:id
```

**Auth:** JwtAuthGuard

**Request Body** — Partial update (name, description, permissionIds)

**Note:** If `permissionIds` is provided, all existing permissions are replaced.

---

#### 12.4 Delete Role

```
DELETE /api/v1/roles/delete/:id
```

**Auth:** JwtAuthGuard

**Response** (200 OK)

---

#### 12.5 Assign Role to User

```
POST /api/v1/roles/assign
```

**Auth:** JwtAuthGuard

**Request Body**

```json
{
  "userId": "uuid",
  "roleId": "uuid",
  "organizationId": "uuid"
}
```

**Response** (200 OK)

---

### 13. 🔐 Permissions (`/api/v1/permissions`)

Protected by `JwtAuthGuard` + `PermissionsGuard` with specific permission requirements.

#### 13.1 Create Permission

```
POST /api/v1/permissions
```

**Auth:** JwtAuthGuard + PermissionsGuard (requires `create:workspaces`)

**Request Body**

```json
{
  "action": "create",
  "resource": "links"
}
```

**Response** (201 Created)

```json
{
  "id": "uuid",
  "action": "create",
  "resource": "links"
}
```

---

#### 13.2 List Permissions

```
GET /api/v1/permissions
```

**Auth:** JwtAuthGuard + PermissionsGuard (requires `read:workspaces`)

---

#### 13.3 Get Permission

```
GET /api/v1/permissions/:id
```

---

#### 13.4 Update Permission

```
PATCH /api/v1/permissions/:id
```

**Request Body**

```json
{
  "action": "update",
  "resource": "links"
}
```

---

#### 13.5 Delete Permission

```
DELETE /api/v1/permissions/:id
```

---

### 14. 📱 QR Codes (`/api/v1/:workspaceId/qr`)

#### 14.1 Generate QR Code

```
POST /api/v1/:workspaceId/qr
```

**Auth:** JwtAuthGuard

**Request Body**

```json
{
  "linkId": "uuid",
  "foregroundColor": "#000000",
  "backgroundColor": "#ffffff",
  "size": 400,
  "margin": 2,
  "logoUrl": "https://example.com/logo.png",
  "logoSize": 0.2,
  "dotStyle": "square",
  "cornerStyle": "rounded",
  "gradientStart": "#ff0000",
  "gradientEnd": "#0000ff",
  "gradientDirection": "diagonal"
}
```

**Field Rules**

| Field               | Type                                   | Default      | Description                        |
| ------------------- | -------------------------------------- | ------------ | ---------------------------------- |
| `linkId`            | uuid (required)                        | —            | Link to associate QR with          |
| `foregroundColor`   | hex string                             | `#000000`    | QR code color                      |
| `backgroundColor`   | hex string                             | `#ffffff`    | Background color                   |
| `size`              | number (100-2000)                      | 400          | Image size in pixels               |
| `margin`            | number (0-10)                          | 2            | QR margin                          |
| `logoUrl`           | string                                 | —            | URL or data URI of logo to overlay |
| `logoSize`          | number (0.05-0.5)                      | 0.2          | Logo size as fraction of QR size   |
| `dotStyle`          | `square` / `dot` / `rounded`           | `square`     | Data module style                  |
| `cornerStyle`       | `square` / `dot` / `rounded`           | `square`     | Finder pattern style               |
| `gradientStart`     | hex string                             | —            | Start gradient color               |
| `gradientEnd`       | hex string                             | —            | End gradient color                 |
| `gradientDirection` | `horizontal` / `vertical` / `diagonal` | `horizontal` | Gradient direction                 |

**Response** (201 Created)

```json
{
  "qrCode": {
    "id": "uuid",
    "linkId": "uuid",
    "imageUrl": "data:image/png;base64,...",
    "styleJson": {...},
    "createdAt": "2025-01-01T00:00:00.000Z",
    "link": {
      "id": "uuid",
      "shortSlug": "abc1234",
      "title": "My Link",
      "originalUrl": "https://..."
    }
  },
  "imageUrl": "data:image/png;base64,..."
}
```

---

#### 14.2 List QR Codes

```
GET /api/v1/:workspaceId/qr?linkId=uuid&page=1&limit=20
```

**Auth:** JwtAuthGuard

**Query Params**

| Param    | Type   | Default | Description    |
| -------- | ------ | ------- | -------------- |
| `linkId` | uuid   | —       | Filter by link |
| `page`   | number | 1       |                |
| `limit`  | number | 20      |                |

---

#### 14.3 Get QR Code

```
GET /api/v1/:workspaceId/qr/:id
```

**Auth:** JwtAuthGuard

**Response** (200 OK) — QR code object with link info.

---

#### 14.4 Get QR Image (PNG)

```
GET /api/v1/:workspaceId/qr/:id/image
```

**No Auth required.** Returns raw PNG image.

**Response Headers:**

```
Content-Type: image/png
Cache-Control: public, max-age=3600
```

---

#### 14.5 Download QR Code

```
GET /api/v1/:workspaceId/qr/:id/download
```

**No Auth required.** Returns PNG with `Content-Disposition: attachment`.

---

#### 14.6 Update QR Code

```
PATCH /api/v1/:workspaceId/qr/:id
```

**Auth:** JwtAuthGuard

**Request Body** — Same style fields as Generate (except `linkId`). Regenerates the image.

---

#### 14.7 Delete QR Code

```
DELETE /api/v1/:workspaceId/qr/:id
```

**Auth:** JwtAuthGuard

**Response** (200 OK)

```json
{ "message": "QR code deleted successfully" }
```

---

### 15. 🛡️ Admin (`/api/v1/admin`)

All admin endpoints require `JwtAuthGuard` + `RolesGuard` with `ADMIN` role.

#### 15.1 Dashboard Overview

```
GET /api/v1/admin/dashboard/overview
```

**Response** (200 OK)

```json
{
  "users": {
    "total": 1000,
    "today": 10,
    "thisMonth": 150,
    "byStatus": { "pending": 20, "active": 950, "suspended": 30 }
  },
  "links": {
    "total": 5000,
    "today": 50,
    "thisMonth": 800,
    "byStatus": { "active": 4500, "disabled": 500 }
  },
  "clicks": {
    "total": 100000,
    "today": 500,
    "thisMonth": 15000
  },
  "organizations": { "total": 200 },
  "workspaces": { "total": 500 },
  "qrCodes": { "total": 1000 }
}
```

---

#### 15.2 Daily Stats

```
GET /api/v1/admin/dashboard/daily-stats?days=30
```

**Query Params**

| Param  | Type   | Default |
| ------ | ------ | ------- |
| `days` | number | 30      |

**Response** (200 OK)

```json
{
  "days": 30,
  "startDate": "...",
  "endDate": "...",
  "data": [
    { "date": "2025-01-01", "newUsers": 5, "newLinks": 20, "clicks": 500 }
  ]
}
```

---

#### 15.3 List Users (Admin)

```
GET /api/v1/admin/users?page=1&limit=20&search=john&status=ACTIVE
```

**Query Params**

| Param    | Type   | Description                                 |
| -------- | ------ | ------------------------------------------- |
| `search` | string | Searches name + email                       |
| `status` | enum   | `PENDING`, `ACTIVE`, `SUSPENDED`, `DELETED` |

---

#### 15.4 Update User Status

```
PATCH /api/v1/admin/users/:id/status?status=SUSPENDED
```

**Query Params**

| Param    | Type            | Required |
| -------- | --------------- | -------- |
| `status` | UserStatus enum | Yes      |

---

#### 15.5 List Links (Admin)

```
GET /api/v1/admin/links?page=1&limit=20&search=example
```

---

#### 15.6 List Organizations (Admin)

```
GET /api/v1/admin/organizations?page=1&limit=20
```

---

#### 15.7 Top Links

```
GET /api/v1/admin/analytics/top-links?limit=10
```

Returns links ranked by total clicks.

---

#### 15.8 Device Analytics (Admin)

```
GET /api/v1/admin/analytics/devices
```

Returns grouped analytics by device, browser, OS, and country.

```json
{
  "devices": [{ "type": "mobile", "clicks": 60000 }],
  "browsers": [{ "name": "Chrome", "clicks": 70000 }],
  "operatingSystems": [{ "name": "iOS", "clicks": 35000 }],
  "countries": [{ "country": "UZ", "clicks": 50000 }]
}
```

---

## ⚠️ Common Error Codes

| Status | Code                    | Description                                                  |
| ------ | ----------------------- | ------------------------------------------------------------ |
| 400    | `BadRequestException`   | Validation failed, link expired, invalid OTP                 |
| 401    | `UnauthorizedException` | Missing/invalid auth, wrong password                         |
| 403    | `ForbiddenException`    | Insufficient permissions/role                                |
| 404    | `NotFoundException`     | Resource not found                                           |
| 409    | `ConflictException`     | Duplicate slug, email, membership, etc.                      |
| 429    | `ThrottlerException`    | Rate limit exceeded (80 req/min default, 3 req/min for auth) |

---

## 🧪 Environment Variables

| Variable                                                            | Description                        | Default                    |
| ------------------------------------------------------------------- | ---------------------------------- | -------------------------- |
| `PORT`                                                              | Server port                        | 8080                       |
| `DATABASE_URL`                                                      | PostgreSQL connection string       | —                          |
| `JWT_SECRET`                                                        | Fallback JWT secret (min 32 chars) | —                          |
| `JWT_ACCESS_SECRET`                                                 | Access token secret                | falls back to `JWT_SECRET` |
| `JWT_REFRESH_SECRET`                                                | Refresh token secret               | falls back to `JWT_SECRET` |
| `ACCESS_TOKEN_EXPIRY`                                               | Access token TTL                   | `15m`                      |
| `REFRESH_TOKEN_EXPIRY`                                              | Refresh token TTL                  | `7d`                       |
| `WEB_ORIGIN`                                                        | CORS origin(s) (comma-separated)   | —                          |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS`               | Email config                       | —                          |
| `TELEGRAM_BOT_TOKEN`                                                | Telegram bot token                 | —                          |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_CALLBACK_URL` | Google OAuth                       | —                          |

---

## 🚀 Running the API

```bash
# Install dependencies
yarn install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start development server (http://localhost:3000)
yarn run start:dev

# Swagger docs
open http://localhost:3000/docs
```
