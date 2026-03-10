import { z } from "zod";
import { requireAuth, canEdit } from "@/lib/rbac";
import { getDB } from "@/lib/db";
import { pageSections } from "@/lib/schema";
import { eq, isNull } from "drizzle-orm";
import { getSessionUserId } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const createPageSectionSchema = z.object({
	pageName: z.string().min(1, "Nama halaman diperlukan").max(255),
	pageSlug: z.string().min(1, "Slug diperlukan").max(255),
	pageData: z.string().min(1, "Data halaman diperlukan"), // JSON string
});

const updatePageSectionSchema = z.object({
	pageName: z.string().min(1, "Nama halaman diperlukan").max(255).optional(),
	pageSlug: z.string().min(1, "Slug diperlukan").max(255).optional(),
	pageData: z.string().min(1, "Data halaman diperlukan").optional(), // JSON string
});

/**
 * GET /api/page-sections - Get all page sections
 */
export async function GET(request: Request) {
	try {
		// Verify authentication
		await requireAuth();

		const db = getDB();

		const pageSectionsData = await db
			.select({
				id: pageSections.id,
				pageName: pageSections.pageName,
				pageSlug: pageSections.pageSlug,
				pageData: pageSections.pageData,
				created_by: pageSections.createdBy,
				created_at: pageSections.createdAt,
				updated_at: pageSections.updatedAt,
			})
			.from(pageSections)
			.where(isNull(pageSections.deletedAt));

		return Response.json(pageSectionsData);
	} catch (error) {
		console.error("Get page sections error:", error);
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		return Response.json(
			{ error: "Gagal mengambil page sections" },
			{ status: 500 },
		);
	}
}

/**
 * POST /api/page-sections - Create new page section
 */
export async function POST(request: Request) {
	try {
		// Verify authentication
		await requireAuth();

		// Check if user can edit
		const canEditCheck = await canEdit();
		if (!canEditCheck) {
			return Response.json(
				{ error: "Anda tidak memiliki izin untuk membuat page section" },
				{ status: 403 },
			);
		}

		const body = await request.json();
		const validatedData = createPageSectionSchema.parse(body);

		// Validate JSON string
		try {
			JSON.parse(validatedData.pageData);
		} catch (err) {
			return Response.json(
				{ error: "Page data harus berupa JSON yang valid" },
				{ status: 400 },
			);
		}

		const db = getDB();

		// Check if slug already exists (exclude soft deleted)
		const existing = await db
			.select()
			.from(pageSections)
			.where(eq(pageSections.pageSlug, validatedData.pageSlug));

		// Filter out soft deleted page sections manually
		const activePageSections = existing.filter(
			(section: { deletedAt: Date | null }) => section.deletedAt === null,
		);

		if (activePageSections.length > 0) {
			return Response.json({ error: "Slug sudah digunakan" }, { status: 400 });
		}

		// Get current user ID
		const userId = await getSessionUserId();

		const now = new Date();
		await db.insert(pageSections).values({
			pageName: validatedData.pageName,
			pageSlug: validatedData.pageSlug,
			pageData: validatedData.pageData,
			createdBy: userId,
			createdAt: now,
			updatedAt: now,
		});

		return Response.json(
			{ success: true, message: "Page section berhasil dibuat" },
			{ status: 201 },
		);
	} catch (error) {
		console.error("Create page section error:", error);
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
			{ error: "Gagal membuat page section" },
			{ status: 500 },
		);
	}
}
