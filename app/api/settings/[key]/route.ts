import { z } from "zod";
import { requireAuth, canEdit } from "@/lib/rbac";
import { getDB } from "@/lib/db";
import { settings } from "@/lib/schema";
import { eq } from "drizzle-orm";

# Use nodejs runtime for Node.js database operations
export const dynamic = "force-dynamic";

const updateSettingSchema = z.object({
	value: z.string().optional(),
	type: z.string().optional(),
	description: z.string().optional(),
});

/**
 * GET /api/settings/[key] - Get single setting
 */
export async function GET(request: Request) {
	try {
		await requireAuth();

		const { key } = await context.params;
		const settingKey = decodeURIComponent(key);

		const db = getDB();

		const [setting] = await db
			.select({
				id: settings.id,
				key: settings.key,
				value: settings.value,
				type: settings.type,
				description: settings.description,
				createdAt: settings.createdAt,
				updatedAt: settings.updatedAt,
			})
			.from(settings)
			.where(eq(settings.key, settingKey))
			.limit(1);

		if (!setting) {
			return Response.json(
				{ error: "Pengaturan tidak ditemukan" },
				{ status: 404 },
			);
		}

		return Response.json(setting);
	} catch (error) {
		console.error("Get setting error:", error);
		return Response.json(
			{ error: "Gagal mengambil pengaturan" },
			{ status: 500 },
		);
	}
}

/**
 * PUT /api/settings/[key] - Update single setting
 */
export async function PUT(request: Request) {
	try {
		await requireAuth();

		const canEditCheck = await canEdit();
		if (!canEditCheck) {
			return Response.json(
				{ error: "Anda tidak memiliki izin untuk mengubah pengaturan" },
				{ status: 403 },
			);
		}

		const { key } = await context.params;
		const settingKey = decodeURIComponent(key);

		const body = await request.json();
		const validatedData = updateSettingSchema.parse(body);

		const db = getDB();

		// Check if setting exists
		const [existing] = await db
			.select()
			.from(settings)
			.where(eq(settings.key, settingKey))
			.limit(1);

		if (!existing) {
			return Response.json(
				{ error: "Pengaturan tidak ditemukan" },
				{ status: 404 },
			);
		}

		// Update setting
		await db
			.update(settings)
			.set({
				value: validatedData.value,
				type: validatedData.type,
				description: validatedData.description,
				updatedAt: new Date(),
			})
			.where(eq(settings.key, settingKey));

		// Fetch updated setting
		const [setting] = await db
			.select({
				id: settings.id,
				key: settings.key,
				value: settings.value,
				type: settings.type,
				description: settings.description,
				createdAt: settings.createdAt,
				updatedAt: settings.updatedAt,
			})
			.from(settings)
			.where(eq(settings.key, settingKey))
			.limit(1);

		return Response.json(setting);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return Response.json(
				{ error: "Validasi gagal", details: error.issues },
				{ status: 400 },
			);
		}

		console.error("Update setting error:", error);
		return Response.json(
			{ error: "Gagal mengubah pengaturan" },
			{ status: 500 },
		);
	}
}

/**
 * DELETE /api/settings/[key] - Delete single setting
 */
export async function DELETE(request: Request) {
	try {
		await requireAuth();

		const canEditCheck = await canEdit();
		if (!canEditCheck) {
			return Response.json(
				{ error: "Anda tidak memiliki izin untuk menghapus pengaturan" },
				{ status: 403 },
			);
		}

		const { key } = await context.params;
		const settingKey = decodeURIComponent(key);

		const db = getDB();

		// Check if setting exists
		const [existing] = await db
			.select()
			.from(settings)
			.where(eq(settings.key, settingKey))
			.limit(1);

		if (!existing) {
			return Response.json(
				{ error: "Pengaturan tidak ditemukan" },
				{ status: 404 },
			);
		}

		// Delete setting
		await db.delete(settings).where(eq(settings.key, settingKey));

		return Response.json({
			success: true,
			message: "Pengaturan berhasil dihapus",
		});
	} catch (error) {
		console.error("Delete setting error:", error);
		return Response.json(
			{ error: "Gagal menghapus pengaturan" },
			{ status: 500 },
		);
	}
}
