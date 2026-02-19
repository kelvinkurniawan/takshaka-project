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
					/>
				</div>
			)}

			{/* Article Content */}
			<article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
				{/* Header */}
				<header className="mb-8">
					<Link
						href="/blog"
						className="text-primary font-semibold hover:underline mb-4 inline-block"
					>
						← Kembali ke Blog
					</Link>

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
							).toLocaleDateString("id-ID", {
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

				{/* Footer */}
				<div className="pt-8 border-t">
					<Link
						href="/blog"
						className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
					>
						← Kembali ke Blog
					</Link>
				</div>
			</article>

			{/* Related Articles */}
			<section className="bg-gray-50 py-12 mt-12">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<h2 className="text-3xl font-bold mb-8">Artikel Lainnya</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{/* Placeholder for related articles */}
						<div className="text-center text-gray-600 col-span-full">
							<Link
								href="/blog"
								className="text-primary font-semibold hover:underline"
							>
								Lihat semua artikel
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Comments Section */}
			<CommentsList contentId={content.id} />
		</>
	);
}
