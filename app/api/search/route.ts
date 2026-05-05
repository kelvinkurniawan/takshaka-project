import { z } from "zod";
import { getDB } from "@/lib/db";
import { contents, pages } from "@/lib/schema";
import { eq, isNull, or, ilike, and } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const searchSchema = z.object({
	q: z.string().min(1, "Search query is required").max(255),
});

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const query = searchParams.get("q");

		if (!query) {
			return Response.json(
				{ error: "Search query (q) is required" },
				{ status: 400 },
			);
		}

		const validatedData = searchSchema.parse({ q: query });
		const searchTerm = `%${validatedData.q}%`;

		const db = getDB(process.env);

		// Search in contents (articles, news, etc)
		const contentResults = await db
			.select({
				id: contents.id,
				title: contents.title,
				slug: contents.slug,
				excerpt: contents.excerpt,
				content: contents.content,
				type: contents.type,
				featuredImage: contents.featuredImage,
				publishedAt: contents.publishedAt,
				createdAt: contents.createdAt,
				resultType: () => "content",
			})
			.from(contents)
			.where(
				and(
					eq(contents.status, "published"),
					isNull(contents.deletedAt),
					or(
						ilike(contents.title, searchTerm),
						ilike(contents.excerpt, searchTerm),
						ilike(contents.content, searchTerm),
						ilike(contents.slug, searchTerm),
					),
				),
			)
			.limit(10);

		// Search in pages
		const pageResults = await db
			.select({
				id: pages.id,
				title: pages.title,
				slug: pages.slug,
				content: pages.content,
				publishedAt: pages.publishedAt,
				createdAt: pages.createdAt,
				resultType: () => "page",
			})
			.from(pages)
			.where(
				and(
					eq(pages.status, "published"),
					isNull(pages.deletedAt),
					or(
						ilike(pages.title, searchTerm),
						ilike(pages.slug, searchTerm),
						ilike(pages.content, searchTerm),
					),
				),
			)
			.limit(10);

		// Combine and deduplicate results
		const allResults = [
			...contentResults.map((item: typeof contentResults[0]) => ({
				...item,
				resultType: "content",
			})),
			...pageResults.map((item: typeof pageResults[0]) => ({
				...item,
				resultType: "page",
			})),
		];

		return Response.json({
			success: true,
			query: validatedData.q,
			total: allResults.length,
			contentCount: contentResults.length,
			pageCount: pageResults.length,
			results: allResults,
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			return Response.json(
				{ error: "Validation failed", details: error.errors },
				{ status: 400 },
			);
		}

		console.error("Search error:", error);
		return Response.json(
			{ error: "Failed to perform search" },
			{ status: 500 },
		);
	}
}
