import { z } from "zod";
import { requireAuth, canEdit } from "@/lib/rbac";
import { getDB } from "@/lib/db";
import { pageSections } from "@/lib/schema";
import { eq, and, isNull } from "drizzle-orm";

export const dynamic = "force-dynamic";

const updatePageSectionSchema = z.object({
	pageName: z.string().min(1, "Nama halaman diperlukan").max(255).optional(),
	pageSlug: z.string().min(1, "Slug diperlukan").max(255).optional(),
	pageData: z.string().min(1, "Data halaman diperlukan").optional(), // JSON string
});

/**
 * GET /api/page-sections/[id] - Get single page section by ID
 */
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await requireAuth();

		const { id } = await params;
		const pageSectionId = parseInt(id, 10);

		if (isNaN(pageSectionId)) {
			return Response.json({ error: "ID tidak valid" }, { status: 400 });
		}

		const db = getDB();

		const pageSection = await db
			.select()
			.from(pageSections)
			.where(
				and(eq(pageSections.id, pageSectionId), isNull(pageSections.deletedAt)),
			)
			.limit(1);

		if (!pageSection.length) {
			return Response.json(
				{ error: "Page section tidak ditemukan" },
				{ status: 404 },
			);
		}

		return Response.json(pageSection[0]);
	} catch (error) {
		console.error("Get page section error:", error);
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		return Response.json(
			{ error: "Gagal mengambil page section" },
			{ status: 500 },
		);
	}
}

/**
 * PUT /api/page-sections/[id] - Update page section
 */
export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await requireAuth();

		const canEditCheck = await canEdit();
		if (!canEditCheck) {
			return Response.json(
				{ error: "Anda tidak memiliki izin untuk mengubah page section" },
				{ status: 403 },
			);
		}

		const { id } = await params;
		const pageSectionId = parseInt(id, 10);

		if (isNaN(pageSectionId)) {
			return Response.json({ error: "ID tidak valid" }, { status: 400 });
		}

		const body = await request.json();
		const validatedData = updatePageSectionSchema.parse(body);

		// Validate JSON string if provided
		if (validatedData.pageData) {
			try {
				JSON.parse(validatedData.pageData);
			} catch (err) {
				return Response.json(
					{ error: "Page data harus berupa JSON yang valid" },
					{ status: 400 },
				);
			}
		}

		const db = getDB();

		// Check if page section exists
		const existingPageSection = await db
			.select()
			.from(pageSections)
			.where(
				and(eq(pageSections.id, pageSectionId), isNull(pageSections.deletedAt)),
			)
			.limit(1);

		if (!existingPageSection.length) {
			return Response.json(
				{ error: "Page section tidak ditemukan" },
				{ status: 404 },
			);
		}

		// Check if new slug already exists (if changing slug)
		if (validatedData.pageSlug) {
			const existing = await db
				.select()
				.from(pageSections)
				.where(eq(pageSections.pageSlug, validatedData.pageSlug));

			const activePageSections = existing.filter(
				(section: { id: number; deletedAt: Date | null }) =>
					section.deletedAt === null && section.id !== pageSectionId,
			);

			if (activePageSections.length > 0) {
				return Response.json(
					{ error: "Slug sudah digunakan" },
					{ status: 400 },
				);
			}
		}

		await db
			.update(pageSections)
			.set({
				...validatedData,
				updatedAt: new Date(),
			})
			.where(eq(pageSections.id, pageSectionId));

		return Response.json({
			success: true,
			message: "Page section berhasil diubah",
		});
	} catch (error) {
		console.error("Update page section error:", error);
		if (error instanceof z.ZodError) {
			return Response.json(
				{ error: "Validasi gagal", details: error.errors },
				{ status: 400 },
			);
		}
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		return Response.json(
			{ error: "Gagal mengubah page section" },
			{ status: 500 },
		);
	}
}

/**
 * DELETE /api/page-sections/[id] - Soft delete page section
 */
export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await requireAuth();

		const canEditCheck = await canEdit();
		if (!canEditCheck) {
			return Response.json(
				{ error: "Anda tidak memiliki izin untuk menghapus page section" },
				{ status: 403 },
			);
		}

		const { id } = await params;
		const pageSectionId = parseInt(id, 10);

		if (isNaN(pageSectionId)) {
			return Response.json({ error: "ID tidak valid" }, { status: 400 });
		}

		const db = getDB();

		// Check if page section exists
		const existingPageSection = await db
			.select()
			.from(pageSections)
			.where(
				and(eq(pageSections.id, pageSectionId), isNull(pageSections.deletedAt)),
			)
			.limit(1);

		if (!existingPageSection.length) {
			return Response.json(
				{ error: "Page section tidak ditemukan" },
				{ status: 404 },
			);
		}

		// Soft delete
		await db
			.update(pageSections)
			.set({ deletedAt: new Date() })
			.where(eq(pageSections.id, pageSectionId));

		return Response.json({
			success: true,
			message: "Page section berhasil dihapus",
		});
	} catch (error) {
		console.error("Delete page section error:", error);
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		return Response.json(
			{ error: "Gagal menghapus page section" },
			{ status: 500 },
		);
	}
}
