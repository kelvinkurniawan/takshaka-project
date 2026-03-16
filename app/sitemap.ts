import { MetadataRoute } from "next";
import { getDB } from "@/lib/db";
import { pages, contents } from "@/lib/schema";
import { eq } from "drizzle-orm";

// Get base URL from environment
const getBaseUrl = () => {
	if (process.env.NEXT_PUBLIC_API_URL) {
		return process.env.NEXT_PUBLIC_API_URL;
	}
	// Fallback to localhost for development
	return "http://localhost:3000";
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = getBaseUrl();

	// Static routes with their priorities
	const staticRoutes: MetadataRoute.Sitemap = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1,
		},
		{
			url: `${baseUrl}/blog`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/faqs`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/contact-us`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/our-inspiration`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/prestige-event`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/signature-voyage`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/pages`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.7,
		},
	];

	try {
		// Initialize database for server component (development only)
		const db = getDB(process.env);

		// Fetch published pages from database
		const dbPages = await db
			.select()
			.from(pages)
			.where(eq(pages.status, "published"));

		const pagesSitemap: MetadataRoute.Sitemap = dbPages
			.filter((page: { deletedAt: any }) => !page.deletedAt)
			.map((page: { slug: any; updatedAt: any; publishedAt: any }) => ({
				url: `${baseUrl}/pages/${page.slug}`,
				lastModified: page.updatedAt || page.publishedAt || new Date(),
				changeFrequency: "monthly" as const,
				priority: 0.6,
			}));

		// Fetch published contents (blog posts, articles, etc.)
		const dbContents = await db
			.select()
			.from(contents)
			.where(eq(contents.status, "published"));

		const contentsSitemap: MetadataRoute.Sitemap = dbContents
			.filter((content: { deletedAt: any }) => !content.deletedAt)
			.map((content: { slug: any; updatedAt: any; publishedAt: any }) => ({
				url: `${baseUrl}/blog/${content.slug}`,
				lastModified: content.updatedAt || content.publishedAt || new Date(),
				changeFrequency: "weekly" as const,
				priority: 0.7,
			}));

		return [...staticRoutes, ...pagesSitemap, ...contentsSitemap];
	} catch (error) {
		console.error("Error generating sitemap:", error);
		// Return static routes if database fails
		return staticRoutes;
	}
}
