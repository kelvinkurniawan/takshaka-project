import { z } from "zod";
import { requireAuth, canEdit } from "@/lib/rbac";
import { getDB } from "@/lib/db";
import { settings } from "@/lib/schema";
import { eq } from "drizzle-orm";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const updateSettingSchema = z.object({
	value: z.string().optional(),
});

/**
 * GET /api/settings - Get all settings
 */
export async function GET(request: Request, context: any) {
	try {
		await requireAuth();

		const { env } = context;
		const db = getDB(env);

		const settingsData = await db
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
			.orderBy(settings.key);

		return Response.json(settingsData);
	} catch (error) {
		console.error("Get settings error:", error);
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		return Response.json(
			{ error: "Gagal mengambil pengaturan" },
			{ status: 500 },
		);
	}
}

/**
 * POST /api/settings - Create or update multiple settings
 */
export async function POST(request: Request, context: any) {
	try {
		await requireAuth();

		// Check if user can edit
		const canEditCheck = await canEdit();
		if (!canEditCheck) {
			return Response.json(
				{ error: "Anda tidak memiliki izin untuk mengubah pengaturan" },
				{ status: 403 },
			);
		}

		const body = await request.json();
		const validatedData = z.record(z.string(), z.string()).parse(body); // Expect object with string key-value pairs

		const { env } = context;
		const db = getDB(env);

		const results = [];

		// Process each setting
		for (const [key, value] of Object.entries(validatedData)) {
			// Check if setting exists
			const existing = await db
				.select()
				.from(settings)
				.where(eq(settings.key, key))
				.limit(1);

			if (existing.length > 0) {
				// Update existing setting
				await db
					.update(settings)
					.set({
						value: value,
						updatedAt: new Date(),
					})
					.where(eq(settings.key, key));

				results.push({ key, action: "updated", value });
			} else {
				// Create new setting
				await db.insert(settings).values({
					key,
					value,
					type: "string", // Default type
					description: null,
					createdAt: new Date(),
					updatedAt: new Date(),
				});

				results.push({ key, action: "created", value });
			}
		}

		return Response.json({
			success: true,
			message: "Pengaturan berhasil disimpan",
			results,
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			return Response.json(
				{ error: "Validasi gagal", details: error.issues },
				{ status: 400 },
			);
		}

		console.error("Update settings error:", error);
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		return Response.json(
			{ error: "Gagal menyimpan pengaturan" },
			{ status: 500 },
		);
	}
}
