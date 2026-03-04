import { z } from "zod";
import { requireAuth, canEdit, canDelete } from "@/lib/rbac";
import { getDB } from "@/lib/db";
import { categories } from "@/lib/schema";
import { eq, ne, isNull, and } from "drizzle-orm";

// Use nodejs runtime for Node.js database operations
export const dynamic = "force-dynamic";

const updateCategorySchema = z.object({
	name: z.string().min(1, "Nama kategori diperlukan").max(255),
	slug: z.string().min(1, "Slug diperlukan").max(255),
	description: z.string().optional(),
});

/**
 * GET /api/categories/[id] - Get single category
 */
export async function GET(request: Request) {
	try {
		await requireAuth();

		const { id } = await context.params;
		const categoryId = parseInt(id);
		if (isNaN(categoryId)) {
			return Response.json(
				{ error: "ID kategori tidak valid" },
				{ status: 400 },
			);
		}

		const db = getDB();

		const [category] = await db
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
			.where(eq(categories.id, categoryId))
			.where(isNull(categories.deletedAt))
			.limit(1);

		if (!category) {
			return Response.json(
				{ error: "Kategori tidak ditemukan" },
				{ status: 404 },
			);
		}

		return Response.json(category);
	} catch (error) {
		console.error("Get category error:", error);
		return Response.json(
			{ error: "Gagal mengambil kategori" },
			{ status: 500 },
		);
	}
}

/**
 * PUT /api/categories/[id] - Update category
 */
export async function PUT(request: Request) {
	try {
		await requireAuth();

		const canEditCheck = await canEdit();
		if (!canEditCheck) {
			return Response.json(
				{ error: "Anda tidak memiliki izin untuk mengubah kategori" },
				{ status: 403 },
			);
		}

		const { id } = await context.params;
		const categoryId = parseInt(id);
		if (isNaN(categoryId)) {
			return Response.json(
				{ error: "ID kategori tidak valid" },
				{ status: 400 },
			);
		}

		const body = await request.json();
		const validatedData = updateCategorySchema.parse(body);

		const db = getDB();

		// Check if category exists
		const [existing] = await db
			.select()
			.from(categories)
			.where(eq(categories.id, categoryId))
			.where(isNull(categories.deletedAt))
			.limit(1);

		if (!existing) {
			return Response.json(
				{ error: "Kategori tidak ditemukan" },
				{ status: 404 },
			);
		}

		// Check if slug is unique (and not the same as current, exclude soft deleted)
		const [slugCheck] = await db
			.select()
			.from(categories)
			.where(
				and(
					eq(categories.slug, validatedData.slug),
					ne(categories.id, categoryId),
					isNull(categories.deletedAt),
				),
			)
			.limit(1);

		if (slugCheck) {
			return Response.json({ error: "Slug sudah digunakan" }, { status: 400 });
		}

		// Update category
		await db
			.update(categories)
			.set({
				name: validatedData.name,
				slug: validatedData.slug,
				description: validatedData.description || null,
			})
			.where(eq(categories.id, categoryId));

		// Fetch updated category
		const [category] = await db
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
			.where(eq(categories.id, categoryId))
			.limit(1);

		return Response.json(category);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return Response.json(
				{ error: "Validasi gagal", details: error.issues },
				{ status: 400 },
			);
		}

		console.error("Update category error:", error);
		return Response.json({ error: "Gagal mengubah kategori" }, { status: 500 });
	}
}

/**
 * DELETE /api/categories/[id] - Delete category
 */
export async function DELETE(request: Request) {
	try {
		await requireAuth();

		const canDeleteCheck = await canDelete();
		if (!canDeleteCheck) {
			return Response.json(
				{ error: "Anda tidak memiliki izin untuk menghapus kategori" },
				{ status: 403 },
			);
		}

		const { id } = await context.params;
		const categoryId = parseInt(id);
		if (isNaN(categoryId)) {
			return Response.json(
				{ error: "ID kategori tidak valid" },
				{ status: 400 },
			);
		}

		const db = getDB();

		// Check if category exists
		const [existing] = await db
			.select()
			.from(categories)
			.where(eq(categories.id, categoryId))
			.where(isNull(categories.deletedAt))
			.limit(1);

		if (!existing) {
			return Response.json(
				{ error: "Kategori tidak ditemukan" },
				{ status: 404 },
			);
		}

		// Soft delete category
		await db
			.update(categories)
			.set({
				deletedAt: new Date(),
			})
			.where(eq(categories.id, categoryId));

		return Response.json({
			success: true,
			message: "Kategori berhasil dihapus",
		});
	} catch (error) {
		console.error("Delete category error:", error);
		if (error instanceof Error && error.message.includes("Forbidden")) {
			return Response.json({ error: error.message }, { status: 403 });
		}
		return Response.json(
			{ error: "Gagal menghapus kategori" },
			{ status: 500 },
		);
	}
}
