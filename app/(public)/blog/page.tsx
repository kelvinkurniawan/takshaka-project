import BlogClient from "./blog-client";
import { getFooterSections } from "@/lib/page-helpers";

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
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/public/contents`,
			{ next: { revalidate: 60 } },
		);
		if (!response.ok) return [];
		return response.json();
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
	const [contents, footerSections] = await Promise.all([
		getContents(),
		getFooterSections(),
	]);

	return <BlogClient contents={contents} footerSections={footerSections} />;
}
