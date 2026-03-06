import { getDB } from "@/lib/db";
import { pageSections } from "@/lib/schema";
import { eq, and, isNull } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * GET /api/public/page-sections?slug=home - Get page section by slug (public access)
 */
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const slug = searchParams.get("slug");

		if (!slug) {
			return Response.json(
				{ error: "Slug parameter diperlukan" },
				{ status: 400 },
			);
		}

		const db = getDB();

		const pageSection = await db
			.select({
				id: pageSections.id,
				pageName: pageSections.pageName,
				pageSlug: pageSections.pageSlug,
				pageData: pageSections.pageData,
				created_at: pageSections.createdAt,
				updated_at: pageSections.updatedAt,
			})
			.from(pageSections)
			.where(
				and(eq(pageSections.pageSlug, slug), isNull(pageSections.deletedAt)),
			)
			.limit(1);

		if (!pageSection.length) {
			return Response.json(
				{ error: "Page section tidak ditemukan" },
				{ status: 404 },
			);
		}

		return Response.json(pageSection[0]);
	} catch (error) {
		console.error("Get public page section error:", error);
		return Response.json(
			{ error: "Gagal mengambil page section" },
			{ status: 500 },
		);
	}
}
