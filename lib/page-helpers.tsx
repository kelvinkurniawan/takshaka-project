/**
 * Page Rendering Helpers
 * Shared utility functions for rendering pages and sections
 *
 * IMPORTANT: All database operations use dependency injection (db parameter)
 * to ensure a single database connection per request in serverless environments.
 */

import { cache } from "react";
import { getDB as getDBInstance } from "@/lib/db";
import {
	settings,
	pageSections,
	contents,
	categories as categoriesTable,
} from "@/lib/schema";
import { eq, isNull, and, inArray } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { sanitizeRichText } from "@/lib/sanitize-html";

type Database = NodePgDatabase<any>;

interface FooterLink {
	label: string;
	href: string;
	mobileOnly?: boolean;
	type?: "button" | "link";
}

interface FooterSection {
	title: string;
	href?: string;
	mobileOnly?: boolean;
	links: FooterLink[];
}

export interface SocialLink {
	platform: string;
	url: string;
}

export interface Settings {
	index_page?: string;
	hero_title?: string;
	hero_description?: string;
	hero_image?: string;
	show_articles?: string;
	[key: string]: string | undefined;
}

export interface Page {
	id: number;
	title: string;
	slug: string;
	content: string;
	status: string;
	metaTitle?: string;
	metaDescription?: string;
	createdAt: string;
	updatedAt: string;
}

export interface CarouselItem {
	id: string;
	media: string;
	title?: string;
	subtitle?: string;
	link?: string;
}

export interface ColumnContent {
	id: string;
	type: "text" | "image" | "video" | "embed" | "carousel";
	content: string;
	imageProps?: {
		width: string;
		height: string;
		objectFit: "cover" | "contain" | "fill" | "scale-down";
		placement: "left" | "center" | "right";
		alt: string;
		borderRadius: string;
	};
	videoProps?: {
		width: string;
		height: string;
		autoplay: boolean;
		loop: boolean;
		muted: boolean;
	};
	carouselProps?: {
		itemsVisible: number;
		containerWidth: string;
		items: CarouselItem[];
	};
}

export interface Block {
	id: string;
	columns: number;
	content: ColumnContent[];
	customCSS?: string;
}

export interface PageContent {
	blocks: Block[];
}

/**
 * Fetch app metadata from database
 */
export const getAppMetadata = cache(async () => {
	const db = createRequestDB();
	const allSettings = await getSettingsFromDB(db);

	return {
		name: allSettings.site_name ?? "Takshaka CMS",
		description:
			allSettings.site_description ?? "Modern headless CMS built with Next.js",
	};
});

/**
 * Create a database instance for the current request
 * Call this ONCE per request to get a shared database connection
 *
 * Usage in server components:
 * const db = createRequestDB();
 * const settings = await getSettingsFromDB(db);
 * const sections = await getPageSectionsFromDB(slug, db);
 */
export function createRequestDB(): Database {
	return getDBInstance(process.env);
}

/**
 * Internal function to fetch settings directly from database
 * Returns empty object on failure with graceful error handling
 */
async function _getSettingsFromDB(db: Database): Promise<Settings> {
	try {
		const allSettings = await db.select().from(settings);

		const result: Settings = {};
		for (const setting of allSettings) {
			result[setting.key] = setting.value || undefined;
		}
		return result;
	} catch (error) {
		const errorMsg = error instanceof Error ? error.message : String(error);
		const isTableNotFound =
			errorMsg.includes("does not exist") ||
			errorMsg.includes("no such table") ||
			errorMsg.includes("Failed query");

		// Log at warning level for expected errors (table not initialized)
		const logLevel = isTableNotFound ? "warn" : "error";
		console[logLevel]("⚠️  Failed to fetch settings from database:", {
			message: errorMsg,
			code: (error as any).code,
			detail: (error as any).detail,
			// Only include stack for unexpected errors
			stack: isTableNotFound
				? undefined
				: error instanceof Error
					? error.stack
					: undefined,
		});

		// Return defaults instead of empty object
		return {
			site_name: "Takshaka Indonesia",
			site_description: "Luxury Travel Experiences",
		};
	}
}

/**
 * Cached version of getSettingsFromDB
 * Results are cached per request to avoid duplicate queries within the same request
 */
export function getSettingsFromDB(db: Database): Promise<Settings> {
	return cache(() => _getSettingsFromDB(db))();
}

/**
 * Internal function to fetch page sections from database by slug
 */
async function _getPageSectionsFromDB(
	slug: string,
	db: Database,
): Promise<any | null> {
	try {
		const pageSection = await db
			.select()
			.from(pageSections)
			.where(
				and(eq(pageSections.pageSlug, slug), isNull(pageSections.deletedAt)),
			)
			.limit(1);

		if (pageSection.length === 0) return null;
		return JSON.parse(pageSection[0].pageData);
	} catch (error) {
		console.error("❌ DB ERROR FULL:", {
			message: error instanceof Error ? error.message : String(error),
			code: (error as any).code,
			detail: (error as any).detail,
			stack: error instanceof Error ? error.stack : undefined,
		});
		return null;
	}
}

/**
 * Cached version of getPageSectionsFromDB
 * Results are cached per request to avoid duplicate queries within the same request
 */
export function getPageSectionsFromDB(
	slug: string,
	db: Database,
): Promise<any | null> {
	return cache(() => _getPageSectionsFromDB(slug, db))();
}

/**
 * Transform page sections data by building tabs from selectedCategoryIds
 * Uses sequential queries to avoid overwhelming the database connection pool
 *
 * Important: Pass db parameter to reuse the same connection instance
 */
export async function transformPageSectionsWithDynamicTabs(
	sections: any,
	db: Database,
): Promise<any> {
	if (!sections || !sections.curatedExperiences) {
		return sections;
	}

	const { selectedCategoryIds } = sections.curatedExperiences;

	// If no categories are selected, return sections as-is
	if (!selectedCategoryIds || selectedCategoryIds.length === 0) {
		return sections;
	}

	try {
		// Batch fetch all categories at once (1 query instead of N)
		const allCategories = await db
			.select({
				id: categoriesTable.id,
				name: categoriesTable.name,
				slug: categoriesTable.slug,
				description: categoriesTable.description,
			})
			.from(categoriesTable)
			.where(
				and(
					inArray(categoriesTable.id, selectedCategoryIds),
					isNull(categoriesTable.deletedAt),
				),
			);

		if (allCategories.length === 0) return sections;

		// Batch fetch all contents for these categories at once (1 query instead of N)
		const allContents = await db
			.select({
				id: contents.id,
				title: contents.title,
				excerpt: contents.excerpt,
				featuredImage: contents.featuredImage,
				slug: contents.slug,
				categoryId: contents.categoryId,
			})
			.from(contents)
			.where(
				and(
					inArray(contents.categoryId, selectedCategoryIds),
					eq(contents.status, "published"),
					isNull(contents.deletedAt),
				),
			);
		// ponytail: no SQL limit — a global limit starves categories unfairly (no ORDER BY, no per-category guarantee); the in-memory cap below enforces max 4 per category

		// Group contents by categoryId in memory
		// Filter out contents with null categoryId
		const contentsByCategory = new Map<
			number,
			Array<{
				id: number;
				title: string;
				excerpt: string | null;
				featuredImage: string | null;
				slug: string;
				categoryId: number | null;
			}>
		>();

		for (const content of allContents) {
			// Skip if categoryId is null
			if (content.categoryId === null) continue;

			if (!contentsByCategory.has(content.categoryId)) {
				contentsByCategory.set(content.categoryId, []);
			}
			const categoryContents = contentsByCategory.get(content.categoryId);
			if (categoryContents && categoryContents.length < 4) {
				categoryContents.push(content);
			}
		}

		// Build categories with content
		const categoriesWithContent = allCategories
			.map((category: { id: number }) => {
				const categoryContents = contentsByCategory.get(category.id) || [];
				if (categoryContents.length === 0) return null;

				return {
					...category,
					contents: categoryContents,
				};
			})
			.filter((cat): cat is Exclude<typeof cat, null> => cat !== null);

		// Utility function to truncate text
		const truncateText = (text: string, maxLength: number = 120): string => {
			if (!text || text.length <= maxLength) return text;
			const truncated = text.substring(0, maxLength).trim();
			return truncated.endsWith(".") ? truncated : truncated + "...";
		};

		// Placeholder image (simple colored placeholder)
		const placeholderImage =
			"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='16' fill='%23999' text-anchor='middle' dominant-baseline='middle'%3ENo Image Available%3C/text%3E%3C/svg%3E";

		// Generate tabs
		const tabs = categoriesWithContent.map((category: any) => ({
			id: `tab-${category.id}`,
			label: category.name,
			items: category.contents.map((content: any) => ({
				id: content.id.toString(),
				title: content.title,
				description: truncateText(content.excerpt || ""),
				image: content.featuredImage || placeholderImage,
				slug: content.slug,
			})),
		}));

		// Return sections with generated tabs
		return {
			...sections,
			curatedExperiences: {
				...sections.curatedExperiences,
				tabs,
			},
		};
	} catch (error) {
		console.error("❌ Failed to transform page sections with dynamic tabs:", {
			error: error instanceof Error ? error.message : String(error),
			selectedCategoryIds: sections.curatedExperiences?.selectedCategoryIds,
			stack: error instanceof Error ? error.stack : undefined,
			timestamp: new Date().toISOString(),
		});
		// Return original sections if transformation fails
		return sections;
	}
}

/**
 * Transform signature voyage page sections with dynamic top destinations
 * Fetches articles from selected categories and maps them to destination format
 * Uses sequential queries to avoid overwhelming the database connection pool
 *
 * Important: Pass db parameter to reuse the same connection instance
 */
export async function transformSignatureVoyageWithDynamicDestinations(
	sections: any,
	db: Database,
): Promise<any> {
	if (!sections || !sections.topDestinations) {
		return sections;
	}

	const { selectedCategoryIds } = sections.topDestinations;

	// If no categories are selected or they use manual destinations, return as-is
	if (!selectedCategoryIds || selectedCategoryIds.length === 0) {
		return sections;
	}

	try {
		// ✅ OPTIMIZED: Batch fetch articles from all categories in ONE query
		// Previously: N queries (one per category) - now: 1 query using inArray()
		const allArticles = await db
			.select({
				id: contents.id,
				title: contents.title,
				excerpt: contents.excerpt,
				content: contents.content,
				featuredImage: contents.featuredImage,
				slug: contents.slug,
			})
			.from(contents)
			.where(
				and(
					inArray(contents.categoryId, selectedCategoryIds), // ✅ All categories in 1 query
					eq(contents.status, "published"),
					isNull(contents.deletedAt),
				),
			)
			.orderBy(contents.createdAt);

		// Map articles to destination format
		const allDestinations = allArticles.map((content: any) => ({
			title: content.title,
			subtitle: content.excerpt || "No description available",
			description:
				content.excerpt ||
				content.content?.substring(0, 200) ||
				"No description available",
			image: content.featuredImage,
			slug: content.slug, // For navigation to blog detail page
		}));

		// Return sections with generated destinations
		return {
			...sections,
			topDestinations: {
				...sections.topDestinations,
				destinations:
					allDestinations.length > 0
						? allDestinations
						: sections.topDestinations.destinations, // Fallback to manual if no articles found
			},
		};
	} catch (error) {
		console.error(
			"❌ Failed to transform signature voyage with dynamic destinations:",
			{
				error: error instanceof Error ? error.message : String(error),
				selectedCategoryIds,
				stack: error instanceof Error ? error.stack : undefined,
				timestamp: new Date().toISOString(),
			},
		);
		// Return original sections if transformation fails
		return sections;
	}
}

/**
 * Transform wellness escape page sections with dynamic top destinations
 * Same as signature voyage transformation with sequential queries
 *
 * Important: Pass db parameter to reuse the same connection instance
 */
export async function transformWellnessEscapeWithDynamicDestinations(
	sections: any,
	db: Database,
): Promise<any> {
	if (!sections || !sections.theHolisticExperience) {
		return sections;
	}

	const { selectedCategoryIds } = sections.theHolisticExperience;

	// If no categories are selected or they use manual destinations, return as-is
	if (!selectedCategoryIds || selectedCategoryIds.length === 0) {
		return sections;
	}

	try {
		// ✅ OPTIMIZED: Batch fetch articles from all categories in ONE query
		// Previously: N queries (one per category) - now: 1 query using inArray()
		const allArticles = await db
			.select({
				id: contents.id,
				title: contents.title,
				excerpt: contents.excerpt,
				content: contents.content,
				featuredImage: contents.featuredImage,
				slug: contents.slug,
			})
			.from(contents)
			.where(
				and(
					inArray(contents.categoryId, selectedCategoryIds), // ✅ All categories in 1 query
					eq(contents.status, "published"),
					isNull(contents.deletedAt),
				),
			)
			.orderBy(contents.createdAt);

		// Map articles to destination format with validation
		const allDestinations = allArticles
			.filter((content) => content.title) // Filter out articles without title
			.map((content: any) => ({
				title: content.title,
				subtitle: content.excerpt || "No description available",
				description:
					content.excerpt ||
					content.content?.substring(0, 200) ||
					"No description available",
				image: content.featuredImage || "/images/placeholder.jpg",
				slug: content.slug, // For navigation to blog detail page
			}));

		// Return sections with generated destinations
		return {
			...sections,
			theHolisticExperience: {
				...sections.theHolisticExperience,
				destinations:
					allDestinations.length > 0
						? allDestinations
						: sections.theHolisticExperience.destinations, // Fallback to manual if no articles found
			},
		};
	} catch (error) {
		console.error(
			"❌ Failed to transform wellness escape with dynamic destinations:",
			{
				error: error instanceof Error ? error.message : String(error),
				selectedCategoryIds,
				stack: error instanceof Error ? error.stack : undefined,
				timestamp: new Date().toISOString(),
			},
		);
		// Return original sections if transformation fails
		return sections;
	}
}

/**
 * Fetch page by ID directly from database
 * Pass db parameter to reuse the same connection instance
 */
export async function getPageByIdFromDB(
	pageId: number,
	db: Database,
): Promise<Page | null> {
	try {
		const pages = await db
			.select()
			.from(contents)
			.where(eq(contents.id, pageId));

		if (pages.length === 0) return null;
		const page = pages[0];
		return {
			id: page.id,
			title: page.title,
			slug: page.slug,
			content: page.content,
			status: page.status,
			metaTitle: page.metaTitle || undefined,
			metaDescription: page.metaDescription || undefined,
			createdAt: page.createdAt?.toISOString() || "",
			updatedAt: page.updatedAt?.toISOString() || "",
		};
	} catch (error) {
		console.error("❌ Failed to fetch page from database:", {
			pageId,
			error: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined,
			timestamp: new Date().toISOString(),
		});
		return null;
	}
}

/**
 * Carousel Renderer Component
 */
export function CarouselRenderer({
	carousel,
}: {
	carousel: ColumnContent["carouselProps"];
}) {
	if (!carousel || !carousel.items.length) return null;

	return (
		<div
			className="carousel-container overflow-x-auto"
			style={{ width: carousel.containerWidth }}
		>
			<div className="flex gap-4">
				{carousel.items.map((item) => (
					<div
						key={item.id}
						className="flex-shrink-0 relative"
						style={{
							minWidth: `calc(${carousel.containerWidth} / ${carousel.itemsVisible})`,
						}}
					>
						{item.media && (
							<>
								{item.media.match(/\.(mp4|webm|ogg)$/i) ? (
									<video
										src={item.media}
										className="w-full h-auto rounded"
										autoPlay={false}
										loop={false}
										muted={false}
										controls
									/>
								) : (
									<img
										src={item.media}
										alt={item.title || "carousel item"}
										className="w-full h-auto object-cover rounded"
									/>
								)}
							</>
						)}
						{(item.title || item.subtitle) && (
							<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-white rounded-b">
								{item.title && (
									<div className="font-semibold text-lg">{item.title}</div>
								)}
								{item.subtitle && (
									<div className="text-sm opacity-90">{item.subtitle}</div>
								)}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

/**
 * Column Content Renderer Component
 */
export function ColumnContentRenderer({ column }: { column: ColumnContent }) {
	const OptimizedImage = require("@/components/OptimizedImage").default;

	switch (column.type) {
		case "text":
			return (
				<div
					className="prose prose-sm max-w-none"
					dangerouslySetInnerHTML={{ __html: sanitizeRichText(column.content) }}
				/>
			);

		case "image":
			if (!column.content) return null;
			const imgProps = column.imageProps || {
				width: "100%",
				height: "auto",
				objectFit: "cover" as const,
				placement: "center" as const,
				alt: "",
				borderRadius: "0px",
			};
			return (
				<div
					className={`flex justify-${imgProps.placement === "left" ? "start" : imgProps.placement === "right" ? "end" : "center"}`}
				>
					<OptimizedImage
						src={column.content}
						alt={imgProps.alt || "image"}
						width={imgProps.width}
						height={imgProps.height}
						objectFit={imgProps.objectFit}
						borderRadius={imgProps.borderRadius}
						className="max-w-full h-auto"
					/>
				</div>
			);

		case "video":
			if (!column.content) return null;
			const vidProps = column.videoProps || {
				width: "100%",
				height: "auto",
				autoplay: false,
				loop: false,
				muted: false,
			};
			return (
				<video
					src={column.content}
					style={{
						width: vidProps.width,
						height: vidProps.height,
					}}
					autoPlay={vidProps.autoplay}
					loop={vidProps.loop}
					muted={vidProps.muted}
					controls
					className="max-w-full h-auto rounded"
				/>
			);

		case "embed":
			return (
				<div
					className="embed-container"
					dangerouslySetInnerHTML={{ __html: sanitizeRichText(column.content) }}
				/>
			);

		case "carousel":
			return <CarouselRenderer carousel={column.carouselProps} />;

		default:
			return null;
	}
}

/**
 * Parse custom CSS string to inline styles
 */
export function parseCustomCSS(cssString: string) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const styles: any = {};
	if (!cssString) return styles;

	// Simple CSS parser for common properties
	const rules = cssString.split(";");
	for (const rule of rules) {
		const [key, value] = rule.split(":");
		if (key && value) {
			const cssKey = key
				.trim()
				.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
			styles[cssKey] = value.trim();
		}
	}
	return styles;
}

/**
 * Block Renderer Component
 */
export function BlockRenderer({ block }: { block: Block }) {
	const gridColsClass =
		{
			1: "grid-cols-1",
			2: "grid-cols-1 md:grid-cols-2",
			3: "grid-cols-1 md:grid-cols-3",
			4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
		}[block.columns] || "grid-cols-1";

	return (
		<div
			className={`grid ${gridColsClass} gap-6`}
			style={block.customCSS ? { ...parseCustomCSS(block.customCSS) } : {}}
		>
			{block.content.map((column) => (
				<div key={column.id} className="flex flex-col">
					<ColumnContentRenderer column={column} />
				</div>
			))}
		</div>
	);
}

/**
 * Page Content Renderer Component
 */
export function PageContentRenderer({ content }: { content: string }) {
	try {
		const parsed: PageContent = JSON.parse(content);
		const blocks = parsed.blocks || [];

		return (
			<div className="space-y-12">
				{blocks.map((block) => (
					<BlockRenderer key={block.id} block={block} />
				))}
			</div>
		);
	} catch (error) {
		console.error("Failed to parse page content:", error);
		return (
			<div className="text-red-500">
				Error rendering page content. Invalid page structure.
			</div>
		);
	}
}

/**
 * Get footer sections
 */
export function getFooterSections() {
	const footerSection = [
		{
			title: "Our Inspiration",
			href: "/our-inspiration",
			links: [
				{
					label: "Letter from Our Board",
					href: "/our-inspiration#letter-from-board",
				},
				{ label: "Takshaka Ways", href: "/our-inspiration#takshaka-ways" },
				{ label: "Brand Stories", href: "/our-inspiration#brand-stories" },
			],
		},
		{
			title: "Prestige Events",
			href: "/prestige-events",
			links: [
				{ label: "Signature Voyage", href: "/signature-voyage" },
				{ label: "Wellness Escape", href: "/wellness-escape" },
				{ label: "Curated Experiences", href: "/curated-experiences" },
			],
		},
		{
			title: "Indonesia Journal",
			href: "/indonesia-journal",
			links: [
				{ label: "Insights", href: "/indonesia-journal/insights" },
				{ label: "News & Events", href: "/indonesia-journal/news-events" },
				{ label: "Side Projects", href: "/indonesia-journal/side-projects" },
			],
		},
		{
			title: "Portfolio",
			href: "/portfolio",
			links: [
				{ label: "Milestone", href: "/portfolio/milestone" },
				{ label: "Gallery Events", href: "/portfolio/gallery-events" },
				{ label: "Sustainable Impact", href: "/portfolio/sustainable-impact" },
				{ label: "Community Impact", href: "/portfolio/community-impact" },
			],
		},
		{
			title: "Sustainable Impact",
			href: "/sustainable-impact",
			mobileOnly: true,
			links: [
				{ label: "Environtment Impact", href: "/portfolio/environment-impact" },
				{ label: "Community Impact", href: "/portfolio/community-impact" },
			],
		},
		{
			title: "Let's Connect",
			links: [
				{ label: "INQUIRY", href: "/connect/inquiry", type: "button" },
				{ label: "CAREER", href: "/connect/career", type: "button" },
			],
		},
	] satisfies FooterSection[];

	return footerSection;
}

/**
 * Fetch social media links from database settings
 * Uses React cache for request-level deduplication
 * Only returns links with non-empty URLs
 */
export const getSocialMediaLinks = cache(async (): Promise<SocialLink[]> => {
	try {
		const db = createRequestDB();

		const allSettings = await getSettingsFromDB(db);

		const supportedPlatforms = [
			"instagram",
			"youtube",
			"linkedin",
			"facebook",
			"twitter",
		];

		const socialLinks: SocialLink[] = [];

		for (const platform of supportedPlatforms) {
			const key = `social_${platform}`;
			const url = allSettings[key];

			if (url && typeof url === "string" && url.trim().length > 0) {
				socialLinks.push({
					platform: platform.charAt(0).toUpperCase() + platform.slice(1),
					url,
				});
			}
		}
		return socialLinks;
	} catch (error) {
		return [];
	}
});
