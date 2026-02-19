import { getDB } from "@/lib/db";
import { contents } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireAuth } from "@/lib/rbac";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const updateContentSchema = z.object({
	title: z.string().min(1).max(255).optional(),
	slug: z.string().min(1).max(255).optional(),
	content: z.string().min(1).optional(),
	type: z.string().optional(),
	categoryId: z.number().optional().nullable(),
	featuredImage: z.string().optional(),
	metaTitle: z.string().max(255).optional(),
	metaDescription: z.string().max(500).optional(),
	metaKeywords: z.string().optional(),
	ogTitle: z.string().max(255).optional(),
	ogDescription: z.string().max(500).optional(),
	ogImage: z.string().optional(),
});

export async function GET(request: Request, context: any) {
	try {
		await requireAuth();

		const { params } = context;
		const { env } = context;
		const db = getDB(env);

		const contentId = parseInt(params.id);
		if (isNaN(contentId)) {
			return Response.json({ error: "Invalid content ID" }, { status: 400 });
		}

		const result = await db
			.select()
			.from(contents)
			.where(eq(contents.id, contentId));

		const content = result[0];
		if (!content || content.deletedAt !== null) {
			return Response.json({ error: "Content not found" }, { status: 404 });
		}

		return Response.json(content);
	} catch (error) {
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		console.error("Error fetching content:", error);
		return Response.json({ error: "Failed to fetch content" }, { status: 500 });
	}
}

export async function PUT(request: Request, context: any) {
	try {
		await requireAuth();

		const { params } = context;
		const { env } = context;
		const db = getDB(env);
		const body = await request.json();

		const contentId = parseInt(params.id);
		if (isNaN(contentId)) {
			return Response.json({ error: "Invalid content ID" }, { status: 400 });
		}

		// Validate input
		const validatedData = updateContentSchema.parse(body);

		// Check if content exists and not deleted
		const existingResult = await db
			.select()
			.from(contents)
			.where(eq(contents.id, contentId));

		const existing = existingResult[0];
		if (!existing || existing.deletedAt !== null) {
			return Response.json({ error: "Content not found" }, { status: 404 });
		}

		// Check for duplicate slug if slug is being updated
		if (validatedData.slug && validatedData.slug !== existing.slug) {
			const allContents = await db.select().from(contents);
			const activeWithSlug = allContents.filter(
				(item: any) =>
					item.slug === validatedData.slug && item.deletedAt === null,
			);

			if (activeWithSlug.length > 0) {
				return Response.json(
					{ error: "Slug sudah digunakan" },
					{ status: 400 },
				);
			}
		}

		const updatedAt = new Date();
		const result = await db
			.update(contents)
			.set({
				...validatedData,
				updatedAt,
			})
			.where(eq(contents.id, contentId))
			.returning();

		return Response.json(result[0]);
	} catch (error) {
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		if (error instanceof z.ZodError) {
			return Response.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 },
			);
		}

		console.error("Error updating content:", error);
		return Response.json(
			{ error: "Failed to update content" },
			{ status: 500 },
		);
	}
}

export async function DELETE(request: Request, context: any) {
	try {
		await requireAuth();

		const { params } = context;
		const { env } = context;
		const db = getDB(env);

		const contentId = parseInt(params.id);
		if (isNaN(contentId)) {
			return Response.json({ error: "Invalid content ID" }, { status: 400 });
		}

		// Check if content exists
		const existingResult = await db
			.select()
			.from(contents)
			.where(eq(contents.id, contentId));

		const existing = existingResult[0];
		if (!existing || existing.deletedAt !== null) {
			return Response.json({ error: "Content not found" }, { status: 404 });
		}

		// Soft delete
		const deletedAt = new Date();
		const result = await db
			.update(contents)
			.set({ deletedAt })
			.where(eq(contents.id, contentId))
			.returning();

		return Response.json({
			message: "Content deleted successfully",
			content: result[0],
		});
	} catch (error) {
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		console.error("Error deleting content:", error);
		return Response.json(
			{ error: "Failed to delete content" },
			{ status: 500 },
		);
	}
}
