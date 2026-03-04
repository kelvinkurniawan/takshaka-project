import { z } from "zod";
import { requireAuth, canEdit, canDelete } from "@/lib/rbac";
import { getDB } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq, ne, isNull, and } from "drizzle-orm";

// # Use nodejs runtime for Node.js database operations
export const dynamic = "force-dynamic";

const updateUserSchema = z.object({
	name: z.string().min(1, "Nama pengguna diperlukan").max(255),
	email: z.string().email("Email tidak valid"),
	role: z.enum(["admin", "editor", "viewer"]).default("editor"),
});

/**
 * GET /api/users/[id] - Get single user
 */
export async function GET(request: Request) {
	try {
		await requireAuth();

		const { id } = await context.params;
		const userId = parseInt(id);
		if (isNaN(userId)) {
			return Response.json(
				{ error: "ID pengguna tidak valid" },
				{ status: 400 },
			);
		}

		const db = getDB();

		const [user] = await db
			.select({
				id: users.id,
				name: users.name,
				email: users.email,
				role: users.role,
				createdAt: users.createdAt,
			})
			.from(users)
			.where(eq(users.id, userId))
			.where(isNull(users.deletedAt))
			.limit(1);

		if (!user) {
			return Response.json(
				{ error: "Pengguna tidak ditemukan" },
				{ status: 404 },
			);
		}

		return Response.json(user);
	} catch (error) {
		console.error("Get user error:", error);
		return Response.json(
			{ error: "Gagal mengambil pengguna" },
			{ status: 500 },
		);
	}
}

/**
 * PUT /api/users/[id] - Update user
 */
export async function PUT(request: Request) {
	try {
		await requireAuth();

		const canEditCheck = await canEdit();
		if (!canEditCheck) {
			return Response.json(
				{ error: "Anda tidak memiliki izin untuk mengubah pengguna" },
				{ status: 403 },
			);
		}

		const { id } = await context.params;
		const userId = parseInt(id);
		if (isNaN(userId)) {
			return Response.json(
				{ error: "ID pengguna tidak valid" },
				{ status: 400 },
			);
		}

		const body = await request.json();
		const validatedData = updateUserSchema.parse(body);

		const db = getDB();

		// Check if user exists
		const [existing] = await db
			.select()
			.from(users)
			.where(eq(users.id, userId))
			.where(isNull(users.deletedAt))
			.limit(1);

		if (!existing) {
			return Response.json(
				{ error: "Pengguna tidak ditemukan" },
				{ status: 404 },
			);
		}

		// Check if email is unique (and not the same as current, exclude soft deleted)
		const [emailCheck] = await db
			.select()
			.from(users)
			.where(
				and(
					eq(users.email, validatedData.email),
					ne(users.id, userId),
					isNull(users.deletedAt),
				),
			)
			.limit(1);

		if (emailCheck) {
			return Response.json({ error: "Email sudah digunakan" }, { status: 400 });
		}

		// Update user
		await db
			.update(users)
			.set({
				name: validatedData.name,
				email: validatedData.email,
				role: validatedData.role,
			})
			.where(eq(users.id, userId));

		// Fetch updated user
		const [user] = await db
			.select({
				id: users.id,
				name: users.name,
				email: users.email,
				role: users.role,
				createdAt: users.createdAt,
			})
			.from(users)
			.where(eq(users.id, userId))
			.limit(1);

		return Response.json(user);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return Response.json(
				{ error: "Validasi gagal", details: error.issues },
				{ status: 400 },
			);
		}

		console.error("Update user error:", error);
		return Response.json({ error: "Gagal mengubah pengguna" }, { status: 500 });
	}
}

/**
 * DELETE /api/users/[id] - Delete user
 */
export async function DELETE(request: Request) {
	try {
		await requireAuth();

		const canDeleteCheck = await canDelete();
		if (!canDeleteCheck) {
			return Response.json(
				{ error: "Anda tidak memiliki izin untuk menghapus pengguna" },
				{ status: 403 },
			);
		}

		const { id } = await context.params;
		const userId = parseInt(id);
		if (isNaN(userId)) {
			return Response.json(
				{ error: "ID pengguna tidak valid" },
				{ status: 400 },
			);
		}

		const db = getDB();

		// Check if user exists
		const [existing] = await db
			.select()
			.from(users)
			.where(eq(users.id, userId))
			.where(isNull(users.deletedAt))
			.limit(1);

		if (!existing) {
			return Response.json(
				{ error: "Pengguna tidak ditemukan" },
				{ status: 404 },
			);
		}

		// Soft delete user
		await db
			.update(users)
			.set({
				deletedAt: new Date(),
			})
			.where(eq(users.id, userId));

		return Response.json({
			success: true,
			message: "Pengguna berhasil dihapus",
		});
	} catch (error) {
		console.error("Delete user error:", error);
		if (error instanceof Error && error.message.includes("Forbidden")) {
			return Response.json({ error: error.message }, { status: 403 });
		}
		return Response.json(
			{ error: "Gagal menghapus pengguna" },
			{ status: 500 },
		);
	}
}
