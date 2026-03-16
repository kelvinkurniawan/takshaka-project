import { requireAuth } from "@/lib/rbac";
import { getDB } from "@/lib/db";
import { comments as commentsTable } from "@/lib/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * DELETE /api/admin/comments/[commentId] - Delete a comment (soft delete)
 */
export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ commentId: string }> },
) {
	try {
		await requireAuth();

		const { commentId } = await params;

		const db = getDB(process.env);

		// Soft delete the comment
		await db
			.update(commentsTable)
			.set({ deletedAt: new Date() })
			.where(eq(commentsTable.id, parseInt(commentId)));

		return Response.json({
			success: true,
			message: "Comment deleted successfully",
		});
	} catch (error) {
		console.error("Delete comment error:", error);
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		return Response.json(
			{ error: "Failed to delete comment" },
			{ status: 500 },
		);
	}
}
