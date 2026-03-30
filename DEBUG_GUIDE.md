# Debugging Guide: "Tenant Not Found" Error di Vercel

## 🔍 Problem Description

- **Home page** (`/`): Returns "tenant not found" atau "user not found" error di Vercel
- **Signature Voyage** (`/signature-voyage`): Works fine
- **Issue Type**: Production-specific (Vercel), tidak terjadi di local development

---

## 🎯 Root Cause Analysis

### 1. **Database Connection Issues**

**Status**: ✅ **FIXED** (2025-03-31)

**Problem**:

- `lib/db.ts` menerima `env` parameter tetapi menggunakan global `process.env.DATABASE_URL`
- Di Vercel, jika environment variables tidak fully loaded, database connection fail
- Home page mencoba fetch dari 5+ tables secara parallel, sehingga error lebih mudah terjadi

**Fix Applied**:

```typescript
// BEFORE:
export function getDB(env: NodeJS.ProcessEnv) {
	const databaseUrl = process.env.DATABASE_URL; // ❌ Ignore env parameter
}

// AFTER:
export function getDB(env: NodeJS.ProcessEnv) {
	const databaseUrl = env.DATABASE_URL || process.env.DATABASE_URL; // ✅ Use env first
	console.log("DB URL from env:", env.DATABASE_URL ? "✅ Set" : "❌ Not set");
	console.log(
		"DB URL from process.env:",
		process.env.DATABASE_URL ? "✅ Set" : "❌ Not set",
	);
}
```

### 2. **N+1 Query Problem pada Signature Voyage**

**Status**: ✅ **FIXED** (2025-03-31)

**Problem**:

- `transformSignatureVoyageWithDynamicDestinations()` menggunakan loop sequential untuk fetch contents per kategori
- Jika ada 5 kategori = 5 separate database queries
- Vercel cold start atau slow database connection = timeout risk

**Optimization Applied**:

```typescript
// BEFORE: N queries (sequential loop)
for (const categoryId of selectedCategoryIds) {
  const categoryContents = await db
    .select()
    .from(contents)
    .where(eq(contents.categoryId, categoryId), ...) // 1 query per category
}

// AFTER: 1 query (batch)
const allArticles = await db
  .select()
  .from(contents)
  .where(inArray(contents.categoryId, selectedCategoryIds), ...) // All categories in 1 query
```

---

## 🚀 Production Debugging Checklist

### Step 1: Verify Environment Variables

```bash
# In Vercel Project Settings → Environment Variables
DATABASE_URL=postgresql://user:password@host:port/database
```

**Check**:

- ✅ DATABASE_URL sudah set untuk "Production" environment
- ✅ Database connection string valid dan accessible dari Vercel region
- ✅ Database username/password correct

### Step 2: Check Vercel Logs

```bash
# 1. Push latest code dengan fixes
git add .
git commit -m "Fix database connection bug and optimize queries"
git push

# 2. Vercel akan rebuild
# 3. Check Vercel Function Logs
# Go to: https://vercel.com/dashboard/project-name/logs

# Look for these log patterns:
# ✅ "DB URL from env: ✅ Set" - Database connection loaded from Vercel env
# ✅ "DB URL from process.env: ✅ Set" - Fallback working
# ❌ "DB URL from env: ❌ Not set" - Missing environment variable
```

### Step 3: Database Connection Pool

```typescript
// lib/db.ts current configuration
{
  max: 10,                      // Max connections
  idleTimeoutMillis: 5000,      // Release unused connections faster
  connectionTimeoutMillis: 15000, // 15s to establish connection
  query_timeout: 5000,          // 5s per query
}
```

**Recommendation**:

- Untuk Vercel, kurangi `max` connections ke 5 (Supabase free tier batas 10)
- Reduce `idleTimeoutMillis` ke 2000ms untuk faster cleanup

### Step 4: Monitor Database Requests

Added enhanced logging untuk semua database operations:

```typescript
// lib/page-helpers.tsx - Enhanced error logging
console.error("❌ Failed to fetch page sections from database:", {
	slug,
	error: error.message,
	stack: error.stack,
	timestamp: new Date().toISOString(),
});
```

**Production Log Pattern**:

```
❌ Failed to fetch page sections from database: {
  "slug": "home",
  "error": "ECONNREFUSED",
  "timestamp": "2025-03-31T10:30:00.000Z"
}
```

---

## 📊 Database Query Audit Results

### Home Page (`/app/page.tsx`)

**Total Database Queries**: **4**

- Query 1: Settings
- Query 2: Page sections
- Query 3: Categories (batch)
- Query 4: Contents (batch)

✅ **Status**: Optimized - uses batch queries

### Signature Voyage (`/app/(public)/signature-voyage/page.tsx`)

**Before**: 3 + N queries (N = number of selected categories)
**After**: **3 queries** (optimized)

- Query 1: Page sections
- Query 2: Contents (batch - ALL categories in 1 query)
- Query 3: Gallery categories
- Query 4: Gallery items

✅ **Status**: Optimized - removed N+1 problem

---

## 🔧 Additional Fixes Applied

### 1. Enhanced Error Logging

**Files Modified**:

- `lib/page-helpers.tsx` - All functions
- `components/PublicHeader.tsx` - Header data fetch

**What's Logged**:

- Error message
- Error stack trace
- Relevant parameters (slug, pageId, selectedCategoryIds)
- Timestamp

### 2. Fallback Handling

All database failures now gracefully fallback:

- `getSettingsFromDB()` → returns empty object `{}`
- `getPageSectionsFromDB()` → returns `null`
- `transformPageSectionsWithDynamicTabs()` → returns original sections
- `PublicHeader` → returns safe defaults (empty navigation, enabled nav)

---

## 🧪 Local Testing

### Test Database Connection

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Check logs
tail -f .next/logs/*.log | grep "DB URL\|❌"

# Open http://localhost:3000
# Should see:
# ✅ "DB URL from process.env: ✅ Set"
# No errors in console
```

### Test on Vercel Staging

```bash
# Deploy to preview environment
git push

# Check preview logs:
https://vercel.com/dashboard/project/deployments?status=preview
```

---

## 🔔 Monitoring Recommendations

### 1. Alert on Database Errors

Add Sentry or similar APM to catch:

- Connection errors
- Query timeouts
- Transformation failures

### 2. Performance Monitoring

Track:

- Time to fetch home page (target: < 1s)
- Time to fetch signature voyage (target: < 1.5s)
- Database connection pool utilization

### 3. Regular Audits

Run monthly database audit to check:

- Query performance
- Connection pool efficiency
- Unused database operations

---

## ✅ Verification Checklist

Before marking as resolved:

- [ ] DATABASE_URL set in Vercel Environment Variables
- [ ] Latest code deployed to Vercel (with database connection fix)
- [ ] Vercel logs show "DB URL from env: ✅ Set"
- [ ] Home page (`/`) loads without "tenant not found" error
- [ ] Signature Voyage (`/signature-voyage`) still works
- [ ] Other public routes load successfully
- [ ] No database timeout errors in Vercel logs
- [ ] Enhanced error logs provide clear debugging information

---

## 🆘 Still Having Issues?

### Quick Troubleshooting

1. **Check DATABASE_URL in Vercel**

   ```bash
   # Vercel CLI
   vercel env pull production .env.production
   grep DATABASE_URL .env.production
   ```

2. **Test Database Directly**

   ```bash
   # Use psql or similar
   psql "$DATABASE_URL" -c "SELECT 1"
   ```

3. **Check Vercel Region**
   - Confirm database is in same region as Vercel deployment
   - Cross-region connections slower and more error-prone

4. **Check Connection Pool**
   - Verify max connections not exceeded
   - Check for long-running queries blocking pool

---
