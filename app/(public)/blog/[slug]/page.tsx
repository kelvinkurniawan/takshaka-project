import Link from "next/link";
import { notFound } from "next/navigation";
import FeaturedImageSection from "@/components/FeaturedImageSection";
import HeroNavigation from "@/components/sections/HeroNavigation";
import { getDB } from "@/lib/db";
import { contents } from "@/lib/schema";
import { eq, isNull } from "drizzle-orm";
import { sanitizeRichText } from "@/lib/sanitize-html";

interface Content {
	id: number;
	title: string;
	slug: string;
	content: string;
	excerpt?: string;
	featuredImage?: string;
	publishedAt?: string;
	createdAt: string;
	type?: string;
	metaTitle?: string;
	metaDescription?: string;
	metaKeywords?: string;
}

async function getContent(slug: string): Promise<Content | null> {
	try {
		const db = getDB(process.env);
		const article = await db
			.select({
				id: contents.id,
				title: contents.title,
				slug: contents.slug,
				content: contents.content,
				excerpt: contents.excerpt,
				featuredImage: contents.featuredImage,
				publishedAt: contents.publishedAt,
				createdAt: contents.createdAt,
				type: contents.type,
				metaTitle: contents.metaTitle,
				metaDescription: contents.metaDescription,
				metaKeywords: contents.metaKeywords,
			})
			.from(contents)
			.where(
				eq(contents.slug, slug),
				eq(contents.status, "published"),
				isNull(contents.deletedAt),
			)
			.limit(1);

		return article.length > 0 ? article[0] : null;
	} catch (error) {
		console.error("Failed to fetch content:", error);
		return null;
	}
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const content = await getContent(slug);

	if (!content) {
		return {
			title: "Artikel Tidak Ditemukan",
		};
	}

	return {
		title: content.metaTitle || content.title,
		description: content.metaDescription || content.excerpt,
	};
}

export default async function BlogDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const content = await getContent(slug);

	if (!content) {
		notFound();
	}

	return (
		<div className="bg-[#f6f1e7]">
			{/* Hero Header */}
			<section className="relative min-h-[25vh] flex items-center justify-center overflow-hidden bg-[#f6f1e7]">
				{/* Navigation */}
				<HeroNavigation
					logo={
						<img
							src="/images/logo_colored.png"
							alt="Logo"
							className="h-24 w-auto"
						/>
					}
					isCompact
					textColor="text-black"
				/>
			</section>

			{/* Content */}
			<section className="flex items-center justify-center bg-[#f6f1e7]">
				<div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl pt-12">
					<h1 className="text-xl sm:text-xl md:text-xl font-elegance uppercase leading-tight tracking-widest text-gray-900 mb-6">
						{content.title}
					</h1>

					{/* Publish Date */}
					<div className="flex justify-center mb-8">
						<time
							dateTime={content.publishedAt || content.createdAt}
							className="text-lg text-[#A27C34] font-light"
						>
							{new Date(
								content.publishedAt || content.createdAt,
							).toLocaleDateString("id-ID", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</time>
					</div>
				</div>
			</section>

			{/* Featured Image */}
			{content.featuredImage && (
				<FeaturedImageSection src={content.featuredImage} alt={content.title} />
			)}

			{/* Article Content */}
			<article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 ">
				{/* Content */}
				<div
					className="prose prose-lg max-w-none mb-12"
					dangerouslySetInnerHTML={{ __html: sanitizeRichText(content.content) }}
				/>
			</article>
		</div>
	);
}
