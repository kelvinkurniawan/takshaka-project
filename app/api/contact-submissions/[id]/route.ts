import { z } from "zod";
import { getDB } from "@/lib/db";
import { contactSubmissions } from "@/lib/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

const updateStatusSchema = z.object({
	status: z.enum(["new", "read", "responded", "spam"]),
});

export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const submissionId = parseInt(id);

		if (isNaN(submissionId)) {
			return Response.json({ error: "Invalid submission ID" }, { status: 400 });
		}

		const body = await request.json();
		const validatedData = updateStatusSchema.parse(body);

		const db = getDB(process.env);

		// Update the status
		await db
			.update(contactSubmissions)
			.set({
				status: validatedData.status,
				updatedAt: new Date(),
			})
			.where(eq(contactSubmissions.id, submissionId));

		return Response.json({
			success: true,
			message: "Submission updated successfully",
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			return Response.json(
				{
					error: "Validation failed",
					details: error.errors,
				},
				{ status: 400 },
			);
		}

		console.error("Error updating contact submission:", error);
		return Response.json(
			{ error: "Failed to update submission" },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const submissionId = parseInt(id);

		if (isNaN(submissionId)) {
			return Response.json({ error: "Invalid submission ID" }, { status: 400 });
		}

		const db = getDB(process.env);

		// Delete the submission
		await db
			.delete(contactSubmissions)
			.where(eq(contactSubmissions.id, submissionId));

		return Response.json({
			success: true,
			message: "Submission deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting contact submission:", error);
		return Response.json(
			{ error: "Failed to delete submission" },
			{ status: 500 },
		);
	}
}
