import Link from "next/link";
import { notFound } from "next/navigation";
import { getDB } from "@/lib/db";
import { pages } from "@/lib/schema";
import { eq, isNull } from "drizzle-orm";

interface Page {
	id: number;
	title: string;
	slug: string;
	content: string;
	metaTitle?: string;
	metaDescription?: string;
}

async function getPage(slug: string): Promise<Page | null> {
	try {
		const db = getDB(process.env);
		const page = await db
			.select({
				id: pages.id,
				title: pages.title,
				slug: pages.slug,
				content: pages.content,
				metaTitle: pages.metaTitle,
				metaDescription: pages.metaDescription,
			})
			.from(pages)
			.where(eq(pages.slug, slug), isNull(pages.deletedAt))
			.limit(1);

		return page.length > 0 ? page[0] : null;
	} catch (error) {
		console.error("Failed to fetch page:", error);
		return null;
	}
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const page = await getPage(slug);

	if (!page) {
		return {
			title: "Halaman Tidak Ditemukan",
		};
	}

	return {
		title: page.metaTitle || page.title,
		description: page.metaDescription,
	};
}

export default async function PublicPageDetail({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const page = await getPage(slug);

	if (!page) {
		notFound();
	}

	return (
		<article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
			{/* Header */}
			<header className="mb-12">
				<Link
					href="/"
					className="text-primary font-semibold hover:underline mb-4 inline-block"
				>
					← Kembali ke Beranda
				</Link>

				<h1 className="text-5xl font-bold mb-4">{page.title}</h1>

				{page.metaDescription && (
					<p className="text-xl text-gray-600">{page.metaDescription}</p>
				)}
			</header>

			{/* Content */}
			<div
				className="prose prose-lg max-w-none mb-12"
				dangerouslySetInnerHTML={{ __html: page.content }}
			/>

			{/* Footer */}
			<div className="pt-8 border-t">
				<Link
					href="/"
					className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
				>
					← Kembali ke Beranda
				</Link>
			</div>
		</article>
	);
}
