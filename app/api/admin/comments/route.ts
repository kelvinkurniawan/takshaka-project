import { requireAuth } from "@/lib/rbac";
import { getDB } from "@/lib/db";
import { comments as commentsTable } from "@/lib/schema";
import { desc } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/comments - Get all comments with filters
 */
export async function GET(request: Request, context: any) {
	try {
		await requireAuth();

		const { searchParams } = new URL(request.url);
		const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
		const offset = parseInt(searchParams.get("offset") || "0");
		const status = searchParams.get("status") || "all";
		const spam = searchParams.get("spam") || "all";

		const { env } = context;
		const db = getDB(env);

		// Fetch all comments
		const allComments = await db
			.select()
			.from(commentsTable)
			.orderBy(desc(commentsTable.createdAt));

		// Filter comments based on criteria
		let filteredComments = allComments.filter((c: any) => c.deletedAt === null);

		// Filter by status
		if (status !== "all") {
			filteredComments = filteredComments.filter(
				(c: any) => c.status === status,
			);
		}

		// Filter by spam
		if (spam === "spam") {
			filteredComments = filteredComments.filter((c: any) => c.isSpam);
		} else if (spam === "legitimate") {
			filteredComments = filteredComments.filter((c: any) => !c.isSpam);
		}

		const total = filteredComments.length;
		const paginatedComments = filteredComments.slice(offset, offset + limit);

		return Response.json({
			data: paginatedComments,
			total,
			limit,
			offset,
		});
	} catch (error) {
		console.error("Get comments error:", error);
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		return Response.json(
			{ error: "Failed to fetch comments" },
			{ status: 500 },
		);
	}
}
