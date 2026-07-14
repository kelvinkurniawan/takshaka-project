/**
 * Cache Revalidation Utilities
 * Handles on-demand revalidation of pages when content changes
 */

import { revalidatePath as nextRevalidatePath } from "next/cache";

/**
 * Page paths that need revalidation
 * Maps page slugs to their routes
 */
// ponytail: route groups like (public) are NOT part of the URL — paths must be the real URL
const PAGE_PATH_MAP: Record<string, string[]> = {
	home: ["/"],
	"prestige-events": ["/prestige-event"],
	"signature-voyage": ["/signature-voyage"],
	"our-inspiration": ["/our-inspiration"],
	"curated-experience": ["/curated-experiences"],
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
	} catch (error) {
		console.error("Error revalidating all pages:", error);
	}
}
