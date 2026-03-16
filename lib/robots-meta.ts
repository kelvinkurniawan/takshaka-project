/**
 * Robots Meta Tag Helper
 * Manage robots directives for individual pages/content
 */

export type RobotsDirective =
	| "index"
	| "noindex"
	| "follow"
	| "nofollow"
	| "all"
	| "none"
	| "noarchive"
	| "nosnippet"
	| "noimageindex"
	| "notranslate"
	| "nocache";

export interface RobotsMetaConfig {
	index?: boolean; // index vs noindex
	follow?: boolean; // follow vs nofollow
	archive?: boolean; // archive vs noarchive
	snippet?: boolean; // snippet vs nosnippet
	imageindex?: boolean; // imageindex vs noimageindex
	translate?: boolean; // translate vs notranslate
	cache?: boolean; // cache vs nocache
}

/**
 * Build robots meta tag content string
 * @param config Robot directives configuration
 * @returns Robots meta tag content string
 *
 * @example
 * // Allow all
 * buildRobotsMeta({ index: true, follow: true })
 * // Output: "index,follow"
 *
 * @example
 * // Block indexing but allow external page crawling
 * buildRobotsMeta({ index: false, follow: true })
 * // Output: "noindex,follow"
 */
export function buildRobotsMeta(config: RobotsMetaConfig): string {
	const directives: RobotsDirective[] = [];

	// Index directive (default: allow)
	if (config.index === false) {
		directives.push("noindex");
	} else if (config.index === true) {
		directives.push("index");
	}

	// Follow directive (default: allow)
	if (config.follow === false) {
		directives.push("nofollow");
	} else if (config.follow === true) {
		directives.push("follow");
	}

	// Archive directive
	if (config.archive === false) {
		directives.push("noarchive");
	}

	// Snippet directive
	if (config.snippet === false) {
		directives.push("nosnippet");
	}

	// Image index directive
	if (config.imageindex === false) {
		directives.push("noimageindex");
	}

	// Translate directive
	if (config.translate === false) {
		directives.push("notranslate");
	}

	// Cache directive
	if (config.cache === false) {
		directives.push("nocache");
	}

	return directives.join(",");
}

/**
 * Predefined robots configurations
 */
export const ROBOTS_PRESETS = {
	/**
	 * Default: Allow search engines to index and follow
	 * Used for public content
	 */
	DEFAULT: buildRobotsMeta({ index: true, follow: true }),

	/**
	 * No indexing, no following
	 * Used for admin, private, or draft content
	 */
	NOINDEX_NOFOLLOW: buildRobotsMeta({
		index: false,
		follow: false,
	}),

	/**
	 * No indexing but allow following links
	 * Used for temporary, staging, or private pages
	 */
	NOINDEX_FOLLOW: buildRobotsMeta({
		index: false,
		follow: true,
	}),

	/**
	 * Index but don't follow external links
	 * Used for pages with many external ads or affiliate links
	 */
	INDEX_NOFOLLOW: buildRobotsMeta({
		index: true,
		follow: false,
	}),

	/**
	 * Allow indexing but prevent archiving
	 * Used for regularly updated content
	 */
	INDEX_NOARCHIVE: buildRobotsMeta({
		index: true,
		follow: true,
		archive: false,
	}),

	/**
	 * Index but prevent snippets in search results
	 * Used for sensitive or premium content
	 */
	INDEX_NOSNIPPET: buildRobotsMeta({
		index: true,
		follow: true,
		snippet: false,
	}),
};

/**
 * Get robots directive from stored value
 * @param stored Value from database (e.g., from contents.robots)
 * @returns Robots meta tag string
 */
export function getRobotsFromDatabase(stored?: string | null): string {
	if (!stored) return ROBOTS_PRESETS.DEFAULT;

	// If it's already a valid preset
	if (Object.values(ROBOTS_PRESETS).includes(stored)) {
		return stored;
	}

	// Try to parse as preset key
	const presetKey = stored
		.toUpperCase()
		.replace(/-/g, "_") as keyof typeof ROBOTS_PRESETS;
	if (presetKey in ROBOTS_PRESETS) {
		return ROBOTS_PRESETS[presetKey];
	}

	// Return as-is if it's a valid directive format
	if (stored.match(/^(index|noindex),(follow|nofollow)/)) {
		return stored;
	}

	// Default fallback
	return ROBOTS_PRESETS.DEFAULT;
}

/**
 * Usage in metadata generation:
 *
 * import { getRobotsFromDatabase, ROBOTS_PRESETS } from '@/lib/robots-meta';
 *
 * export async function generateMetadata({ params }): Promise<Metadata> {
 *   const content = await getContent(params.slug);
 *
 *   return {
 *     title: content.title,
 *     description: content.metaDescription,
 *     robots: {
 *       index: !content.robots?.includes('noindex'),
 *       follow: !content.robots?.includes('nofollow'),
 *       nocache: content.robots?.includes('nocache'),
 *       noarchive: content.robots?.includes('noarchive'),
 *     }
 *   };
 * }
 *
 * // Or using string format in HTML:
 * <meta name="robots" content={getRobotsFromDatabase(content.robots)} />
 *
 * // Database migration example:
 * ALTER TABLE contents ADD COLUMN robots TEXT DEFAULT 'index,follow';
 * ALTER TABLE pages ADD COLUMN robots TEXT DEFAULT 'index,follow';
 */
