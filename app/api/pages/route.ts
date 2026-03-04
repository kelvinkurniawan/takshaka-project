import { getDB } from "@/lib/db";
import { pages } from "@/lib/schema";
import { isNull, eq } from "drizzle-orm";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createPageSchema = z.object({
	title: z.string().min(1, "Title is required").max(255),
	slug: z.string().min(1, "Slug is required").max(255),
	content: z.string().min(1, "Content is required"),
	status: z.enum(["draft", "published"]).default("draft"),
	metaTitle: z.string().max(255).optional(),
	metaDescription: z.string().max(500).optional(),
	createdBy: z.number().int().positive(),
});

export async function GET(request: Request) {
	try {
		const db = getDB();

		// Fetch all non-deleted pages
		const allPages = await db
			.select()
			.from(pages)
			.where(isNull(pages.deletedAt));

		return Response.json(allPages);
	} catch (error) {
		console.error("Failed to fetch pages:", error);
		return Response.json({ error: "Failed to fetch pages" }, { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		const db = getDB();
		const body = await request.json();

		// Validate input
		const validatedData = createPageSchema.parse(body);

		// Check if slug already exists (manual filtering for soft deletes)
		const existing = await db
			.select()
			.from(pages)
			.where(eq(pages.slug, validatedData.slug));

		const activePages = existing.filter((page: any) => page.deletedAt === null);
		if (activePages.length > 0) {
			return Response.json({ error: "Slug sudah digunakan" }, { status: 400 });
		}

		// Create new page
		const now = new Date();
		await db.insert(pages).values({
			...validatedData,
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

		console.error("Failed to create page:", error);
		return Response.json({ error: "Failed to create page" }, { status: 500 });
	}
}
