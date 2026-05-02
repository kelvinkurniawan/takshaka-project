import Link from "next/link";
import { notFound } from "next/navigation";
import { getDB } from "@/lib/db";
import { pages } from "@/lib/schema";
import { eq, isNull, and } from "drizzle-orm";

interface Page {
	id: number;
	title: string;
	slug: string;
	content: string;
	metaTitle: string | null;
	metaDescription: string | null;
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
			.where(and(eq(pages.slug, slug), isNull(pages.deletedAt)))
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

export default async function DynamicPageLayout({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	// Skip static pages that have their own routes
	const staticRoutes = [
		"blog",
		"tentang",
		"our-inspiration",
		"hubungi",
		"prestige-event",
		"pages",
	];
	if (staticRoutes.includes(slug)) {
		notFound();
	}

	const page = await getPage(slug);

	if (!page) {
		notFound();
	}

	return (
		<>
			{/* Hero Header */}
			<section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-white via-white to-[#fff8f5]">
				{/* Navigation */}
				<div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-4 sm:px-6 lg:px-8 py-6">
					<Link
						href="/"
						prefetch={false}
						className="text-primary font-semibold hover:underline transition"
					>
						← Kembali
					</Link>
					<img src="/images/logo.png" alt="Logo" className="h-16 w-auto" />
					<div className="w-20"></div>
				</div>

				{/* Content */}
				<div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl pt-12">
					<h1 className="text-4xl sm:text-5xl md:text-6xl font-elegance uppercase leading-tight tracking-widest text-gray-900 mb-4">
						{page.title}
					</h1>

					{page.metaDescription && (
						<p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 font-light leading-relaxed max-w-3xl mx-auto">
							{page.metaDescription}
						</p>
					)}

					{/* Divider */}
					<div className="flex justify-center mb-8">
						<div className="w-16 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
					</div>
				</div>
			</section>

			{/* Main Content */}
			<article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
				{/* Content */}
				<div
					className="prose prose-lg max-w-none mb-12"
					dangerouslySetInnerHTML={{ __html: page.content }}
				/>

				{/* Footer */}
				<div className="pt-8 border-t">
					<Link
						href="/"
						prefetch={false}
						className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
					>
						← Kembali ke Beranda
					</Link>
				</div>
			</article>
		</>
	);
}
