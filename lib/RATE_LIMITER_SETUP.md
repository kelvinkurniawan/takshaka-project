# Rate Limiter Setup - Supabase PostgreSQL

## Step 1: Create Table di Supabase

Jalankan query SQL ini di **Supabase SQL Editor**:

```sql
-- Create login_attempts table
CREATE TABLE login_attempts (
  id BIGSERIAL PRIMARY KEY,
  identifier TEXT NOT NULL,
  attempted_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create index untuk query yang lebih cepat
CREATE INDEX idx_login_attempts_identifier_time
ON login_attempts (identifier, attempted_at DESC);
```

## Step 2: Add Table ke Schema

Update `lib/schema.ts` dan tambahkan:

```typescript
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const loginAttempts = sqliteTable("login_attempts", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	identifier: text("identifier").notNull(),
	attemptedAt: integer("attempted_at", { mode: "timestamp" }).notNull(),
});
```

## Step 3: Generate & Push Migration (Optional)

Jika menggunakan Drizzle migrations:

```bash
npm run db:generate
npm run db:push
```

## How It Works

**File**: `lib/rate-limiter-supabase.ts`

- **Rate Limit**: 5 attempts per identifier per 15 minutes
- **Dual Check**: Rate limited by IP + by email
- **HTTP 429**: Returns with `Retry-After` header when blocked
- **Auto Clear**: Counters reset on successful login

## Login Route is Ready

File `app/api/auth/login/route.ts` sudah fully integrated:

- ✅ Checks rate limit sebelum validation
- ✅ Returns 429 jika terblokir
- ✅ Clears counters on success
- ✅ Proper error handling & logging

## Test Login Endpoint

```bash
# Test 1: Success
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"yourpassword"}'

# Test 2: Rate limit (fire 6 bad requests)
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}' \
    -H "x-forwarded-for: 127.0.0.1"
done

# Request 6 akan return HTTP 429 dengan pesan "Terlalu banyak percobaan"
```

## Monitor Attempts (Supabase)

View login attempts di Supabase SQL Editor:

```sql
-- Lihat semua attempts dalam 1 jam terakhir
SELECT identifier, COUNT(*) as attempts, MAX(attempted_at) as last_attempt
FROM login_attempts
WHERE attempted_at > NOW() - INTERVAL '1 hour'
GROUP BY identifier
ORDER BY attempts DESC;

-- Lihat attempts untuk email tertentu
SELECT * FROM login_attempts
WHERE identifier LIKE 'login_email:%'
ORDER BY attempted_at DESC
LIMIT 10;

-- Cleanup old records (older than 7 days)
DELETE FROM login_attempts
WHERE attempted_at < NOW() - INTERVAL '7 days';
```

## Files Involved

| File                                                          | Purpose                           |
| ------------------------------------------------------------- | --------------------------------- |
| [app/api/auth/login/route.ts](../app/api/auth/login/route.ts) | Login endpoint with rate limiting |
| [lib/rate-limiter-supabase.ts](./rate-limiter-supabase.ts)    | Rate limiter utility              |
| [lib/session.ts](./session.ts)                                | Session cookie management         |
| [middleware.ts](../middleware.ts)                             | Route protection                  |

## What's Next

- Sudah ready untuk production
- Monitor attempts via Supabase dashboard
- (Optional) Setup automatic cleanup via Supabase Function atau Vercel Cron
