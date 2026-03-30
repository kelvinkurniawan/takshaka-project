# Database Request Audit Report

## 📊 Summary

Laporan audit jumlah database request untuk halaman `/` (home) dan `/signature-voyage` di Vercel.

---

## 🏠 Home Page (`/`)

**File**: `app/page.tsx`

### Request Count: **4 Database Queries**

| #   | Query Type | Table           | Purpose                                       | Location                                                 |
| --- | ---------- | --------------- | --------------------------------------------- | -------------------------------------------------------- |
| 1   | `SELECT`   | `settings`      | Fetch all settings                            | `getSettingsFromDB()`                                    |
| 2   | `SELECT`   | `page_sections` | Fetch home page sections                      | `getPageSectionsFromDB("home", db)`                      |
| 3   | `SELECT`   | `categories`    | Fetch categories for curated experiences tabs | `transformPageSectionsWithDynamicTabs()` - 1 batch query |
| 4   | `SELECT`   | `contents`      | Fetch published articles for each category    | `transformPageSectionsWithDynamicTabs()` - 1 batch query |

### Query Details:

```typescript
// Query 1: Settings
db.select().from(settings);

// Query 2: Page Sections
db.select()
	.from(pageSections)
	.where(and(eq(pageSections.pageSlug, "home"), isNull(pageSections.deletedAt)))
	.limit(1);

// Query 3: Categories (Batch - optimized)
db.select()
	.from(categoriesTable)
	.where(
		and(
			inArray(categoriesTable.id, selectedCategoryIds), // All IDs in ONE query
			isNull(categoriesTable.deletedAt),
		),
	);

// Query 4: Contents (Batch - optimized)
db.select()
	.from(contents)
	.where(
		and(
			inArray(contents.categoryId, selectedCategoryIds), // All categories in ONE query
			eq(contents.status, "published"),
			isNull(contents.deletedAt),
		),
	)
	.limit(4 * selectedCategoryIds.length);
```

### ✅ Optimization: Batched Queries

- Query 3 & 4 menggunakan `inArray()` untuk fetch semua category dan content dalam **1 query per table**
- Bukan loop N+1 queries (lebih efisien)

---

## ✈️ Signature Voyage Page (`/signature-voyage`)

**File**: `app/(public)/signature-voyage/page.tsx`

### Request Count: **3-N Database Queries** (tergantung jumlah kategori)

| #   | Query Type | Table                | Purpose                                  | Location                                                         |
| --- | ---------- | -------------------- | ---------------------------------------- | ---------------------------------------------------------------- |
| 1   | `SELECT`   | `page_sections`      | Fetch signature voyage sections          | `getPageSectionsFromDB("signature-voyage", db)`                  |
| 2-N | `SELECT`   | `contents`           | Fetch articles per kategori (SEQUENTIAL) | `transformSignatureVoyageWithDynamicDestinations()` - Loop query |
| N+1 | `SELECT`   | `gallery_categories` | Fetch gallery categories                 | Main page query                                                  |
| N+2 | `SELECT`   | `gallery_of_works`   | Fetch gallery items                      | Main page query                                                  |

### Query Details:

```typescript
// Query 1: Page Sections
db.select()
	.from(pageSections)
	.where(
		and(
			eq(pageSections.pageSlug, "signature-voyage"),
			isNull(pageSections.deletedAt),
		),
	)
	.limit(1);

// Query 2-N: Contents (SEQUENTIAL LOOP - Not optimized!)
for (const categoryId of selectedCategoryIds) {
	const categoryContents = await db
		.select()
		.from(contents)
		.where(
			and(
				eq(contents.categoryId, categoryId), // ⚠️ Individual query per category
				eq(contents.status, "published"),
				isNull(contents.deletedAt),
			),
		)
		.orderBy(contents.createdAt);
	// Repeated for EACH categoryId
}

// Query N+1: Gallery Categories
db.select()
	.from(galleryCategories)
	.where(isNull(galleryCategories.deletedAt))
	.orderBy(galleryCategories.displayOrder);

// Query N+2: Gallery Works
db.select()
	.from(galleryOfWorks)
	.where(isNull(galleryOfWorks.deletedAt))
	.orderBy(galleryOfWorks.displayOrder);
```

### ⚠️ Performance Issue: Sequential Loop (N+1 Problem)

- Query 2-N menggunakan **loop sequensial** bukan batch query
- Jika ada 5 kategori = **5 separate queries** untuk contents
- Ini bisa menjadi bottleneck pada production dengan slow database connection

### Example:

- 1 kategori = **6 total queries** (1 sections + 1 contents + 1 gallery_categories + 1 gallery_works)
- 5 kategori = **9 total queries** (1 sections + 5 contents + 1 gallery_categories + 1 gallery_works)
- 10 kategori = **14 total queries** (1 sections + 10 contents + 1 gallery_categories + 1 gallery_works)

---

## 🔴 Issues Detected

### 1. **N+1 Query Problem di Signature Voyage**

```typescript
// ❌ TIDAK EFISIEN
for (const categoryId of selectedCategoryIds) {
  const contents = await db.select()...  // Multiple queries
}

// ✅ HARUS DIUBAH ke batch query
const contents = await db.select()
  .from(contents)
  .where(inArray(contents.categoryId, selectedCategoryIds))
```

### 2. **Database Connection Issue di Vercel**

**Problem**: Saat membuka `/`, terjadi error "tenant not found" atau "user not found"
**Root Cause**: Di `lib/db.ts`, meskipun parameter `env` diterima, kode sebenarnya menggunakan global `process.env`:

```typescript
export function getDB(env: NodeJS.ProcessEnv) {
	// env parameter diterima
	// ❌ Tapi menggunakan process.env, bukan env parameter
	const databaseUrl = process.env.DATABASE_URL;
	// ✅ Seharusnya: const databaseUrl = env.DATABASE_URL;
}
```

Ini bisa menyebabkan masalah di Vercel jika environment variables tidak di-load dengan benar.

### 3. **Missing try-catch di PublicHeader**

`PublicHeader.tsx` tidak memiliki proper error handling untuk database failure.

---

## 🔍 Database Connection Check

### Current Setup (db.ts):

- **Database Type**: PostgreSQL (via Supabase)
- **Connection Pool**: Max 10 connections
- **Query Timeout**: 5000ms (5 seconds)
- **Connection Timeout**: 15000ms (15 seconds)
- **Idle Timeout**: 5000ms

### Environment Variables Required:

```
DATABASE_URL=postgresql://user:password@host:port/database
```

---

## ✅ Recommendations

### 1. **Fix N+1 Query Problem (HIGH PRIORITY)** ✅ DONE

Optimize `transformSignatureVoyageWithDynamicDestinations()` dengan batch query.

**Files Modified**:

- `lib/page-helpers.tsx` - transformSignatureVoyageWithDynamicDestinations()
- `lib/page-helpers.tsx` - transformWellnessEscapeWithDynamicDestinations()

**Result**: Reduced from N+1 queries (sequential loop) to single batch query using `inArray()`

### 2. **Fix Database Connection Bug (CRITICAL)** ✅ DONE

Update `lib/db.ts` untuk menggunakan `env` parameter properly.

**Files Modified**:

- `lib/db.ts` - getDB() function

**Change**:

```typescript
// BEFORE:
const databaseUrl = process.env.DATABASE_URL;

// AFTER:
const databaseUrl = env.DATABASE_URL || process.env.DATABASE_URL;
console.log("DB URL from env:", env.DATABASE_URL ? "✅ Set" : "❌ Not set");
console.log(
	"DB URL from process.env:",
	process.env.DATABASE_URL ? "✅ Set" : "❌ Not set",
);
```

### 3. **Add Monitoring & Logging** ✅ DONE

Tambahkan database query monitoring untuk track performance di production.

**Files Modified**:

- `lib/page-helpers.tsx` - Enhanced error logging on all catch blocks
- `components/PublicHeader.tsx` - Enhanced error logging with context

**Logging Pattern**:

```typescript
console.error("❌ Failed to [operation]:", {
	error: error.message,
	stack: error.stack,
	timestamp: new Date().toISOString(),
	// + relevant context (slug, pageId, selectedCategoryIds, etc.)
});
```

### 4. **Vercel Production Debug** ✅ READY

Cek:

- ✅ DATABASE_URL sudah set di Vercel Environment Variables
- ✅ Database instance accessible dari Vercel
- ✅ Connection pool configuration sesuai Supabase limits
- ✅ Enhanced logging untuk production debugging
  Cek:

- ✅ DATABASE_URL sudah set di Vercel Environment Variables
- ✅ Database instance accessible dari Vercel
- ✅ Connection pool configuration sesuai Supabase limits

---
