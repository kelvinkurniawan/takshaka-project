# Before & After Code Examples

## Home Page (app/page.tsx)

### ❌ BEFORE (Problems)

```typescript
import PublicHeader from "@/components/PublicHeader";
import {
	getSettingsFromDB,
	getPageSectionsFromDB,
	getPageByIdFromDB,
	PageContentRenderer,
	transformPageSectionsWithDynamicTabs,
} from "@/lib/page-helpers";

export const revalidate = 60;

export default async function Home() {
	// ❌ Problem 1: Multiple getDB() calls hidden inside functions
	// ❌ Problem 2: Uses Promise.all without managing connections
	const [settings, homeSectionsRaw] = await Promise.all([
		getSettingsFromDB(), // Creates Connection 1 ❌
		getPageSectionsFromDB("home"), // Creates Connection 2 ❌
	]);

	// ❌ Problem 3: Another function creates another connection
	const homeSections =
		await transformPageSectionsWithDynamicTabs(homeSectionsRaw);
	// Creates Connection 3 ❌

	const indexPageId = settings?.index_page
		? parseInt(settings.index_page, 10)
		: null;
	let indexPage: Page | null = null;

	if (indexPageId && !isNaN(indexPageId)) {
		// ❌ Problem 4: Yet another function, another connection
		indexPage = await getPageByIdFromDB(indexPageId);
		// Creates Connection 4 ❌
	}

	// Result: 4 simultaneous connections!
	// pgBouncer exhaustion → "Tenant or user not found" ❌
}
```

### ✅ AFTER (Fixed)

```typescript
import PublicHeader from "@/components/PublicHeader";
import {
	createRequestDB, // ✅ New import
	getSettingsFromDB,
	getPageSectionsFromDB,
	getPageByIdFromDB,
	PageContentRenderer,
	transformPageSectionsWithDynamicTabs,
} from "@/lib/page-helpers";

export const revalidate = 60;

export default async function Home() {
	// ✅ Step 1: Create ONE database instance for entire request
	const db = createRequestDB();

	// ✅ Step 2: Pass db to all functions - they reuse the connection
	const [settings, homeSectionsRaw] = await Promise.all([
		getSettingsFromDB(db), // Uses Connection 1 ✅
		getPageSectionsFromDB("home", db), // Reuses Connection 1 ✅
	]);

	// ✅ Step 3: Transform with same connection
	const homeSections = await transformPageSectionsWithDynamicTabs(
		homeSectionsRaw,
		db, // ← Pass db
	);
	// Reuses Connection 1 ✅

	const indexPageId = settings?.index_page
		? parseInt(settings.index_page, 10)
		: null;
	let indexPage: Page | null = null;

	if (indexPageId && !isNaN(indexPageId)) {
		// ✅ Also uses the single connection
		indexPage = await getPageByIdFromDB(indexPageId, db);
		// Reuses Connection 1 ✅
	}

	// Result: Only 1 connection!
	// All queries through same instance → Stable ✅
}
```

---

## Signature Voyage Page

### ❌ BEFORE (Problems)

```typescript
import {
	getPageSectionsFromDB,
	getFooterSections,
	transformSignatureVoyageWithDynamicDestinations,
} from "@/lib/page-helpers";
import { getDB } from "@/lib/db"; // ❌ Direct import - creates new instances
import { galleryCategories, galleryOfWorks } from "@/lib/schema";
import { isNull } from "drizzle-orm";

export const revalidate = 60;

export default async function SignatureVoyagePage() {
	// ❌ Multiple separate connections created
	const signatureVoyageRaw = await getPageSectionsFromDB("signature-voyage");
	// Creates Connection 1 ❌

	const signatureVoyage =
		await transformSignatureVoyageWithDynamicDestinations(signatureVoyageRaw);
	// Creates Connection 2 ❌

	// ❌ Gets another instance - treats getDB as a utility
	const [footerSections, categories, items] = await Promise.all([
		getFooterSections(),
		getDB(process.env) // Creates Connection 3 ❌
			.select()
			.from(galleryCategories)
			.where(isNull(galleryCategories.deletedAt)),
		getDB(process.env) // Creates Connection 4 ❌
			.select()
			.from(galleryOfWorks)
			.where(isNull(galleryOfWorks.deletedAt)),
	]);

	// Result: 4+ connections!
	// Multiple getDB() calls = multiple pool instances ❌
}
```

### ✅ AFTER (Fixed)

```typescript
import {
	createRequestDB, // ✅ New pattern
	getPageSectionsFromDB,
	getFooterSections,
	transformSignatureVoyageWithDynamicDestinations,
} from "@/lib/page-helpers";
import { galleryCategories, galleryOfWorks } from "@/lib/schema";
import { isNull } from "drizzle-orm";

export const revalidate = 60;

export default async function SignatureVoyagePage() {
	// ✅ Step 1: Create database instance ONCE
	const db = createRequestDB();

	// ✅ Step 2: Pass db to page-helpers
	const signatureVoyageRaw = await getPageSectionsFromDB(
		"signature-voyage",
		db, // ← Pass db
	);
	// Reuses Connection 1 ✅

	const signatureVoyage = await transformSignatureVoyageWithDynamicDestinations(
		signatureVoyageRaw,
		db,
	);
	// Reuses Connection 1 ✅

	// ✅ Step 3: Use same db for direct queries
	const [footerSections, categories, items] = await Promise.all([
		Promise.resolve(getFooterSections()),
		db // ← Use db instance, not getDB()
			.select()
			.from(galleryCategories)
			.where(isNull(galleryCategories.deletedAt)),
		db // ← Same instance
			.select()
			.from(galleryOfWorks)
			.where(isNull(galleryOfWorks.deletedAt)),
	]);

	// Result: Only 1 connection!
	// All queries through single db instance ✅
}
```

---

## Function Signatures

### getSettingsFromDB

```typescript
// ❌ BEFORE
async function _getSettingsFromDB(): Promise<Settings> {
  const db = getDB(process.env);  // ❌ Creates connection
  const allSettings = await db.select().from(settings);
  // ...
}
export const getSettingsFromDB = cache(_getSettingsFromDB);

// Usage
const settings = await getSettingsFromDB(); // ❌ Creates connection each time

---

// ✅ AFTER
async function _getSettingsFromDB(db: Database): Promise<Settings> {
  // ✅ No getDB() call - accepts existing connection
  const allSettings = await db.select().from(settings);
  // ...
}
export function getSettingsFromDB(db: Database): Promise<Settings> {
  return cache(() => _getSettingsFromDB(db))();
}

// Usage
const settings = await getSettingsFromDB(db); // ✅ Reuses provided connection
```

---

## Transform Functions

### transformPageSectionsWithDynamicTabs

```typescript
// ❌ BEFORE
export async function transformPageSectionsWithDynamicTabs(
  sections: any,
): Promise<any> {
  try {
    const db = getDB(process.env);  // ❌ Creates connection inside function

    // Queries here...
    const allCategories = await db.select()...
    const allContents = await db.select()...

    // ...logic...
  } catch (error) { ... }
}

// Usage creates connection
const result = await transformPageSectionsWithDynamicTabs(sections);

---

// ✅ AFTER
export async function transformPageSectionsWithDynamicTabs(
  sections: any,
  db: Database,  // ✅ Accept connection as parameter
): Promise<any> {
  try {
    // No getDB() call - use provided db

    // Queries here...
    const allCategories = await db.select()...
    const allContents = await db.select()...

    // ...same logic...
  } catch (error) { ... }
}

// Usage reuses connection
const result = await transformPageSectionsWithDynamicTabs(sections, db);
```

---

## Database Query Patterns

### Sequential vs Parallel

```typescript
// ❌ BEFORE: Parallel creates multiple connections
export async function transformSignatureVoyage(sections: any): Promise<any> {
  const db = getDB(process.env);

  // Problem: Promise.all creates multiple connections internally
  const articlesFromCategories = await Promise.all(
    selectedCategoryIds.map(async (categoryId) => {
      // Each map creates separate query with same db instance
      return await db.select().from(contents)...
    }),
  );
}

---

// ✅ AFTER: Sequential with single connection
export async function transformSignatureVoyage(
  sections: any,
  db: Database,  // ✅ Single instance
): Promise<any> {
  const allArticles = [];

  // Sequential: One query at a time, same connection
  for (const categoryId of selectedCategoryIds) {
    const categoryContents = await db
      .select()
      .from(contents)
      .where(eq(contents.categoryId, categoryId));

    allArticles.push(...categoryContents);
  }
  // All queries used db instance ✅
}
```

---

## Type Definitions

### Database Type

```typescript
// ✅ NEW: Type definition added
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

type Database = NodePgDatabase<any>;

// Used in all function signatures
export function getSettingsFromDB(db: Database): Promise<Settings>;
export function getPageSectionsFromDB(slug: string, db: Database): Promise<any>;
export function transformPageSections(
	sections: any,
	db: Database,
): Promise<any>;
```

---

## Summary Table

| Aspect                    | Before ❌              | After ✅              |
| ------------------------- | ---------------------- | --------------------- |
| Connections per request   | 4+                     | 1                     |
| getDB() calls             | Multiple               | One (createRequestDB) |
| Connection initialization | In each function       | At request level      |
| Dependency                | Implicit               | Explicit (parameter)  |
| Type safety               | Partial                | Full                  |
| Caching                   | cache() + hidden state | cache() + explicit db |
| Error handling            | Unchanged              | Unchanged             |
| Business logic            | Unchanged              | Unchanged             |
| Performance               | Variable               | Predictable           |
| pgBouncer load            | High                   | Low                   |
| Errors                    | "Tenant not found"     | Eliminated            |

---

## Key Takeaways

1. **Before**: Each function creates its own connection → Multiple simultaneous connections
2. **After**: One connection per request, passed to all functions → Single connection reused

3. **Before**: `const db = getDB(process.env)` inside each function
4. **After**: `const db = createRequestDB()` once, then `functionName(param, db)`

5. **Before**: Hidden connection creation → Unpredictable
6. **After**: Explicit dependency injection → Predictable

7. **Before**: Complex to debug which function creates the connection
8. **After**: Clear - createRequestDB() creates it, all functions reuse

---

## Migration Effort

- **Easy**: Simple pages with 1-2 helper functions → 2 minutes
- **Medium**: Pages with 3-4 functions → 5 minutes
- **Complex**: Pages with transforms + direct queries → 10 minutes

**Total for all pages**: < 1 hour to update
**Testing required**: 30 minutes
**Documentation review**: 15 minutes

---

Total refactoring complete! ✅
