import { getDB } from "@/lib/db";
import { pages } from "@/lib/schema";
import { isNull, eq } from "drizzle-orm";
import { z } from "zod";
import { requireAuth, canEdit } from "@/lib/rbac";

export const dynamic = "force-dynamic";

const createPageSchema = z.object({
	title: z.string().min(1, "Title is required").max(255),
	slug: z.string().min(1, "Slug is required").max(255),
	content: z.string().min(1, "Content is required"),
	status: z.enum(["draft", "published"]).default("draft"),
	metaTitle: z.string().max(255).optional(),
	metaDescription: z.string().max(500).optional(),
});

export async function GET(request: Request) {
	try {
		await requireAuth();

		const db = getDB(process.env);

		const allPages = await db
			.select()
			.from(pages)
			.where(isNull(pages.deletedAt));

		return Response.json(allPages);
	} catch (error) {
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		console.error("Failed to fetch pages:", error);
		return Response.json({ error: "Failed to fetch pages" }, { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		const user = await requireAuth();

		const canEditCheck = await canEdit();
		if (!canEditCheck) {
			return Response.json({ error: "Forbidden" }, { status: 403 });
		}

		const db = getDB(process.env);
		const body = await request.json();

		const validatedData = createPageSchema.parse(body);

		const existing = await db
			.select()
			.from(pages)
			.where(eq(pages.slug, validatedData.slug));

		const activePages = existing.filter((page: any) => page.deletedAt === null);
		if (activePages.length > 0) {
			return Response.json({ error: "Slug sudah digunakan" }, { status: 400 });
		}

		const now = new Date();
		await db.insert(pages).values({
			...validatedData,
			createdBy: user.id,
			createdAt: now,
			updatedAt: now,
		});

		return Response.json({ success: true }, { status: 201 });
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
		console.error("Failed to create page:", error);
		return Response.json({ error: "Failed to create page" }, { status: 500 });
	}
}
