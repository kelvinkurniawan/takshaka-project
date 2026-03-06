import PublicHeader from "@/components/PublicHeader";
import OptimizedImage from "@/components/OptimizedImage";
import { getDB } from "@/lib/db";
import { navigation as navigationTable } from "@/lib/schema";
import { isNull, asc } from "drizzle-orm";
import {
	HeroSection,
	NavigationMenu,
	FeaturedSection,
	ThreeItemSection,
	SectionItem,
	ImagesSection,
	CuratedExperiencesSection,
	ExperiencesSharedSection,
	SustainableImpactSection,
	Footer,
} from "@/components/sections";

interface Settings {
	index_page?: string;
	hero_title?: string;
	hero_description?: string;
	hero_image?: string;
	show_articles?: string;
	[key: string]: string | undefined;
}

interface Page {
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

interface NavigationItem {
	id: number;
	label: string;
	url: string;
	parentId: number | null;
	order: number;
	icon: string | null;
	target: string;
	isActive: boolean;
	children?: NavigationItem[];
}

interface Content {
	id: number;
	title: string;
	slug: string;
	excerpt?: string;
	featuredImage?: string;
	publishedAt?: string;
	createdAt: string;
	type?: string;
	status?: string;
}

interface CarouselItem {
	id: string;
	media: string;
	title?: string;
	subtitle?: string;
	link?: string;
}

interface ColumnContent {
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

interface Block {
	id: string;
	columns: number;
	content: ColumnContent[];
	customCSS?: string;
}

interface PageContent {
	blocks: Block[];
}

async function getSettings(): Promise<Settings> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/public/settings`,
			{ next: { revalidate: 3600 } },
		);
		if (!response.ok) return {};
		return response.json();
	} catch (error) {
		console.error("Failed to fetch settings:", error);
		return {};
	}
}

async function getNavigation(): Promise<NavigationItem[]> {
	try {
		const db = getDB();
		const items = await db
			.select()
			.from(navigationTable)
			.where(isNull(navigationTable.deletedAt))
			.orderBy(asc(navigationTable.order), asc(navigationTable.id));

		// Build nested structure
		const buildTree = (
			items: NavigationItem[],
			parentId: number | null = null,
		): NavigationItem[] => {
			return items
				.filter((item) => item.parentId === parentId)
				.map((item) => ({
					...item,
					children: buildTree(items, item.id),
				}))
				.sort((a, b) => a.order - b.order);
		};

		return buildTree(items);
	} catch (error) {
		console.error("Error fetching navigation:", error);
		return [];
	}
}

async function getPageById(pageId: number): Promise<Page | null> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/public/pages`,
			{ next: { revalidate: 3600 } },
		);
		if (!response.ok) return null;
		const pages: Page[] = await response.json();
		return pages.find((page) => page.id === pageId) || null;
	} catch (error) {
		console.error("Failed to fetch page:", error);
		return null;
	}
}

// Render carousel items
function renderCarousel(
	carousel: ColumnContent["carouselProps"],
): React.ReactNode {
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

// Render column content based on type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderColumnContent(column: ColumnContent): any {
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
			return renderCarousel(column.carouselProps);

		default:
			return null;
	}
}

// Render a block with its columns
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderBlock(block: Block): any {
	const gridColsClass =
		{
			1: "grid-cols-1",
			2: "grid-cols-1 md:grid-cols-2",
			3: "grid-cols-1 md:grid-cols-3",
			4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
		}[block.columns] || "grid-cols-1";

	return (
		<div
			key={block.id}
			className={`grid ${gridColsClass} gap-6`}
			style={block.customCSS ? { ...parseCustomCSS(block.customCSS) } : {}}
		>
			{block.content.map((column) => (
				<div key={column.id} className="flex flex-col">
					{renderColumnContent(column)}
				</div>
			))}
		</div>
	);
}

// Parse custom CSS string to inline styles
function parseCustomCSS(cssString: string) {
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

// Render entire page from parsed JSON content
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderPageContent(pageContent: string): any {
	try {
		const parsed: PageContent = JSON.parse(pageContent);
		const blocks = parsed.blocks || [];

		return (
			<div className="space-y-12">
				{blocks.map((block) => renderBlock(block))}
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

export default async function Home() {
	const [settings] = await Promise.all([getSettings()]);

	// Check if index_page is set
	const indexPageId = settings?.index_page
		? parseInt(settings.index_page, 10)
		: null;
	let indexPage: Page | null = null;

	if (indexPageId && !isNaN(indexPageId)) {
		indexPage = await getPageById(indexPageId);
	}

	// If index page is set and found, render it
	if (indexPage) {
		return (
			<>
				<PublicHeader />
				<div className="public-light flex flex-col min-h-screen bg-white text-gray-900">
					<main className="flex-1">
						<div className="min-h-screen">
							<article
								data-aos="fade-up"
								data-aos-duration="800"
								className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12"
							>
								<div className="index-page-content">
									{renderPageContent(indexPage.content)}
								</div>
							</article>
						</div>
					</main>
				</div>
			</>
		);
	}

	// Default - render new homepage with slideshow and navigation from database
	const heroTitle = settings?.hero_title || "SIGNATURE VOYAGE";
	const heroDescription =
		settings?.hero_description ||
		"Our Curated Travel Experience with Meaningful Impact";

	return (
		<>
			<PublicHeader />
			<div className="public-light flex flex-col min-h-screen bg-white text-gray-900 overflow-x-hidden">
				<main className="flex-1">
					{/* Hero Section with Background Image */}
					<div data-aos="fade-up" data-aos-duration="900" data-aos-offset="200">
						<HeroSection
							title={heroTitle}
							description={heroDescription}
							backgroundImage={settings?.hero_image}
						/>
					</div>
					{/* New Section with 3 Items */}
					<div
						data-aos="fade-right"
						data-aos-delay="100"
						data-aos-duration="800"
					>
						<ThreeItemSection />
					</div>
					{/* Images Section with Full Width */}
					<div
						data-aos="fade-left"
						data-aos-delay="200"
						data-aos-duration="800"
					>
						<ImagesSection
							images={[
								{
									src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80",
									alt: "Indonesian cultural heritage",
								},
								{
									src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80",
									alt: "Indonesian traditions and arts",
								},
								{
									src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80",
									alt: "Indonesian immersive experiences",
								},
							]}
							description="A curated collection of Indonesia's most inspiring destinations and immersive experiences. From cultural heritage and gastronomy to marine exploration, wildlife, and adventure, each journey is thoughtfully designed to reveal the richness of Indonesia while creating meaningful and memorable moments."
						/>
					</div>
					{/* Curated Experiences Section with Tabs */}
					<div
						data-aos="fade-right"
						data-aos-delay="300"
						data-aos-duration="800"
					>
						<CuratedExperiencesSection tabs={getExperienceTabs()} />
					</div>
					{/* Experiences Shared Section */}
					<div
						data-aos="fade-left"
						data-aos-delay="400"
						data-aos-duration="800"
					>
						<ExperiencesSharedSection experiences={getSharedExperiences()} />
					</div>
					{/* Sustainable Impact Section */}
					<div
						data-aos="fade-right"
						data-aos-delay="500"
						data-aos-duration="800"
					>
						<SustainableImpactSection
							title="SUSTAINABLE IMPACT"
							subtitle="Our Commitment to Environment & Communities"
							buttonText="SEE OUR IMPACT"
							backgroundImage="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=80"
						/>
					</div>
				</main>
			</div>

			{/* Footer */}
			<Footer
				sections={getFooterSections()}
				copyright="Copyright 2026. Takshaka Event & Experience"
			/>
		</>
	);
}

/**
 * Helper functions to organize content data
 */

function getExperienceTabs() {
	return [
		{
			id: "cultural-heritage",
			label: "CULTURAL HERITAGE",
			items: [
				{
					id: "1",
					title: "Bali Ancient Culture",
					description:
						"An exclusive journey timeless heritage and sacred traditions.",
					image:
						"https://images.unsplash.com/photo-1537225228614-b19960110871?w=800&q=80",
				},
				{
					id: "2",
					title: "Papua Ancient Culture",
					description:
						"An exclusive journey timeless heritage and sacred traditions.",
					image:
						"https://images.unsplash.com/photo-1548013146-72d72c85fd0d?w=800&q=80",
				},
				{
					id: "3",
					title: "Yogyakarta Ancient Culture",
					description:
						"An exclusive journey timeless heritage and sacred traditions.",
					image:
						"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
				},
				{
					id: "4",
					title: "Borneo Ancient Culture",
					description:
						"An exclusive journey timeless heritage and sacred traditions.",
					image:
						"https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
				},
			],
		},
		{
			id: "gastronomy",
			label: "GASTRONOMY",
			items: [
				{
					id: "5",
					title: "Java Culinary Journey",
					description:
						"Taste authentic flavors and learn traditional cooking methods.",
					image:
						"https://images.unsplash.com/photo-1504674900306-873dddd74b1f?w=800&q=80",
				},
				{
					id: "6",
					title: "Bali Food Culture",
					description: "Discover the essence of Balinese culinary traditions.",
					image:
						"https://images.unsplash.com/photo-1537225228614-b19960110871?w=800&q=80",
				},
				{
					id: "7",
					title: "Sumatra Spices",
					description: "Explore the aromatic spice routes of Sumatra.",
					image:
						"https://images.unsplash.com/photo-1548013146-72d72c85fd0d?w=800&q=80",
				},
				{
					id: "8",
					title: "Street Food Adventure",
					description: "Experience the vibrant street food culture.",
					image:
						"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
				},
			],
		},
		{
			id: "sea-marine",
			label: "SEA & MARINE",
			items: [
				{
					id: "9",
					title: "Raja Ampat Diving",
					description:
						"Dive into the world's most biodiverse marine ecosystem.",
					image:
						"https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80",
				},
				{
					id: "10",
					title: "Coral Triangle",
					description: "Explore the heart of marine biodiversity.",
					image:
						"https://images.unsplash.com/photo-1504674900306-873dddd74b1f?w=800&q=80",
				},
				{
					id: "11",
					title: "Island Hopping",
					description: "Discover pristine islands and hidden beaches.",
					image:
						"https://images.unsplash.com/photo-1537225228614-b19960110871?w=800&q=80",
				},
				{
					id: "12",
					title: "Underwater Photography",
					description: "Capture the beauty of Indonesia's marine life.",
					image:
						"https://images.unsplash.com/photo-1548013146-72d72c85fd0d?w=800&q=80",
				},
			],
		},
		{
			id: "wildlife",
			label: "WILDLIFE",
			items: [
				{
					id: "13",
					title: "Komodo Dragons",
					description: "Get close with the world's largest living lizards.",
					image:
						"https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
				},
				{
					id: "14",
					title: "Orangutan Sanctuary",
					description: "Meet Indonesia's most iconic apes.",
					image:
						"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
				},
				{
					id: "15",
					title: "Bird Watching",
					description:
						"Discover tropical bird species in their natural habitat.",
					image:
						"https://images.unsplash.com/photo-1537225228614-b19960110871?w=800&q=80",
				},
				{
					id: "16",
					title: "Marine Turtles",
					description: "Witness the incredible turtle nesting season.",
					image:
						"https://images.unsplash.com/photo-1504674900306-873dddd74b1f?w=800&q=80",
				},
			],
		},
		{
			id: "adventure",
			label: "ADVENTURE",
			items: [
				{
					id: "17",
					title: "Mount Climbing",
					description: "Conquer Indonesia's majestic mountain peaks.",
					image:
						"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
				},
				{
					id: "18",
					title: "Jungle Trekking",
					description:
						"Trek through dense rainforests and discover hidden waterfalls.",
					image:
						"https://images.unsplash.com/photo-1548013146-72d72c85fd0d?w=800&q=80",
				},
				{
					id: "19",
					title: "White Water Rafting",
					description: "Experience adrenaline-pumping rapids.",
					image:
						"https://images.unsplash.com/photo-1537225228614-b19960110871?w=800&q=80",
				},
				{
					id: "20",
					title: "Rock Climbing",
					description: "Scale the rock formations of Indonesia.",
					image:
						"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
				},
			],
		},
	];
}

function getSharedExperiences() {
	return [
		{
			id: "1",
			title: "YACHT BALI",
			description:
				'"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu condimentum arcu, a fermentum magna. Donec rutrum quis massa sit amet viverra. Integer pretium nunc ut diam tempus feugiat."',
			image:
				"https://images.unsplash.com/photo-1537225228614-b19960110871?w=800&q=80",
		},
		{
			id: "2",
			title: "GRAND CANYON",
			description:
				'"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu condimentum arcu, a fermentum magna. Donec rutrum quis massa sit amet viverra. Integer pretium nunc ut diam tempus feugiat."',
			image:
				"https://images.unsplash.com/photo-1548013146-72d72c85fd0d?w=800&q=80",
		},
		{
			id: "3",
			title: "PHI PHI ISLAND",
			description:
				'"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu condimentum arcu, a fermentum magna. Donec rutrum quis massa sit amet viverra. Integer pretium nunc ut diam tempus feugiat."',
			image:
				"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
		},
	];
}

function getFooterSections() {
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
