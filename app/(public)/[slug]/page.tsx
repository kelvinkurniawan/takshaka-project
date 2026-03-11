import Link from "next/link";
import { notFound } from "next/navigation";

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
		// Use absolute URL with environment variable
		const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
		const response = await fetch(`${baseUrl}/api/public/pages/${slug}`, {
			next: { revalidate: 3600 },
		});
		if (!response.ok) return null;
		return response.json();
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
