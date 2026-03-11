import { getDB } from "@/lib/db";
import { categories, users, contents } from "@/lib/schema";
import { eq } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";
import ContentForm from "@/app/components/dashboard/content/ContentForm";
import Link from "next/link";
import type { Metadata } from "next";

type Category = InferSelectModel<typeof categories>;
type User = InferSelectModel<typeof users>;
type Content = InferSelectModel<typeof contents>;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;

	try {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const db = getDB();
		const contentId = parseInt(id);

		if (isNaN(contentId)) {
			return {
				title: "Edit Content",
				description: "Edit content article",
			};
		}

		const [content] = await db
			.select()
			.from(contents)
			.where(eq(contents.id, contentId))
			.limit(1);

		if (content) {
			return {
				title: `Edit: ${content.title}`,
				description: `Edit content: ${content.title}`,
			};
		}
	} catch (error) {
		console.error("Error generating metadata:", error);
	}

	return {
		title: "Edit Content",
		description: "Edit content article",
	};
}

export default async function EditContentPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const db = getDB();
	const contentId = parseInt(id);

	if (isNaN(contentId)) {
		return (
			<div className="text-red-500 dark:text-red-400">
				ID konten tidak valid
			</div>
		);
	}

	let content: Content | null = null;
	let activeCategories: Category[] = [];
	let allUsers: User[] = [];
	let error: Error | null = null;

	try {
		const contentResult = await db
			.select()
			.from(contents)
			.where(eq(contents.id, contentId));

		content = contentResult[0] || null;

		if (!content || content.deletedAt !== null) {
			content = null;
		} else {
			const allCategories = await db.select().from(categories);
			allUsers = await db.select().from(users);

			activeCategories = allCategories.filter(
				(item: Category) => item.deletedAt === null,
			);
		}
	} catch (err) {
		console.error("Error fetching data:", err);
		error = err instanceof Error ? err : new Error("Unknown error");
	}

	if (error) {
		return (
			<div className="text-red-500 dark:text-red-400">Gagal memuat halaman</div>
		);
	}

	if (!content) {
		return (
			<div className="text-red-500 dark:text-red-400">
				Konten tidak ditemukan
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-[#e5e5e5]">
						Edit Konten
					</h1>
					<p className="text-secondary dark:text-[#929292] mt-1">
						{content.title}
					</p>
				</div>
				<Link
					href="/app/content"
					className="px-4 py-2 bg-gray-300 dark:bg-[#424242] text-gray-900 dark:text-[#e5e5e5] rounded-lg hover:bg-gray-400 dark:hover:bg-[#525252] transition-colors"
				>
					← Kembali
				</Link>
			</div>

			<div className="px-4">
				<ContentForm
					initialCategories={activeCategories}
					initialUsers={allUsers}
					initialContent={{
						...content,
						excerpt: content.excerpt || undefined,
						featuredImage: content.featuredImage || undefined,
						status: content.status || undefined,
						publishedAt: content.publishedAt || undefined,
						scheduledAt: content.scheduledAt || undefined,
						metaTitle: content.metaTitle || undefined,
						metaDescription: content.metaDescription || undefined,
						metaKeywords: content.metaKeywords || undefined,
						canonicalUrl: content.canonicalUrl || undefined,
						robots: content.robots || undefined,
						ogTitle: content.ogTitle || undefined,
						ogDescription: content.ogDescription || undefined,
						ogImage: content.ogImage || undefined,
					}}
					isEditing={true}
				/>
			</div>
		</div>
	);
}
