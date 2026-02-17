# AI Coding Assistant Instructions for NextCMS

## Project Overview

NextCMS is a Next.js 15 headless CMS with SQLite database, designed for dual-environment deployment:

- **Development**: Local SQLite (dev.db) with Node.js runtime
- **Production**: Cloudflare D1 + Workers (edge runtime)

Stack: Next.js 15, Drizzle ORM, SQLite, Cloudflare Pages + Workers

## Critical Architecture Patterns

### Database Access Pattern

**File**: [lib/db.ts](lib/db.ts)

The `getDB(env)` function handles environment-specific database initialization:

- **Production**: Uses `env.DB` (D1 binding from Cloudflare) - NOT `process.env`
- **Development**: Uses local `better-sqlite3` with dynamic `require()` to avoid bundling
- The `env` parameter comes from Next.js API route context, must be passed from the request

```typescript
// CORRECT - In API routes
export async function GET(request: Request, context: any) {
  const { env } = context;
  const db = getDB(env);
}

// INCORRECT - Do not use process.env.DB in production
const db = getDB({}); // Missing env binding
```

### API Route Pattern

**Files**: [app/api/users/route.ts](app/api/users/route.ts), [app/api/health/route.ts](app/api/health/route.ts)

All API routes must:

1. Export `export const runtime = "nodejs"` to enable Node.js compatibility (fs, better-sqlite3, etc.)
2. Extract `env` from context parameter
3. Initialize database via `getDB(env)`
4. Return responses with `Response.json()`

```typescript
// Template for new API routes
export const runtime = "nodejs";

export async function GET(request: Request, context: any) {
  const { env } = context;
  const db = getDB(env);

  const data = await db.select().from(table);
  return Response.json(data);
}
```

## Build & Deployment Configuration

### Webpack Externals ([next.config.ts](next.config.ts))

The webpack config excludes `better-sqlite3` and `fs` from edge runtime bundling:

- These modules cannot run in Cloudflare Workers edge runtime
- The externals config prevents bundling errors in production build
- Dynamic `require()` in db.ts ensures these load only in Node.js environments

### Database Migrations

**Setup**: [drizzle.config.ts](drizzle.config.ts)

- Dialect: SQLite
- Driver: d1-http (for Cloudflare D1)
- Migrations stored in `drizzle/` directory
- Schema defined in [lib/schema.ts](lib/schema.ts)

Commands:

- `npm run db:push` - Push schema to database (defined in package.json)
- Schema changes go in [lib/schema.ts](lib/schema.ts)

## Data Layer

### Schema Conventions

**File**: [lib/schema.ts](lib/schema.ts)

Tables use standard Drizzle SQLite syntax:

```typescript
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});
```

When adding new tables:

- Export table definitions as constants
- Import in API routes: `from "@/lib/schema"`
- Add Drizzle migration after schema changes

## Development Workflow

### Local Development

```bash
npm install                # Install dependencies (includes better-sqlite3)
npm run dev               # Start dev server on localhost:3000
# Creates dev.db automatically on first run
```

### Testing Database Connection

- GET `/api/health` - Returns database connection status
- GET `/api/users` - Returns all users
- POST `/api/users` - Create new user with JSON body: `{ "name": "..." }`

### Production Build & Deployment

```bash
npm run build             # Build for Cloudflare deployment
# Outputs to .vercel/output/static
# Must have D1_URL env var set for Drizzle migrations
```

## Key Dependencies & Gotchas

- **better-sqlite3**: Dev-only, native module excluded from production builds
- **drizzle-orm**: Supports both D1 and SQLite drivers
- **@cloudflare/next-on-pages**: Handles Next.js → Cloudflare Workers compilation
- **next 15.5.2**: Uses App Router (not Pages Router)

## Drizzle Query Examples

Common operations with proper Drizzle syntax:

```typescript
import { eq } from "drizzle-orm";
import { users } from "@/lib/schema";

// Select all
const allUsers = await db.select().from(users);

// Select with condition
const user = await db.select().from(users).where(eq(users.id, id));

// Select single result
const firstUser = await db
  .select()
  .from(users)
  .where(eq(users.id, id))
  .limit(1);

// Select with multiple conditions (use and() for multi-where queries)
import { and } from "drizzle-orm";
const activeUsers = await db
  .select()
  .from(users)
  .where(and(eq(users.role, "admin"), eq(users.active, true)));

// Insert
await db.insert(users).values({
  name: "John Doe",
});

// Update
await db.update(users).set({ name: "Jane Doe" }).where(eq(users.id, id));

// Delete
await db.delete(users).where(eq(users.id, id));

// Count
const count = await db.select().from(users);
const total = count.length;
```

Always import `eq` from `drizzle-orm` for WHERE conditions.
Always use `and()` from `drizzle-orm` for multiple WHERE conditions in the same query.

## Common Mistakes & Anti-Patterns

### ❌ WRONG - Do NOT do this:

```typescript
// ❌ Don't import better-sqlite3 directly in edge routes
import sqlite from "better-sqlite3";

// ❌ Don't use process.env.DB in production
const db = drizzle(process.env.DB, { schema });

// ❌ Don't forget runtime declaration
export async function GET() { ... }

// ❌ Don't create global DB instance
let globalDb = getDB({});
```

### ✅ CORRECT - Always do this:

```typescript
// ✅ Always use getDB(env) from context
export const runtime = "nodejs";
export async function GET(request: Request, context: any) {
  const { env } = context;
  const db = getDB(env);
  // db is properly initialized for both production and development
}

// ✅ Always pass env parameter to getDB
const db = getDB(env); // With env from context

// ✅ Call getDB fresh on each request
export async function POST(request: Request, context: any) {
  const db = getDB(context.env); // Fresh instance per request
}
```

## Component Architecture Requirements

### Server Components for Data Security

**ALWAYS use Server Components** for any component that needs to fetch data or perform database operations:

```typescript
// ✅ CORRECT - Server Component
export default async function CategoryManager() {
  // Direct database access - secure, no API exposure
  const db = getDB(process.env);
  const categories = await db.select().from(categoriesTable);

  return <CategoryManagerClient initialCategories={categories} />;
}

// ❌ WRONG - Client Component with API calls
'use client';
export default function CategoryManager() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // API call exposes queries to client
    fetch('/api/categories').then(res => res.json());
  }, []);
}
```

**Requirements:**

- Use Server Components for all data fetching
- Pass initial data as props to Client Components
- Never expose database queries or API endpoints to client-side code
- Client Components should only handle UI interactions and state

### Soft Deletes for Critical Data

**ALWAYS implement soft deletes** for important business data:

```typescript
// ✅ CORRECT - Schema with soft delete (NO unique constraints in DB)
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // No .unique() - handled in application
  description: text("description"),
  createdBy: integer("created_by").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

// ✅ CORRECT - Soft delete in API
await db
  .update(categories)
  .set({ deletedAt: new Date() })
  .where(eq(categories.id, categoryId));

// ✅ CORRECT - Filter soft deleted records
const categories = await db
  .select()
  .from(categories)
  .where(isNull(categories.deletedAt)); // Exclude soft deleted

// ✅ CORRECT - Manual filtering for uniqueness checks (Drizzle limitation workaround)
const existing = await db
  .select()
  .from(categories)
  .where(eq(categories.slug, validatedData.slug));

const activeCategories = existing.filter((cat) => cat.deletedAt === null);
if (activeCategories.length > 0) {
  return Response.json({ error: "Slug sudah digunakan" }, { status: 400 });
}
```

**Requirements:**

- Add `deletedAt` field to all critical data tables
- Use `UPDATE` with `deletedAt = new Date()` instead of `DELETE`
- Always filter queries with `WHERE deletedAt IS NULL`
- Never use hard deletes for business-critical data
- **Never use database-level unique constraints** for soft deletable fields
- Handle uniqueness in application code using manual filtering
- Use `filter((item) => item.deletedAt === null)` for complex uniqueness checks

### Theme Consistency with Global CSS

**ALWAYS use global CSS** for theme consistency across the application:

```css
/* ✅ CORRECT - globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
  }
}

@layer components {
  .btn-primary {
    background-color: hsl(var(--primary));
    color: hsl(var(--foreground));
  }
}
```

```typescript
// ✅ CORRECT - Apply theme classes globally
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={theme === 'dark' ? 'dark' : ''}>
      <body className="bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
```

**Requirements:**

- Define all theme variables in `globals.css`
- Use CSS custom properties for colors, spacing, and other design tokens
- Apply theme classes to `html` or `body` element
- Never define theme styles in component-specific CSS modules
- Use Tailwind's `dark:` prefix for dark mode variants

### ❌ WRONG - Component Architecture Anti-Patterns:

```typescript
// ❌ Don't use Client Components for data fetching
'use client';
export default function CategoryManager() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories').then(res => res.json()); // Exposes API to client
  }, []);

  return <div>...</div>;
}

// ❌ Don't use hard deletes for business data
await db.delete(categories).where(eq(categories.id, id)); // Permanent deletion

// ❌ Don't define theme styles in component CSS modules
// Button.module.css
.btn-primary {
  background-color: #3b82f6; /* Hard-coded color */
  color: white;
}
```

### ✅ CORRECT - Component Architecture Patterns:

```typescript
// ✅ Use Server Components for data fetching
export default async function CategoryManager() {
  const db = getDB(process.env);
  const categories = await db.select().from(categoriesTable);

  return <CategoryManagerClient initialCategories={categories} />;
}

// ✅ Use soft deletes for business data
await db.update(categories)
  .set({ deletedAt: new Date() })
  .where(eq(categories.id, id));

// ✅ Define theme in globals.css only
/* globals.css */
@layer components {
  .btn-primary {
    background-color: hsl(var(--primary));
    color: hsl(var(--foreground));
  }
}
```

## Error Handling Pattern

Wrap database operations in try-catch and return safe error messages:

```typescript
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request, context: any) {
  try {
    const { env } = context;
    const db = getDB(env);
    const body = await request.json();

    // Validate input (see Input Validation section)
    const data = validateUserInput(body);

    // Execute query
    await db.insert(users).values(data);

    return Response.json({ success: true });
  } catch (error) {
    // Log full error server-side
    console.error("Database operation failed:", error);

    // Return safe error to client (never expose stack trace)
    return Response.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
```

**Key rules:**

- Always log full error with `console.error()` server-side
- NEVER expose raw DB errors, stack traces, or internal details to client
- Return generic error messages to frontend
- Use appropriate HTTP status codes (400 for validation, 500 for server errors)

## Input Validation with Zod

Always validate user input before database operations:

```typescript
import { z } from "zod";

// Define validation schema
const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Invalid email").optional(),
});

export async function POST(request: Request, context: any) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = createUserSchema.parse(body);

    // Now safe to use in database
    const { env } = context;
    const db = getDB(env);
    await db.insert(users).values(validatedData);

    return Response.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return validation errors to client
      return Response.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 },
      );
    }

    // Handle other errors
    console.error("Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

**Requirements:**

- Use Zod schemas for all POST/PUT/PATCH endpoints
- Use `z.parse()` or `z.safeParse()` to validate
- Return validation errors with 400 status
- Never skip validation - always validate before database access

## When Adding Features

1. **New API Endpoint**: Copy template from users/route.ts, remember `export const runtime = "nodejs"`
2. **Database Table**: Add to lib/schema.ts, run migrations
3. **API with DB Access**: Always pass `env` from context to `getDB(env)`
4. **Environment Variables**: Use `env` parameter in API routes (production), `process.env` in build config only
5. **New Components**: Always use Server Components for data fetching, pass data as props to Client Components
6. **Database Tables**: Always add `deletedAt` field for soft deletes on critical business data
7. **Theme/Styling**: Always define theme variables in `globals.css`, never in component-specific CSS modules

## Integration Points

- **Cloudflare D1**: Production database, binding name is "DB"
- **Cloudflare Workers**: Edge runtime for production API routes
- **Drizzle Kit**: ORM for database operations and schema management
- **Next.js App Router**: File-based routing in app/ directory
