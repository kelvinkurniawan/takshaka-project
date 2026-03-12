import { getDB } from "@/lib/db";
import { galleryOfWorks, galleryCategories } from "@/lib/schema";
import { eq, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Get all categories with item counts
export async function GET(request: Request, context: any) {
	try {
		const db = getDB();
		const url = new URL(request.url);
		const categorySlug = url.searchParams.get("category");

		// Get categories
		const allCategories = await db
			.select()
			.from(galleryCategories)
			.where(isNull(galleryCategories.deletedAt))
			.orderBy(galleryCategories.displayOrder);

		// Get all items
		let query = db
			.select()
			.from(galleryOfWorks)
			.where(isNull(galleryOfWorks.deletedAt));

		if (categorySlug) {
			// Find category by slug
			const cat = allCategories.find((c: any) => c.slug === categorySlug);
			if (cat) {
				query = query.where(eq(galleryOfWorks.categoryId, cat.id));
			}
		}

		const items = await query.orderBy(galleryOfWorks.displayOrder);

		return NextResponse.json({
			categories: allCategories,
			items: items,
		});
	} catch (error) {
		console.error("Failed to fetch gallery:", error);
		return NextResponse.json(
			{ error: "Failed to fetch gallery" },
			{ status: 500 },
		);
	}
}
