import { getDB } from "@/lib/db";
import { contents } from "@/lib/schema";
import { isNull, eq, desc } from "drizzle-orm";
import { z } from "zod";
import { requireAuth } from "@/lib/rbac";

export const dynamic = "force-dynamic";

const createContentSchema = z.object({
	title: z.string().min(1, "Title is required").max(255),
	slug: z.string().min(1, "Slug is required").max(255),
	content: z.string().min(1, "Content is required"),
	excerpt: z.string().optional(),
	type: z.string().default("article").optional(),
	categoryId: z.number().optional(),
	featuredImage: z.string().optional(),
	status: z.string().default("draft").optional(),
	publishedAt: z.date().optional(),
	metaTitle: z.string().max(255).optional(),
	metaDescription: z.string().max(500).optional(),
	metaKeywords: z.string().optional(),
	canonicalUrl: z.string().optional(),
	robots: z.string().optional(),
	ogTitle: z.string().max(255).optional(),
	ogDescription: z.string().max(500).optional(),
	ogImage: z.string().optional(),
	createdBy: z.number(),
});

const updateContentSchema = createContentSchema.partial();

export async function GET(request: Request) {
	try {
		await requireAuth();
		const db = getDB();

		// Get all active (non-deleted) contents
		const allContents = await db
			.select()
			.from(contents)
			.orderBy(desc(contents.createdAt));

		const activeContents = allContents.filter(
			(item: any) => item.deletedAt === null,
		);

		return Response.json(activeContents);
	} catch (error) {
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		console.error("Error fetching contents:", error);
		return Response.json(
			{ error: "Failed to fetch contents" },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	try {
		await requireAuth();
		const db = getDB();
		const body = await request.json();

		// Validate input
		const validatedData = createContentSchema.parse(body);

		// Check for duplicate slug among active contents
		const existing = await db.select().from(contents);
		const activeWithSlug = existing.filter(
			(item: any) =>
				item.slug === validatedData.slug && item.deletedAt === null,
		);

		if (activeWithSlug.length > 0) {
			return Response.json({ error: "Slug sudah digunakan" }, { status: 400 });
		}

		const now = new Date();
		const result = await db
			.insert(contents)
			.values({
				...validatedData,
				type: validatedData.type || "article",
				createdAt: now,
				updatedAt: now,
			})
			.returning();

		return Response.json(result[0], { status: 201 });
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

		console.error("Error creating content:", error);
		return Response.json(
			{ error: "Failed to create content" },
			{ status: 500 },
		);
	}
}
