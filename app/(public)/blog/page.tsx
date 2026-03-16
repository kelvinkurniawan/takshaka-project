import BlogClient from "./blog-client";
import { getFooterSections } from "@/lib/page-helpers";
import { getDB } from "@/lib/db";
import { contents } from "@/lib/schema";
import { eq, isNull, desc } from "drizzle-orm";

// Revalidate every 60 seconds for ISR (Incremental Static Regeneration)
export const revalidate = 60;

interface Content {
	id: number;
	title: string;
	slug: string;
	excerpt?: string;
	featuredImage?: string;
	publishedAt?: string;
	createdAt: string;
	type?: string;
}

async function getContents(): Promise<Content[]> {
	try {
		const db = getDB(process.env);
		const articles = await db
			.select({
				id: contents.id,
				title: contents.title,
				slug: contents.slug,
				excerpt: contents.excerpt,
				featuredImage: contents.featuredImage,
				publishedAt: contents.publishedAt,
				createdAt: contents.createdAt,
				type: contents.type,
			})
			.from(contents)
			.where(eq(contents.status, "published"), isNull(contents.deletedAt))
			.orderBy(desc(contents.publishedAt || contents.createdAt))
			.limit(50);

		return articles;
	} catch (error) {
		console.error("Failed to fetch contents:", error);
		return [];
	}
}

export const metadata = {
	title: "Blog & Artikel - Takshaka CMS",
	description:
		"Pelajari tips, trik, dan berita terbaru tentang CMS modern, pengembangan web, dan transformasi digital",
};

export default async function BlogPage() {
	const [articles, footerSections] = await Promise.all([
		getContents(),
		getFooterSections(),
	]);

	return <BlogClient contents={articles} footerSections={footerSections} />;
}
