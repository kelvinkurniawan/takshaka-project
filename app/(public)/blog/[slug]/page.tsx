import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CommentsList from "@/components/CommentsList";

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
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/public/contents/${slug}`,
			{ next: { revalidate: 3600 } },
		);
		if (!response.ok) return null;
		return response.json();
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
		<>
			{/* Featured Image */}
			{content.featuredImage && (
				<div className="w-full h-96 bg-gray-200 overflow-hidden relative">
					<Image
						src={content.featuredImage}
						alt={content.title}
						fill
						className="object-cover"
						unoptimized
					/>
				</div>
			)}

			{/* Article Content */}
			<article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
				{/* Header */}
				<header className="mb-8">
					{content.type && (
						<div className="mb-4">
							<span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
								{content.type}
							</span>
						</div>
					)}

					<h1 className="text-5xl font-bold mb-4">{content.title}</h1>

					<div className="flex items-center gap-4 text-gray-600 pb-8 border-b">
						<time dateTime={content.publishedAt || content.createdAt}>
							{new Date(
								content.publishedAt || content.createdAt,
							).toLocaleDateString("en-US", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</time>
					</div>
				</header>

				{/* Excerpt */}
				{content.excerpt && (
					<div className="text-xl text-gray-600 mb-8 italic">
						{content.excerpt}
					</div>
				)}

				{/* Content */}
				<div
					className="prose prose-lg max-w-none mb-12"
					dangerouslySetInnerHTML={{ __html: content.content }}
				/>
			</article>

			{/* Comments Section */}
			<CommentsList contentId={content.id} />
		</>
	);
}
