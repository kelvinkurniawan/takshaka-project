import { getDB } from "@/lib/db";
import { galleryCategories, galleryOfWorks } from "@/lib/schema";
import { isNull } from "drizzle-orm";
import GalleryOfWorksClient from "@/app/components/dashboard/gallery/GalleryOfWorksClient";
import type { Metadata } from "next";
import type { InferSelectModel } from "drizzle-orm";

type Category = InferSelectModel<typeof galleryCategories>;
type GalleryItem = InferSelectModel<typeof galleryOfWorks>;

export const metadata: Metadata = {
	title: "Gallery of Works",
	description: "Manage gallery categories and items",
};

export default async function GalleryOfWorksPage() {
	const db = getDB();

	let categories: Category[] = [];
	let items: GalleryItem[] = [];
	let error: Error | null = null;

	try {
		const allCategories = await db
			.select()
			.from(galleryCategories)
			.where(isNull(galleryCategories.deletedAt));

		const allItems = await db
			.select()
			.from(galleryOfWorks)
			.where(isNull(galleryOfWorks.deletedAt));

		categories = allCategories as Category[];
		items = allItems as GalleryItem[];
	} catch (err) {
		console.error("Error fetching gallery data:", err);
		error = err instanceof Error ? err : new Error("Unknown error");
	}

	if (error) {
		return (
			<div className="text-red-500 dark:text-red-400">
				Failed to load gallery data
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-gray-900 dark:text-[#e5e5e5]">
					Gallery of Works
				</h1>
				<p className="text-secondary dark:text-[#929292] mt-1">
					Manage portfolio categories and items
				</p>
			</div>

			<GalleryOfWorksClient
				initialCategories={categories}
				initialItems={items}
			/>
		</div>
	);
}
