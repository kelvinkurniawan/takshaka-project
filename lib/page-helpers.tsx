/**
 * Page Rendering Helpers
 * Shared utility functions for rendering pages and sections
 */

import { getDB } from "@/lib/db";
import {
	settings,
	pageSections,
	contents,
	categories as categoriesTable,
} from "@/lib/schema";
import { eq, isNull, and } from "drizzle-orm";

interface FooterLink {
	label: string;
	href: string;
	mobileOnly?: boolean;
	type?: "button" | "link";
}

interface FooterSection {
	title: string;
	mobileOnly?: boolean;
	links: FooterLink[];
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
export async function getAppMetadata(): Promise<{
	name: string;
	description: string;
}> {
	try {
		const allSettings = await getSettingsFromDB();
		return {
			name: allSettings.site_name ?? "Takshaka CMS",
			description:
				allSettings.site_description ??
				"Modern headless CMS built with Next.js",
		};
	} catch (error) {
		return {
			name: "Takshaka CMS",
			description: "Modern headless CMS built with Next.js",
		};
	}
}

/**
 * Fetch settings directly from database
 */
export async function getSettingsFromDB(): Promise<Settings> {
	try {
		const db = getDB();
		const allSettings = await db.select().from(settings);

		const result: Settings = {};
		for (const setting of allSettings) {
			result[setting.key] = setting.value || undefined;
		}
		return result;
	} catch (error) {
		console.error("Failed to fetch settings from database:", error);
		return {};
	}
}

/**
 * Fetch page sections directly from database by slug
 */
export async function getPageSectionsFromDB(slug: string): Promise<any | null> {
	try {
		const db = getDB();

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
		console.error("Failed to fetch page sections from database:", error);
		return null;
	}
}

/**
 * Transform page sections data by building tabs from selectedCategoryIds
 * This generates dynamic tabs from the available categories and their content
 */
export async function transformPageSectionsWithDynamicTabs(
	sections: any,
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
		const db = getDB();

		// Fetch categories and their published content
		const categoriesWithContent = await Promise.all(
			selectedCategoryIds.map(async (categoryId: number) => {
				const categoryData = await db
					.select({
						id: categoriesTable.id,
						name: categoriesTable.name,
						slug: categoriesTable.slug,
						description: categoriesTable.description,
					})
					.from(categoriesTable)
					.where(
						and(
							eq(categoriesTable.id, categoryId),
							isNull(categoriesTable.deletedAt),
						),
					)
					.limit(1);

				if (categoryData.length === 0) return null;

				const category = categoryData[0];

				// Fetch published contents for this category
				const categoryContents = await db
					.select({
						id: contents.id,
						title: contents.title,
						excerpt: contents.excerpt,
						featuredImage: contents.featuredImage,
						slug: contents.slug,
					})
					.from(contents)
					.limit(4) // Limit to 5 items per category for performance
					.where(
						and(
							eq(contents.categoryId, categoryId),
							eq(contents.status, "published"),
							isNull(contents.deletedAt),
						),
					);

				if (categoryContents.length === 0) return null;

				return {
					...category,
					contents: categoryContents,
				};
			}),
		);

		// Utility function to truncate text
		const truncateText = (text: string, maxLength: number = 120): string => {
			if (!text || text.length <= maxLength) return text;
			const truncated = text.substring(0, maxLength).trim();
			return truncated.endsWith(".") ? truncated : truncated + "...";
		};

		// Placeholder image (simple colored placeholder)
		const placeholderImage =
			"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='16' fill='%23999' text-anchor='middle' dominant-baseline='middle'%3ENo Image Available%3C/text%3E%3C/svg%3E";

		// Filter out null values and generate tabs
		const validCategories = categoriesWithContent.filter((cat) => cat !== null);
		const tabs = validCategories.map((category) => ({
			id: `tab-${category.id}`,
			label: category.name,
			items: category.contents.map((content: any) => ({
				id: content.id.toString(),
				title: content.title,
				description: truncateText(content.excerpt || ""),
				image: content.featuredImage || placeholderImage,
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
		console.error(
			"Failed to transform page sections with dynamic tabs:",
			error,
		);
		// Return original sections if transformation fails
		return sections;
	}
}

/**
 * Fetch page by ID directly from database
 */
export async function getPageByIdFromDB(pageId: number): Promise<Page | null> {
	try {
		const db = getDB();
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
		console.error("Failed to fetch page from database:", error);
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
					dangerouslySetInnerHTML={{ __html: column.content }}
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
					dangerouslySetInnerHTML={{ __html: column.content }}
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
			links: [
				{ label: "Signature Voyage", href: "/signature-voyage" },
				{ label: "Wellness Escape", href: "/wellness-escape" },
				{ label: "Curated Experiences", href: "/curated-experiences" },
			],
		},
		{
			title: "Indonesia Journal",
			links: [
				{ label: "Insights", href: "/indonesia-journal/insights" },
				{ label: "News & Events", href: "/indonesia-journal/news-events" },
				{ label: "Side Projects", href: "/indonesia-journal/side-projects" },
			],
		},
		{
			title: "Portfolio",
			links: [
				{ label: "Milestone", href: "/portfolio/milestone" },
				{ label: "Gallery Events", href: "/portfolio/gallery-events" },
				{ label: "Sustainable Impact", href: "/portfolio/sustainable-impact" },
				{ label: "Community Impact", href: "/portfolio/community-impact" },
			],
		},
		{
			title: "Sustainable Impact",
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
