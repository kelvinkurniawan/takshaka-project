import { getDB } from "@/lib/db";
import { pages } from "@/lib/schema";
import { eq, and, isNull } from "drizzle-orm";
import { z } from "zod";
import { requireAuth, canEdit, canDelete } from "@/lib/rbac";

export const dynamic = "force-dynamic";

const updatePageSchema = z.object({
	title: z.string().min(1, "Title is required").max(255).optional(),
	slug: z.string().min(1, "Slug is required").max(255).optional(),
	content: z.string().min(1, "Content is required").optional(),
	status: z.enum(["draft", "published"]).optional(),
	metaTitle: z.string().max(255).optional(),
	metaDescription: z.string().max(500).optional(),
});

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await requireAuth();

		const db = getDB(process.env);
		const pageId = parseInt((await params).id);

		if (isNaN(pageId)) {
			return Response.json({ error: "Invalid page ID" }, { status: 400 });
		}

		const result = await db
			.select()
			.from(pages)
			.where(and(eq(pages.id, pageId), isNull(pages.deletedAt)))
			.limit(1);

		if (result.length === 0) {
			return Response.json({ error: "Page not found" }, { status: 404 });
		}

		return Response.json(result[0]);
	} catch (error) {
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		console.error("Failed to fetch page:", error);
		return Response.json({ error: "Failed to fetch page" }, { status: 500 });
	}
}

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await requireAuth();

		const canEditCheck = await canEdit();
		if (!canEditCheck) {
			return Response.json({ error: "Forbidden" }, { status: 403 });
		}

		const db = getDB(process.env);
		const pageId = parseInt((await params).id);
		const body = await request.json();

		if (isNaN(pageId)) {
			return Response.json({ error: "Invalid page ID" }, { status: 400 });
		}

		const validatedData = updatePageSchema.parse(body);

		const existing = await db
			.select()
			.from(pages)
			.where(and(eq(pages.id, pageId), isNull(pages.deletedAt)))
			.limit(1);

		if (existing.length === 0) {
			return Response.json({ error: "Page not found" }, { status: 404 });
		}

		if (validatedData.slug) {
			const slugCheck = await db
				.select()
				.from(pages)
				.where(eq(pages.slug, validatedData.slug));

			const activePages = slugCheck.filter(
				(page: any) => page.deletedAt === null && page.id !== pageId,
			);

			if (activePages.length > 0) {
				return Response.json(
					{ error: "Slug sudah digunakan" },
					{ status: 400 },
				);
			}
		}

		await db
			.update(pages)
			.set({
				...validatedData,
				updatedAt: new Date(),
			})
			.where(eq(pages.id, pageId));

		return Response.json({ success: true });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return Response.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 },
			);
		}
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		console.error("Failed to update page:", error);
		return Response.json({ error: "Failed to update page" }, { status: 500 });
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await requireAuth();

		const canDeleteCheck = await canDelete();
		if (!canDeleteCheck) {
			return Response.json({ error: "Forbidden" }, { status: 403 });
		}

		const db = getDB(process.env);
		const pageId = parseInt((await params).id);

		if (isNaN(pageId)) {
			return Response.json({ error: "Invalid page ID" }, { status: 400 });
		}

		const existing = await db
			.select()
			.from(pages)
			.where(and(eq(pages.id, pageId), isNull(pages.deletedAt)))
			.limit(1);

		if (existing.length === 0) {
			return Response.json({ error: "Page not found" }, { status: 404 });
		}

		await db
			.update(pages)
			.set({ deletedAt: new Date() })
			.where(eq(pages.id, pageId));

		return Response.json({ success: true });
	} catch (error) {
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		console.error("Failed to delete page:", error);
		return Response.json({ error: "Failed to delete page" }, { status: 500 });
	}
}
