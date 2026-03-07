/**
 * Page Rendering Helpers
 * Shared utility functions for rendering pages and sections
 */

import { getDB } from "@/lib/db";
import { settings, pageSections, contents } from "@/lib/schema";
import { eq, isNull, and } from "drizzle-orm";

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
		console.log("Fetched settings for metadata:", allSettings);
		return {
			name: allSettings.site_name ?? "Takshaka CMS",
			description:
				allSettings.site_description ??
				"Modern headless CMS built with Next.js",
		};
	} catch (error) {
		console.error("Failed to fetch app metadata:", error);
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
	return [
		{
			title: "Our Inspiration",
			links: [
				{ label: "Letter from Our Board", href: "#" },
				{ label: "Takshaka Ways", href: "#" },
				{ label: "Brand Stories", href: "#" },
			],
		},
		{
			title: "Prestige Events",
			links: [
				{ label: "Signature Voyage", href: "#" },
				{ label: "Wellness Escape", href: "#" },
				{ label: "Curated Experiences", href: "#" },
			],
		},
		{
			title: "Indonesia Journal",
			links: [
				{ label: "Insights", href: "#" },
				{ label: "News & Events", href: "#" },
				{ label: "Side Projects", href: "#" },
			],
		},
		{
			title: "Portfolio",
			links: [
				{ label: "Milestone", href: "#" },
				{ label: "Gallery Events", href: "#" },
				{ label: "Sustainable Impact", href: "#" },
				{ label: "Community Impact", href: "#" },
			],
		},
		{
			title: "Let's Connected",
			links: [
				{ label: "INQUIRY", href: "#" },
				{ label: "CAREER", href: "#" },
			],
		},
	];
}
