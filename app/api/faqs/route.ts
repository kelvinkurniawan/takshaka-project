import { z } from "zod";
import { requireAuth, canEdit } from "@/lib/rbac";
import { getDB, withRetry } from "@/lib/db";
import { faqs } from "@/lib/schema";
import { eq, isNull } from "drizzle-orm";
import { getSessionUserId } from "@/lib/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const createFAQSchema = z.object({
	question: z.string().min(1, "Pertanyaan diperlukan").max(255),
	answer: z.string().min(1, "Jawaban diperlukan"),
	category: z.string().optional(),
	order: z.number().default(0),
	status: z.enum(["draft", "published"]).default("published"),
});

/**
 * GET /api/faqs - Get all FAQs
 */
export async function GET(request: Request) {
	try {
		// Verify authentication
		await requireAuth();

		const faqsData = await withRetry(async () => {
			const db = getDB();
			return await db
				.select({
					id: faqs.id,
					question: faqs.question,
					answer: faqs.answer,
					category: faqs.category,
					order: faqs.order,
					status: faqs.status,
					created_by: faqs.createdBy,
					created_at: faqs.createdAt,
					updated_at: faqs.updatedAt,
				})
				.from(faqs)
				.where(isNull(faqs.deletedAt))
				.orderBy(faqs.order);
		});

		return Response.json(faqsData);
	} catch (error) {
		console.error("Get FAQs error:", error);
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		return Response.json({ error: "Gagal mengambil FAQ" }, { status: 500 });
	}
}

/**
 * POST /api/faqs - Create a new FAQ
 */
export async function POST(request: Request) {
	try {
		// Verify authentication
		await requireAuth();

		// Check if user can edit
		await canEdit();

		const body = await request.json();
		const validatedData = createFAQSchema.parse(body);
		const userId = await getSessionUserId();

		const result = await withRetry(async () => {
			const db = getDB();
			return await db
				.insert(faqs)
				.values({
					...validatedData,
					createdBy: userId,
					createdAt: new Date(),
					updatedAt: new Date(),
				})
				.returning();
		});

		return Response.json(result[0], { status: 201 });
	} catch (error) {
		console.error("Create FAQ error:", error);
		if (error instanceof z.ZodError) {
			return Response.json(
				{ error: "Validasi gagal", details: error.errors },
				{ status: 400 },
			);
		}
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		return Response.json({ error: "Gagal membuat FAQ" }, { status: 500 });
	}
}
