import { getDB } from "@/lib/db";
import { comments as commentsTable } from "@/lib/schema";
import { inArray } from "drizzle-orm";

export const runtime = "nodejs";

/**
 * GET /api/comments/count - Get comment count for multiple contents
 */
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const contentIdsParam = searchParams.get("contentIds");

		if (!contentIdsParam) {
			return Response.json(
				{ error: "contentIds parameter required" },
				{ status: 400 },
			);
		}

		const contentIds = contentIdsParam.split(",").map((id) => parseInt(id));

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const db = getDB({} as any);

		// Fetch all comments for the specified content IDs
		const allComments = await db
			.select()
			.from(commentsTable)
			.where(inArray(commentsTable.contentId, contentIds));

		// Count approved comments per content ID
		const commentCounts: Record<number, number> = {};

		contentIds.forEach((id) => {
			commentCounts[id] = 0;
		});

		allComments.forEach((comment: any) => {
			if (
				comment.deletedAt === null &&
				comment.status === "approved" &&
				!comment.isSpam
			) {
				commentCounts[comment.contentId]++;
			}
		});

		return Response.json(commentCounts);
	} catch (error) {
		console.error("Failed to fetch comment counts:", error);
		return Response.json(
			{ error: "Failed to fetch comment counts" },
			{ status: 500 },
		);
	}
}
