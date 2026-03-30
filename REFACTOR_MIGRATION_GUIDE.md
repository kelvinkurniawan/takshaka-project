# Page Helpers Refactor - Migration Guide

## 📋 Summary

The `page-helpers.tsx` file has been refactored to use **dependency injection** for database connections. This ensures that each request uses **only ONE database instance**, preventing connection pool exhaustion in serverless environments (Vercel + Supabase + pgBouncer).

### Key Changes:

- ✅ Removed internal `getDB()` calls from all helper functions
- ✅ Added `createRequestDB()` helper - call this ONCE per request
- ✅ All helper functions now accept `db: Database` parameter
- ✅ Converted `Promise.all` database queries to sequential `for` loops
- ✅ Maintained request-level caching with React's `cache()`
- ✅ Preserved all business logic - only refactored connection handling

---

## 🚀 Migration Steps

### Step 1: Update Your Pages

**BEFORE (Old Pattern):**

```typescript
// app/(public)/[slug]/page.tsx
import { getPageSectionsFromDB } from "@/lib/page-helpers";

export default async function Page() {
	const sections = await getPageSectionsFromDB(slug);
	// ...
}
```

**AFTER (New Pattern):**

```typescript
// app/(public)/[slug]/page.tsx
import {
  createRequestDB,
  getPageSectionsFromDB,
  transformPageSectionsWithDynamicTabs
} from "@/lib/page-helpers";

export default async function Page() {
  // ✅ Create ONE database instance per request
  const db = createRequestDB();

  // ✅ Pass db to all helper functions
  const sections = await getPageSectionsFromDB(slug, db);

  // ✅ Continue passing the same db instance
  const transformedSections = await transformPageSectionsWithDynamicTabs(
    sections,
    db
  );

  return (
    // ... your JSX
  );
}
```

---

## 📝 Complete Example

### Before Refactor - Multiple Connections

```typescript
// ❌ This creates multiple DB instances in one request
export default async function CuratedExperiencesPage() {
  const pageData = await getPageSectionsFromDB("curated-experiences"); // Connection 1
  const transformed = await transformPageSectionsWithDynamicTabs(pageData); // Connection 2
  const settings = await getSettingsFromDB(); // Connection 3

  // Result: 3 simultaneous connections to pgBouncer 😱
  return <PageContent />;
}
```

### After Refactor - Single Shared Connection

```typescript
// ✅ This reuses ONE DB instance throughout the request
export default async function CuratedExperiencesPage() {
  // Step 1: Create connection once
  const db = createRequestDB();

  // Step 2: Pass to all functions
  const pageData = await getPageSectionsFromDB("curated-experiences", db);
  const transformed = await transformPageSectionsWithDynamicTabs(pageData, db);
  const settings = await getSettingsFromDB(db);

  // Result: 1 connection for entire request ✅
  return <PageContent />;
}
```

---

## 🔄 Function Signature Changes

| Function                                                    | Before    | After                                                           |
| ----------------------------------------------------------- | --------- | --------------------------------------------------------------- |
| `getSettingsFromDB()`                                       | No params | `getSettingsFromDB(db)`                                         |
| `getPageSectionsFromDB(slug)`                               | 1 param   | `getPageSectionsFromDB(slug, db)`                               |
| `getPageByIdFromDB(id)`                                     | 1 param   | `getPageByIdFromDB(id, db)`                                     |
| `transformPageSectionsWithDynamicTabs(sections)`            | 1 param   | `transformPageSectionsWithDynamicTabs(sections, db)`            |
| `transformSignatureVoyageWithDynamicDestinations(sections)` | 1 param   | `transformSignatureVoyageWithDynamicDestinations(sections, db)` |
| `transformWellnessEscapeWithDynamicDestinations(sections)`  | 1 param   | `transformWellnessEscapeWithDynamicDestinations(sections, db)`  |
| `createRequestDB()`                                         | N/A       | New function - creates ONE instance per request                 |

---

## 📍 Where to Make Changes

### Pages That Need Updates:

Find all files that call these functions:

```bash
grep -r "getPageSectionsFromDB\|getSettingsFromDB\|getPageByIdFromDB\|transformPageSections" app/ --include="*.tsx"
```

Typical files:

- `app/(public)/[slug]/page.tsx`
- `app/(public)/signature-voyage/page.tsx`
- `app/(public)/wellness-escape/page.tsx`
- `app/(public)/curated-experiences/page.tsx`
- Any other page that uses these helpers

### Update Pattern:

```typescript
// 1. Import createRequestDB
import { createRequestDB, getPageSectionsFromDB, ... } from "@/lib/page-helpers";

// 2. In your page component
export default async function YourPage() {
  const db = createRequestDB(); // Once per request

  // 3. Pass db to all function calls
  const data = await getPageSectionsFromDB(slug, db);

  return <Component />;
}
```

---

## ✅ Benefits of This Refactor

| Benefit                      | Impact                                       |
| ---------------------------- | -------------------------------------------- |
| **1 connection per request** | Eliminates "Tenant or user not found" errors |
| **Lower pgBouncer usage**    | Prevents connection pool exhaustion          |
| **Sequential DB queries**    | Predictable, stable performance              |
| **Faster response times**    | No connection overhead per function call     |
| **Request-level caching**    | Still benefits from React's built-in cache() |
| **Type-safe**                | Full TypeScript support maintained           |
| **Easy debugging**           | Clear which DB instance is used              |

---

## ⚠️ Important Notes

1. **createRequestDB() must be called ONCE** per server component
2. **Pass the same `db` instance** to all helper functions in that component
3. **Do NOT call createRequestDB() multiple times** - this defeats the purpose
4. **No breaking changes to business logic** - only connection handling changed
5. **Still compatible with Next.js caching** via `cache()` function

---

## 🧪 Testing After Migration

1. **Local develop**: `npm run dev`
2. **Verify pages load**: Visit pages that use these helpers
3. **Check server logs**: Should see single DB connections per request
4. **Production**: Deploy and monitor pgBouncer connection stats

---

## 📚 Example: Complete Page

```typescript
// app/(public)/curated-experiences/page.tsx
import {
  createRequestDB,
  getPageSectionsFromDB,
  transformPageSectionsWithDynamicTabs,
  getSettingsFromDB,
  PageContentRenderer,
} from "@/lib/page-helpers";

export const metadata = {
  title: "Curated Experiences",
};

export default async function CuratedExperiencesPage() {
  // ✅ Create ONE database instance for this entire request
  const db = createRequestDB();

  // ✅ Fetch page sections - reuses same db
  const pageData = await getPageSectionsFromDB("curated-experiences", db);

  if (!pageData) {
    return <div>Page not found</div>;
  }

  // ✅ Transform sections - reuses same db
  const sections = await transformPageSectionsWithDynamicTabs(pageData, db);

  // ✅ Get settings - reuses same db
  const settings = await getSettingsFromDB(db);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1>{sections?.title || "Curated Experiences"}</h1>

      {sections?.blocks && (
        <PageContentRenderer content={JSON.stringify({ blocks: sections.blocks })} />
      )}
    </div>
  );
}
```

---

## 🔧 Troubleshooting

### Still getting connection errors?

- Verify `createRequestDB()` is called ONCE per page
- Check all function calls pass the same `db` instance
- Ensure no nested `createRequestDB()` calls

### TypeScript errors?

- Import the `Database` type if needed: `import type { NodePgDatabase } from "drizzle-orm/node-postgres";`
- Make sure parameter order is correct: `functionName(param1, param2, db)`

### Performance issues?

- Sequential queries will be slightly slower than parallel
- This is intentional - trading speed for stability
- Next.js request-level caching should mitigate most overhead

---

## 📖 References

- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)<br/>
- [React cache() Function](https://react.dev/reference/react/cache)
- [Supabase pgBouncer Config](https://supabase.com/docs/guides/database/pgBouncer-config)
