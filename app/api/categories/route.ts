import { z } from "zod";
import { requireAuth, canEdit } from "@/lib/rbac";
import { getDB } from "@/lib/db";
import { categories } from "@/lib/schema";
import { eq, isNull } from "drizzle-orm";
import { getSessionUserId } from "@/lib/session";

export const runtime = "nodejs";

const createCategorySchema = z.object({
	name: z.string().min(1, "Nama kategori diperlukan").max(255),
	slug: z.string().min(1, "Slug diperlukan").max(255),
	description: z.string().optional(),
});

/**
 * GET /api/categories - Get all categories
 */
export async function GET(request: Request, context: any) {
	try {
		await requireAuth();

		const { env } = context;
		const db = getDB(env);

		const categoriesData = await db
			.select({
				id: categories.id,
				name: categories.name,
				slug: categories.slug,
				description: categories.description,
				created_by: categories.createdBy,
				created_at: categories.createdAt,
				updated_at: categories.updatedAt,
			})
			.from(categories)
			.where(isNull(categories.deletedAt))
			.orderBy(categories.createdAt);

		return Response.json(categoriesData);
	} catch (error) {
		console.error("Get categories error:", error);
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		return Response.json(
			{ error: "Gagal mengambil kategori" },
			{ status: 500 },
		);
	}
}

/**
 * POST /api/categories - Create new category
 */
export async function POST(request: Request, context: any) {
	try {
		await requireAuth();

		// Check if user can edit
		const canEditCheck = await canEdit();
		if (!canEditCheck) {
			return Response.json(
				{ error: "Anda tidak memiliki izin untuk membuat kategori" },
				{ status: 403 },
			);
		}

		const body = await request.json();
		const validatedData = createCategorySchema.parse(body);

		const { env } = context;
		const db = getDB(env);

		// Check if slug already exists (exclude soft deleted)
		const existing = await db
			.select()
			.from(categories)
			.where(eq(categories.slug, validatedData.slug));

		// Filter out soft deleted categories manually
		const activeCategories = existing.filter(
			(cat: { deletedAt: null }) => cat.deletedAt === null,
		);

		if (activeCategories.length > 0) {
			return Response.json({ error: "Slug sudah digunakan" }, { status: 400 });
		}

		// Get user ID from session
		const userId = await getSessionUserId();

		if (!userId) {
			return Response.json({ error: "User tidak ditemukan" }, { status: 401 });
		}

		const result = await db.insert(categories).values({
			name: validatedData.name,
			slug: validatedData.slug,
			description: validatedData.description || null,
			createdBy: userId,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		// Fetch the created category
		const [createdCategory] = await db
			.select({
				id: categories.id,
				name: categories.name,
				slug: categories.slug,
				description: categories.description,
				created_by: categories.createdBy,
				created_at: categories.createdAt,
				updated_at: categories.updatedAt,
			})
			.from(categories)
			.where(eq(categories.id, result.lastInsertRowid))
			.limit(1);

		return Response.json(createdCategory, { status: 201 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return Response.json(
				{ error: "Validasi gagal", details: error.issues },
				{ status: 400 },
			);
		}

		console.error("Create category error:", error);
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		return Response.json({ error: "Gagal membuat kategori" }, { status: 500 });
	}
}
