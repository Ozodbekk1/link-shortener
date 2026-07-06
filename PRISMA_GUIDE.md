# Prisma Guide for MongoDB Users

This file explains the Prisma schema features used in this project and compares them with MongoDB-style thinking.

## 1. What Prisma Is

Prisma is an ORM and schema tool for relational databases like PostgreSQL.

In this project, Prisma does three main jobs:

1. Defines your database structure in `schema.prisma`.
2. Generates a type-safe client for querying the database.
3. Helps create migrations so the database stays in sync with the schema.

If you came from MongoDB, think of Prisma schema as being closer to a strongly typed model definition plus migration system.

## 2. Basic Prisma Building Blocks

### `model`

`model` defines a table.

Example:

```prisma
model User {
  id    String @id @default(uuid())
  email String @unique
}
```

MongoDB comparison:

- MongoDB stores documents inside a collection.
- Prisma model maps to a SQL table.

So `User` here is like a `users` collection in MongoDB, but in Prisma it becomes a relational table.

### Field types

Prisma fields use scalar types like:

- `String`
- `Boolean`
- `Int`
- `DateTime`
- `Json`
- `Decimal`

Examples from your schema:

```prisma
name      String
isBot     Boolean
clickedAt DateTime
styleJson Json
amount    Decimal
```

MongoDB comparison:

- `String` maps to string values.
- `Boolean` maps to true/false.
- `DateTime` is like a date field.
- `Json` is similar to a flexible object/document field.

## 3. Field Modifiers and Decorators

These are the most important Prisma schema decorators.

### `@id`

Marks a field as the primary key.

Example:

```prisma
id String @id @default(uuid())
```

MongoDB comparison:

- MongoDB automatically uses `_id` as the primary identifier.
- Prisma lets you declare the primary key explicitly.

### `@default(...)`

Sets a default value when no value is provided.

Examples:

```prisma
createdAt DateTime @default(now())
status    UserStatus @default(PENDING)
active    Boolean @default(true)
```

MongoDB comparison:

- Similar to setting default values in application logic or Mongoose defaults.
- Prisma applies it at the schema/database layer.

### `@unique`

Makes a field unique across all rows.

Example:

```prisma
email String @unique
```

MongoDB comparison:

- Similar to creating a unique index on a field.

### `@map("...")`

Renames a field in the database while keeping a nicer Prisma field name in code.

Example:

```prisma
passwordHash String @map("password_hash")
```

This means:

- Prisma code uses `passwordHash`
- Database column is `password_hash`

MongoDB comparison:

- Similar to manually transforming field names when saving documents.
- MongoDB usually keeps the same field name unless you transform it yourself.

### `@relation(...)`

Defines a relationship between two models.

Example:

```prisma
owner User @relation("OrganizationOwner", fields: [ownerId], references: [id], onDelete: Restrict)
```

This means:

- `ownerId` stores the foreign key
- `owner` is the linked `User` record
- `references: [id]` points to the `User.id` field
- `onDelete: Restrict` prevents deleting the user if the relation is still needed

MongoDB comparison:

- MongoDB usually embeds documents or stores ObjectId references.
- Prisma uses explicit foreign keys and relations.

### Optional fields `?`

If a field can be empty, Prisma uses `?`.

Examples:

```prisma
avatar      String?
campaignId  String?
expiresAt   DateTime?
```

MongoDB comparison:

- Similar to a field being absent or `null`.

### Lists `[]`

An array relation or array of values.

Examples:

```prisma
members OrganizationMember[]
links   Link[]
```

MongoDB comparison:

- Similar to an array field or a list of embedded references.

## 4. Model-Level Decorators

These apply to the whole model, not a single field.

### `@@id([...])`

Defines a composite primary key.

Example:

```prisma
@@id([roleId, permissionId])
```

MongoDB comparison:

- MongoDB usually uses one `_id` per document.
- Composite keys are more of a relational database concept.

### `@@unique([...])`

Creates a unique constraint across multiple fields.

Example:

```prisma
@@unique([organizationId, slug])
```

This means the same slug can exist in different organizations, but not twice inside the same organization.

MongoDB comparison:

- Similar to a compound unique index.

### `@@index([...])`

Creates a database index for faster queries.

Example:

```prisma
@@index([workspaceId])
@@index([linkId, clickedAt])
```

Why it matters:

- Indexes make filtering and sorting faster.
- They matter most on fields you query often.

MongoDB comparison:

- Very similar to MongoDB indexes.
- In MongoDB, you often create indexes manually.
- In Prisma, you declare them in the schema.

### `@@map("...")`

Renames the table name in the database.

Example:

```prisma
@@map("organization_members")
```

This means:

- Prisma model name: `OrganizationMember`
- Database table name: `organization_members`

MongoDB comparison:

- Similar to using a collection name that differs from the model name.

## 5. Relationship Patterns in Your Schema

### One-to-many

Example:

```prisma
model Organization {
  members OrganizationMember[]
}

model OrganizationMember {
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
}
```

Meaning:

- One organization has many members.
- Each member belongs to one organization.

MongoDB comparison:

- Could be embedded members inside organization, or separate collections with references.

### Many-to-many

Example:

```prisma
model RolePermission {
  roleId       String
  permissionId String
}
```

This is a join table.

MongoDB comparison:

- MongoDB often stores arrays of ObjectIds or embedded references.
- In Prisma/PostgreSQL, a join table is the normal relational pattern.

## 6. Examples From Your Project

### User

```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  passwordHash  String   @map("password_hash")
  emailVerified Boolean  @default(false) @map("email_verified")
  createdAt     DateTime @default(now()) @map("created_at")
}
```

What this teaches:

- `@id` makes `id` the primary key.
- `@unique` ensures no two users share the same email.
- `@map` lets you keep camelCase in code and snake_case in the database.

MongoDB version idea:

```js
{
  _id: ObjectId(...),
  email: "a@example.com",
  passwordHash: "...",
  emailVerified: false,
  createdAt: new Date()
}
```

### Link

```prisma
model Link {
  id         String   @id @default(uuid())
  shortSlug  String   @unique @map("short_slug")
  workspaceId String  @map("workspace_id")
  userId     String   @map("user_id")
  status     LinkStatus @default(ACTIVE)
}
```

What this teaches:

- `shortSlug` is unique because every shortened link must be different.
- `workspaceId` and `userId` are foreign keys.
- `status` uses an enum, so the value is limited to allowed choices.

MongoDB version idea:

```js
{
  shortSlug: "abc123",
  workspaceId: "...",
  userId: "...",
  status: "ACTIVE"
}
```

## 7. Prisma Enums

Enums are fixed allowed values.

Example:

```prisma
enum LinkStatus {
  ACTIVE
  DISABLED
  EXPIRED
  ARCHIVED
}
```

This means `status` can only be one of those values.

MongoDB comparison:

- MongoDB does not enforce enums by default.
- You would normally validate allowed values in application code.

## 8. Prisma vs MongoDB Mental Model

### Prisma / PostgreSQL mindset

- Tables are structured.
- Relationships are explicit.
- Types are strict.
- Constraints are enforced by the database.
- Migrations are part of the workflow.

### MongoDB mindset

- Documents are flexible.
- Relationships are often embedded or referenced manually.
- Schema can be looser.
- Validation is often more application-driven.

## 9. Quick Meaning of the Main Decorators

- `@id` = primary key
- `@default(...)` = automatic default value
- `@unique` = unique field
- `@map(...)` = rename field in DB
- `@relation(...)` = foreign-key relationship
- `@@id([...])` = composite primary key
- `@@unique([...])` = multi-field unique rule
- `@@index([...])` = index for performance
- `@@map(...)` = rename table in DB

## 10. Practical Advice

If you are new to Prisma, learn in this order:

1. `model`, field types, and `@id`
2. `@default`, `@unique`, and `@map`
3. `@relation` and foreign keys
4. `@@index`, `@@unique`, and `@@id`
5. Migrations and Prisma Client queries

## 11. What To Remember

Prisma is not just a schema file. It is:

- Your database contract
- Your type generator
- Your migration source
- Your relationship map

If MongoDB feels like flexible JSON documents, Prisma feels like a structured contract for a relational database.

## 12. Next Things To Learn

After this file, the next useful topics are:

1. Prisma Client queries: `findMany`, `create`, `update`, `delete`
2. Relations in queries: `include` and `select`
3. Migrations: `migrate dev`, `db push`, `generate`
4. Transaction handling
