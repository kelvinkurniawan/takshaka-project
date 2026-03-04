# NextCMS: Cloudflare → Supabase + Vercel Migration Guide

## ✅ Refactoring Complete!

This document summarizes the complete refactoring of NextCMS from Cloudflare D1 + Workers to Supabase PostgreSQL + Vercel.

## Changes Summary

### 1. **Database Migration: SQLite → PostgreSQL**

#### Before (Cloudflare D1 - SQLite)

- Database: SQLite with Cloudflare D1
- Connection: Via Cloudflare `env.DB` binding
- Driver: `drizzle-orm/d1`

#### After (Supabase - PostgreSQL)

- Database: PostgreSQL via Supabase
- Connection: `DATABASE_URL` environment variable
- Driver: `drizzle-orm/postgres-js`

### 2. **Dependencies Updated**

**Removed:**

- `@cloudflare/next-on-pages` - Cloudflare Next.js compatibility
- `better-sqlite3` - Local SQLite driver
- `wrangler` - Cloudflare CLI

**Added:**

- `@supabase/supabase-js` - Supabase client
- `pg` - PostgreSQL native driver
- `postgres-js` - PostgreSQL connection library (used by Drizzle)

### 3. **Configuration Files**

#### Updated Files:

- **drizzle.config.ts**

  ```typescript
  // Before: SQLite with d1-http
  driver: "d1-http";
  dialect: "sqlite";
  dbCredentials: {
  	url: process.env.D1_URL || "";
  }

  // After: PostgreSQL
  dialect: "postgresql";
  dbCredentials: {
  	url: process.env.DATABASE_URL || "";
  }
  ```

- **next.config.ts**
  - Removed webpack config for excluding `better-sqlite3` and `fs`
  - No longer needed for Vercel deployment

- **package.json**
  - Updated script: `db:push` from `push:sqlite` to `push:postgresql`
  - Removed `cf-build` and `deploy` scripts
  - Vercel handles deployment automatically

#### Created Files:

- **.env.local.example** - Template for environment variables
- **vercel.json** - Vercel deployment configuration
- **MIGRATION.md** - This file

#### Removed Files:

- **wrangler.toml** - Cloudflare configuration (no longer needed)

### 4. **Database Schema Changes**

All tables converted from SQLite to PostgreSQL syntax:

```typescript
// Before: SQLite
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
export const users = sqliteTable("users", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	email: text("email").notNull().unique(),
	// ...
});

// After: PostgreSQL
import { pgTable, serial, text, uniqueIndex } from "drizzle-orm/pg-core";
export const users = pgTable(
	"users",
	{
		id: serial("id").primaryKey(),
		email: text("email").notNull(),
		// ...
	},
	(table) => ({
		emailIdx: uniqueIndex("users_email_idx").on(table.email),
	}),
);
```

**Key Changes:**

- `integer("id").primaryKey({ autoIncrement: true })` → `serial("id").primaryKey()`
- `.unique()` → Manual uniqueness handling with `uniqueIndex()` (for soft deletes)
- `integer(..., { mode: "timestamp" })` → `timestamp(..., { mode: "date" })`
- `integer(..., { mode: "boolean" })` → `boolean(...)`

### 5. **Database Access Pattern**

#### Before: Cloudflare Context

```typescript
export const runtime = "nodejs"; // Cloudflare-specific

export async function GET(request: Request, context: any) {
	const { env } = context; // Cloudflare binding
	const db = getDB(env); // Requires env parameter
	await requireAuth(env); // Requires env parameter
}
```

#### After: Standard Node.js

```typescript
export async function GET(request: Request) {
	const db = getDB(); // Uses process.env.DATABASE_URL
	await requireAuth(); // No env parameter needed
}
```

### 6. **API Route Updates**

All 32 API routes have been updated:

- ✅ Removed `export const runtime = "nodejs"` declarations
- ✅ Removed context parameter: `(request: Request, context: any)` → `(request: Request)`
- ✅ Removed env extraction: `const { env } = context;` lines deleted
- ✅ Updated function calls: `getDB(env)` → `getDB()`, `requireAuth(env)` → `requireAuth()`

### 7. **Insert Operation Changes**

SQLite `.lastInsertRowid` is not available in PostgreSQL. Use `.returning()` instead:

```typescript
// Before: SQLite
const result = await db.insert(users).values({ name: "John" });
const newId = result.lastInsertRowid;

// After: PostgreSQL
const result = await db.insert(users).values({ name: "John" }).returning();
const newId = result[0].id;
```

## Setup Instructions

### 1. **Create Supabase Project**

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your database credentials from "Settings" → "Database"
4. Note the connection string (PostgreSQL URL)

### 2. **Install Dependencies**

```bash
npm install
```

This installs the new Supabase and PostgreSQL dependencies.

### 3. **Set Environment Variables**

Create `.env.local` file:

```bash
# Copy from template
cp .env.local.example .env.local

# Edit .env.local with your Supabase credentials
DATABASE_URL=postgresql://username:password@host:5432/database_name
```

Format: `postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]`

### 4. **Push Schema to Supabase**

```bash
npm run db:push
```

This creates all tables in your Supabase PostgreSQL database.

### 5. **Deploy to Vercel**

```bash
# Connect your GitHub repository
vercel link

# Add environment variables
vercel env add DATABASE_URL

# Deploy
vercel deploy
```

Or use the Vercel GitHub integration for automatic deployments.

## Migration Checklist

- [x] Updated package.json dependencies
- [x] Converted schema from SQLite to PostgreSQL
- [x] Updated drizzle.config.ts for PostgreSQL
- [x] Refactored lib/db.ts to use Supabase
- [x] Removed webpack configuration from next.config.ts
- [x] Updated all 32 API routes
- [x] Updated RBAC functions to remove env parameter
- [x] Created .env.local.example
- [x] Created vercel.json deployment config
- [x] Removed wrangler.toml and Cloudflare files

## Important Notes

### Soft Deletes

- All tables still use the soft delete pattern with `deletedAt` field
- Unique constraints on soft-deletable fields are implemented in application code
- Always filter with `WHERE deletedAt IS NULL` in queries

### Database Timestamps

- Changed from Unix timestamps (integers) to proper PostgreSQL `timestamp` type
- All dates now use JavaScript `Date` objects

### Connection Pooling

- Vercel Postgres automatically handles connection pooling
- Supabase free tier includes 100 connections (suitable for most projects)

### Runtime Environment

- No longer need `export const runtime = "nodejs"`
- Vercel's Node.js runtime is the default for API routes

## Troubleshooting

### "DATABASE_URL not found"

Make sure `.env.local` has `DATABASE_URL` set correctly.

### "ECONNREFUSED" - Connection Error

1. Verify Supabase project is running
2. Check DATABASE_URL format: `postgresql://user:pass@host:5432/db`
3. Ensure firewall allows connections (Supabase handles this)

### Schema Migration Errors

If you have existing data:

1. Export from old SQLite database
2. Use Supabase migration tools
3. Or manually recreate tables and migrate data

### Vercel Deployment Issues

1. Add `DATABASE_URL` to Vercel environment variables
2. Check Vercel logs: `vercel logs`
3. Ensure build succeeds: `npm run build`

## Performance Comparison

| Aspect             | Cloudflare D1        | Supabase PostgreSQL |
| ------------------ | -------------------- | ------------------- |
| Database           | SQLite               | PostgreSQL          |
| Scalability        | Limited              | Excellent           |
| Query Performance  | Good                 | Better with indexes |
| Connection Pooling | No                   | Yes (included)      |
| Backups            | Manual               | Automatic           |
| Replication        | No                   | Yes (pro)           |
| Cost               | Included in CF Pages | Free tier available |

## Next Steps

1. **Deploy the application** using Vercel
2. **Migrate existing DATA** from old database if applicable
3. **Test all features** thoroughly
4. **Monitor logs** during initial deployment
5. **Set up automated backups** if needed (Supabase includes this)

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Next.js Deployment](https://vercel.com/docs/frameworks/nextjs)
- [Drizzle ORM PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Support

For issues during migration:

1. Check this guide first
2. Review Drizzle ORM docs for Postgres syntax
3. Supabase support: support.supabase.com
4. Vercel support: vercel.com/help

---

**Migration Date:** March 2026
**Status:** ✅ Complete
