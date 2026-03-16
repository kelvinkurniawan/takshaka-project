/**
 * Structured Data Helper Functions
 * Generates JSON-LD schema for better SEO
 */

export interface StructuredDataConfig {
	baseUrl: string;
	siteName: string;
	siteDescription: string;
	siteImage?: string;
	logoUrl?: string;
	email?: string;
	phone?: string;
	socialProfiles?: string[];
	address?: {
		streetAddress?: string;
		addressLocality?: string;
		addressRegion?: string;
		postalCode?: string;
		addressCountry?: string;
	};
}

/**
 * Generate Organization Schema
 */
export function generateOrganizationSchema(config: StructuredDataConfig) {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: config.siteName,
		description: config.siteDescription,
		url: config.baseUrl,
		logo: config.logoUrl || `${config.baseUrl}/logo.png`,
		image: config.siteImage,
		email: config.email,
		telephone: config.phone,
		sameAs: config.socialProfiles || [],
		address: config.address
			? {
					"@type": "PostalAddress",
					streetAddress: config.address.streetAddress,
					addressLocality: config.address.addressLocality,
					addressRegion: config.address.addressRegion,
					postalCode: config.address.postalCode,
					addressCountry: config.address.addressCountry,
				}
			: undefined,
	};
}

/**
 * Generate Website Schema with Search Action
 */
export function generateWebsiteSchema(config: StructuredDataConfig) {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: config.siteName,
		url: config.baseUrl,
		description: config.siteDescription,
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${config.baseUrl}/search?q={search_term_string}`,
			},
			query_input: "required name=search_term_string",
		},
	};
}

/**
 * Generate BreadcrumbList Schema
 */
export interface BreadcrumbItem {
	name: string;
	url: string;
}

export function generateBreadcrumbSchema(
	items: BreadcrumbItem[],
	baseUrl: string,
) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
		})),
	};
}

/**
 * Generate BlogPosting Schema
 */
export interface BlogPostingConfig {
	title: string;
	description: string;
	content?: string;
	image?: string;
	author?: {
		name: string;
		url?: string;
	};
	datePublished: Date;
	dateModified?: Date;
	url: string;
	keywords?: string[];
}

export function generateBlogPostingSchema(config: BlogPostingConfig) {
	return {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: config.title,
		description: config.description,
		articleBody: config.content,
		image: config.image,
		datePublished: config.datePublished.toISOString(),
		dateModified: (config.dateModified || config.datePublished).toISOString(),
		author: config.author
			? {
					"@type": "Person",
					name: config.author.name,
					url: config.author.url,
				}
			: undefined,
		keywords: config.keywords?.join(", "),
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": config.url,
		},
	};
}

/**
 * Generate Article Schema (for news/articles)
 */
export interface ArticleConfig {
	headline: string;
	description: string;
	content?: string;
	image?: string;
	author?: {
		name: string;
		url?: string;
	};
	datePublished: Date;
	dateModified?: Date;
	url: string;
	publisher?: {
		name: string;
		logo?: string;
	};
	keywords?: string[];
}

export function generateArticleSchema(config: ArticleConfig) {
	return {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: config.headline,
		description: config.description,
		articleBody: config.content,
		image: [config.image || ""],
		datePublished: config.datePublished.toISOString(),
		dateModified: (config.dateModified || config.datePublished).toISOString(),
		author: config.author
			? {
					"@type": "Person",
					name: config.author.name,
					url: config.author.url,
				}
			: undefined,
		publisher: config.publisher
			? {
					"@type": "Organization",
					name: config.publisher.name,
					logo: {
						"@type": "ImageObject",
						url: config.publisher.logo || "",
					},
				}
			: undefined,
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": config.url,
		},
	};
}

/**
 * Generate FAQPage Schema
 */
export interface FAQItem {
	question: string;
	answer: string;
}

export function generateFAQPageSchema(items: FAQItem[]) {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: items.map((item) => ({
			"@type": "Question",
			name: item.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: item.answer,
			},
		})),
	};
}

/**
 * Generate LocalBusiness Schema
 */
export interface LocalBusinessConfig {
	name: string;
	description: string;
	type: string; // e.g., "Restaurant", "Hotel", "Shop"
	image?: string;
	url: string;
	phone?: string;
	email?: string;
	address: {
		streetAddress: string;
		addressLocality: string;
		addressRegion: string;
		postalCode: string;
		addressCountry: string;
	};
	priceRange?: string;
	openingHours?: {
		day: string;
		opens: string;
		closes: string;
	}[];
	rating?: {
		ratingValue: number;
		reviewCount: number;
	};
}

export function generateLocalBusinessSchema(config: LocalBusinessConfig) {
	return {
		"@context": "https://schema.org",
		"@type": config.type,
		name: config.name,
		description: config.description,
		image: config.image,
		url: config.url,
		telephone: config.phone,
		email: config.email,
		address: {
			"@type": "PostalAddress",
			streetAddress: config.address.streetAddress,
			addressLocality: config.address.addressLocality,
			addressRegion: config.address.addressRegion,
			postalCode: config.address.postalCode,
			addressCountry: config.address.addressCountry,
		},
		priceRange: config.priceRange,
		openingHoursSpecification: config.openingHours?.map((hours) => ({
			"@type": "OpeningHoursSpecification",
			dayOfWeek: hours.day,
			opens: hours.opens,
			closes: hours.closes,
		})),
		aggregateRating: config.rating
			? {
					"@type": "AggregateRating",
					ratingValue: config.rating.ratingValue,
					reviewCount: config.rating.reviewCount,
				}
			: undefined,
	};
}

/**
 * Generate Product Schema
 */
export interface ProductConfig {
	name: string;
	description: string;
	image?: string;
	url: string;
	price?: number;
	currency?: string;
	availability?: "OutOfStock" | "InStock" | "PreOrder";
	rating?: {
		ratingValue: number;
		reviewCount: number;
	};
}

export function generateProductSchema(config: ProductConfig) {
	return {
		"@context": "https://schema.org",
		"@type": "Product",
		name: config.name,
		description: config.description,
		image: config.image,
		url: config.url,
		offers: config.price
			? {
					"@type": "Offer",
					price: config.price,
					priceCurrency: config.currency || "USD",
					availability: config.availability
						? `https://schema.org/${config.availability}`
						: "https://schema.org/InStock",
				}
			: undefined,
		aggregateRating: config.rating
			? {
					"@type": "AggregateRating",
					ratingValue: config.rating.ratingValue,
					reviewCount: config.rating.reviewCount,
				}
			: undefined,
	};
}

/**
 * Helper function to remove undefined properties
 */
export function cleanSchema(obj: any): any {
	if (Array.isArray(obj)) {
		return obj.map(cleanSchema).filter(Boolean);
	}

	if (obj !== null && typeof obj === "object") {
		return Object.keys(obj).reduce((result, key) => {
			const value = obj[key];
			if (value !== undefined) {
				result[key] = cleanSchema(value);
			}
			return result;
		}, {} as any);
	}

	return obj;
}
