import { z } from "zod";
import { requireAuth, canEdit } from "@/lib/rbac";
import { getDB, withRetry } from "@/lib/db";
import { faqs } from "@/lib/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const updateFAQSchema = z.object({
	question: z.string().min(1, "Pertanyaan diperlukan").max(255),
	answer: z.string().min(1, "Jawaban diperlukan"),
	category: z.string().optional(),
	order: z.number().default(0),
	status: z.enum(["draft", "published"]).default("published"),
});

/**
 * PUT /api/faqs/[id] - Update a FAQ
 */
export async function PUT(
	request: Request,
	context: { params: Promise<{ id: string }> },
) {
	const params = await context.params;
	try {
		// Verify authentication
		await requireAuth();

		// Check if user can edit
		await canEdit();

		const body = await request.json();
		const validatedData = updateFAQSchema.parse(body);

		const faqId = parseInt(params.id, 10);
		if (isNaN(faqId)) {
			return Response.json({ error: "Invalid FAQ ID" }, { status: 400 });
		}

		const result = await withRetry(async () => {
			const db = getDB(process.env);
			return await db
				.update(faqs)
				.set({
					...validatedData,
					updatedAt: new Date(),
				})
				.where(eq(faqs.id, faqId))
				.returning();
		});

		if (result.length === 0) {
			return Response.json({ error: "FAQ tidak ditemukan" }, { status: 404 });
		}

		return Response.json(result[0]);
	} catch (error) {
		console.error("Update FAQ error:", error);
		if (error instanceof z.ZodError) {
			return Response.json(
				{ error: "Validasi gagal", details: error.errors },
				{ status: 400 },
			);
		}
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		return Response.json({ error: "Gagal memperbarui FAQ" }, { status: 500 });
	}
}

/**
 * DELETE /api/faqs/[id] - Delete a FAQ (soft delete)
 */
export async function DELETE(
	request: Request,
	context: { params: Promise<{ id: string }> },
) {
	const params = await context.params;
	try {
		// Verify authentication
		await requireAuth();

		// Check if user can edit
		await canEdit();

		const faqId = parseInt(params.id, 10);
		if (isNaN(faqId)) {
			return Response.json({ error: "Invalid FAQ ID" }, { status: 400 });
		}

		const result = await withRetry(async () => {
			const db = getDB(process.env);
			return await db
				.update(faqs)
				.set({
					deletedAt: new Date(),
				})
				.where(eq(faqs.id, faqId))
				.returning();
		});

		if (result.length === 0) {
			return Response.json({ error: "FAQ tidak ditemukan" }, { status: 404 });
		}

		return Response.json({ success: true, message: "FAQ berhasil dihapus" });
	} catch (error) {
		console.error("Delete FAQ error:", error);
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		return Response.json({ error: "Gagal menghapus FAQ" }, { status: 500 });
	}
}
