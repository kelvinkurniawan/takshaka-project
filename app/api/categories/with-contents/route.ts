import { getDB } from "@/lib/db";
import { categories, contents } from "@/lib/schema";
import { eq, isNull, and, SQLWrapper } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET(request: Request) {
	try {
		const db = getDB();
		const url = new URL(request.url);
		const categoryIds = url.searchParams.getAll("categoryIds");

		// Get all active categories with their contents
		const categoriesData = await db
			.select({
				id: categories.id,
				name: categories.name,
				slug: categories.slug,
				description: categories.description,
			})
			.from(categories)
			.where(isNull(categories.deletedAt));

		// For each category, get its published contents
		const categoriesWithContents = await Promise.all(
			categoriesData.map(async (category: { id: number | SQLWrapper }) => {
				const categoryContents = await db
					.select({
						id: contents.id,
						title: contents.title,
						excerpt: contents.excerpt,
						featuredImage: contents.featuredImage,
						slug: contents.slug,
					})
					.from(contents)
					.where(
						and(
							eq(contents.categoryId, category.id),
							eq(contents.status, "published"),
							isNull(contents.deletedAt),
						),
					);

				return {
					...category,
					contents: categoryContents,
				};
			}),
		);

		return Response.json(categoriesWithContents);
	} catch (error) {
		console.error("Error fetching categories with contents:", error);
		return Response.json(
			{ error: "Failed to fetch categories and contents" },
			{ status: 500 },
		);
	}
}
