import { requireAuth } from "@/lib/rbac";
import { getDB } from "@/lib/db";
import { comments as commentsTable } from "@/lib/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/comments/[commentId]/reject - Reject a comment
 */
export async function POST(
	request: Request,
	{ params }: { params: Promise<{ commentId: string }> },
) {
	try {
		await requireAuth();

		const { commentId } = await params;

		const db = getDB();

		// Update comment status to rejected
		await db
			.update(commentsTable)
			.set({ status: "rejected", updatedAt: new Date() })
			.where(eq(commentsTable.id, parseInt(commentId)));

		return Response.json({
			success: true,
			message: "Comment rejected successfully",
		});
	} catch (error) {
		console.error("Reject comment error:", error);
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		return Response.json(
			{ error: "Failed to reject comment" },
			{ status: 500 },
		);
	}
}
