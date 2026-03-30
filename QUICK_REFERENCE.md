# Quick Reference: Database Connection Refactor

## 🎯 The Core Change

**One database connection per request instead of multiple connections per function.**

---

## 📌 3-Minute Quick Start

### In Your Server Component Page:

```typescript
import {
  createRequestDB,      // ← NEW: Import this
  getPageSectionsFromDB,
  getSettingsFromDB,
  transformPageSectionsWithDynamicTabs,
} from "@/lib/page-helpers";

export default async function MyPage() {
  // STEP 1: Create database instance ONCE per request
  const db = createRequestDB();

  // STEP 2: Pass db to ALL helper functions
  const settings = await getSettingsFromDB(db);
  const sections = await getPageSectionsFromDB("my-slug", db);

  // STEP 3: Pass to transforms too
  const transformed = await transformPageSectionsWithDynamicTabs(sections, db);

  // Ready to use!
  return <MyComponent {...} />;
}
```

---

## 📊 Before vs After

### BEFORE ❌

```typescript
const settings = await getSettingsFromDB(); // Connection 1 ❌
const sections = await getPageSectionsFromDB("home"); // Connection 2 ❌
const result = await transformPageSections(sections); // Connection 3 ❌
// Total: 3 connections 💥
```

### AFTER ✅

```typescript
const db = createRequestDB(); // Connection 1 ✅
const settings = await getSettingsFromDB(db); // Reuses Connection 1 ✅
const sections = await getPageSectionsFromDB("home", db); // Reuses Connection 1 ✅
const result = await transformPageSections(sections, db); // Reuses Connection 1 ✅
// Total: 1 connection 🎉
```

---

## 🔋 Function Signature Changes

| Function                                          | Parameter  | New Signature                                                   |
| ------------------------------------------------- | ---------- | --------------------------------------------------------------- |
| `getSettingsFromDB`                               | -          | `getSettingsFromDB(db)`                                         |
| `getPageSectionsFromDB`                           | `slug`     | `getPageSectionsFromDB(slug, db)`                               |
| `getPageByIdFromDB`                               | `id`       | `getPageByIdFromDB(id, db)`                                     |
| `transformPageSectionsWithDynamicTabs`            | `sections` | `transformPageSectionsWithDynamicTabs(sections, db)`            |
| `transformSignatureVoyageWithDynamicDestinations` | `sections` | `transformSignatureVoyageWithDynamicDestinations(sections, db)` |
| `transformWellnessEscapeWithDynamicDestinations`  | `sections` | `transformWellnessEscapeWithDynamicDestinations(sections, db)`  |

---

## ✅ Checklist for Each Page

When updating a page:

- [ ] Import `createRequestDB`
- [ ] Add this line first: `const db = createRequestDB();`
- [ ] Pass `db` to `getSettingsFromDB(db)`
- [ ] Pass `db` to `getPageSectionsFromDB(slug, db)`
- [ ] Pass `db` to `getPageByIdFromDB(id, db)`
- [ ] Pass `db` to all `transform*` functions
- [ ] Direct drizzle queries use same `db` instance
- [ ] Verify TypeScript has no errors

---

## 🚨 Common Mistakes to Avoid

### ❌ DON'T: Create multiple db instances

```typescript
const db1 = createRequestDB();
const settings = await getSettingsFromDB(db1);

const db2 = createRequestDB(); // ❌ WRONG! Creates 2nd connection
const sections = await getPageSectionsFromDB("home", db2);
```

### ✅ DO: Reuse single db instance

```typescript
const db = createRequestDB(); // Once! ✅

const settings = await getSettingsFromDB(db);
const sections = await getPageSectionsFromDB("home", db);
```

### ❌ DON'T: Forget to pass db parameter

```typescript
const db = createRequestDB();
const settings = await getSettingsFromDB(); // ❌ Missing db
```

### ✅ DO: Always pass db

```typescript
const db = createRequestDB();
const settings = await getSettingsFromDB(db); // ✅ Correct
```

---

## 🔍 How It Works

```
Request comes in
    ↓
createRequestDB() - Creates ONE Drizzle instance
    ↓
getSettingsFromDB(db) - Uses that same db
    ↓
getPageSectionsFromDB(slug, db) - Reuses same db
    ↓
transform functions(data, db) - Reuses same db
    ↓
All queries use 1 connection ✅
    ↓
pgBouncer happy 🎉
```

---

## 💡 Key Points

1. **One `createRequestDB()` call per request** → ONE connection
2. **Pass `db` to all functions** → Functions reuse it
3. **Sequential queries instead of parallel** → More stable
4. **No environment changes needed** → Works with existing config
5. **Type-safe** → Full TypeScript support

---

## 📖 Real Example

```typescript
// app/(public)/signature-voyage/page.tsx
import {
  createRequestDB,
  getPageSectionsFromDB,
  transformSignatureVoyageWithDynamicDestinations,
} from "@/lib/page-helpers";
import { galleryCategories, galleryOfWorks } from "@/lib/schema";
import { isNull } from "drizzle-orm";

export default async function SignatureVoyagePage() {
  // ✅ ONE instance for entire request
  const db = createRequestDB();

  // ✅ All functions get the same db
  const voyageRaw = await getPageSectionsFromDB("signature-voyage", db);
  const voyage = await transformSignatureVoyageWithDynamicDestinations(voyageRaw, db);

  // ✅ Direct queries also use same db
  const [categories, items] = await Promise.all([
    db.select().from(galleryCategories).where(isNull(galleryCategories.deletedAt)),
    db.select().from(galleryOfWorks).where(isNull(galleryOfWorks.deletedAt)),
  ]);

  // All queries used 1 connection! 🎉
  return <SignatureVoyageClient voyage={voyage} categories={categories} items={items} />;
}
```

---

## 🆘 Getting Help

- See `REFACTOR_MIGRATION_GUIDE.md` for detailed guide
- Check `REFACTOR_COMPLETION_SUMMARY.md` for implementation details
- Look at updated pages: `app/page.tsx`, `app/(public)/signature-voyage/page.tsx`, etc.

---

**Status**: ✅ Ready to use

**Question?** Check the migration guide or ask the team!
