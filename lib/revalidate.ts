/**
 * Cache Revalidation Utilities
 * Handles on-demand revalidation of pages when content changes
 */

import { revalidatePath as nextRevalidatePath } from "next/cache";

/**
 * Page paths that need revalidation
 * Maps page slugs to their routes
 */
const PAGE_PATH_MAP: Record<string, string[]> = {
	home: ["/"],
	"prestige-events": ["/(public)/prestige-event"],
	"signature-voyage": ["/(public)/signature-voyage"],
	"our-inspiration": ["/(public)/our-inspiration"],
};

/**
 * Revalidate pages that depend on a specific page section slug
 * Called after page section updates to clear cache
 * @param pageSlug - The page slug that was updated
 */
export async function revalidatePageBySlug(pageSlug: string): Promise<void> {
	const paths = PAGE_PATH_MAP[pageSlug];

	if (!paths) {
		console.warn(`No paths configured for page slug: ${pageSlug}`);
		return;
	}

	try {
		for (const path of paths) {
			nextRevalidatePath(path);
			console.log(`Revalidated path: ${path}`);
		}
	} catch (error) {
		console.error(`Error revalidating paths for ${pageSlug}:`, error);
		// Don't throw - allow request to complete even if revalidation fails
	}
}

/**
 * Revalidate all public pages
 * Called after gallery or navigation updates
 */
export async function revalidateAllPages(): Promise<void> {
	try {
		const allPaths = Object.values(PAGE_PATH_MAP).flat();
		for (const path of allPaths) {
			nextRevalidatePath(path);
		}
		console.log(`Revalidated ${allPaths.length} paths`);
	} catch (error) {
		console.error("Error revalidating all pages:", error);
	}
}
