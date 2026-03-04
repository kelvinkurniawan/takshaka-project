import { requireAuth } from "@/lib/rbac";
import { getDB } from "@/lib/db";
import { comments as commentsTable } from "@/lib/schema";
import { eq } from "drizzle-orm";

# Use nodejs runtime for Node.js database operations
export const dynamic = "force-dynamic";

/**
 * POST /api/admin/comments/[commentId]/approve - Approve a comment
 */
export async function POST(request: Request) {
	try {
		await requireAuth();

		const { params } = context;
		const { commentId } = await params;

		const db = getDB();

		// Update comment status to approved
		await db
			.update(commentsTable)
			.set({ status: "approved", updatedAt: new Date() })
			.where(eq(commentsTable.id, parseInt(commentId)));

		return Response.json({
			success: true,
			message: "Comment approved successfully",
		});
	} catch (error) {
		console.error("Approve comment error:", error);
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		return Response.json(
			{ error: "Failed to approve comment" },
			{ status: 500 },
		);
	}
}
