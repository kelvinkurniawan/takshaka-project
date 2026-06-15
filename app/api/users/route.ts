import { z } from "zod";
import { requireAuth, canEdit, canDelete } from "@/lib/rbac";
import { hashPassword } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq, isNull } from "drizzle-orm";
import { getSessionUserId } from "@/lib/session";

export const dynamic = "force-dynamic";

const createUserSchema = z.object({
	name: z.string().min(1, "Nama pengguna diperlukan").max(255),
	email: z.string().email("Email tidak valid"),
	password: z.string().min(6, "Password minimal 6 karakter"),
	role: z.enum(["admin", "editor", "viewer"]).default("editor"),
});

const updateUserSchema = z.object({
	name: z.string().min(1, "Nama pengguna diperlukan").max(255),
	email: z.string().email("Email tidak valid"),
	role: z.enum(["admin", "editor", "viewer"]).default("editor"),
});

/**
 * GET /api/users - Get all users
 */
export async function GET(request: Request) {
	try {
		await requireAuth();

		const db = getDB(process.env);

		const usersData = await db
			.select({
				id: users.id,
				name: users.name,
				email: users.email,
				role: users.role,
				createdAt: users.createdAt,
			})
			.from(users)
			.where(isNull(users.deletedAt));

		return Response.json(usersData);
	} catch (error) {
		console.error("Get users error:", error);
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		return Response.json(
			{ error: "Gagal mengambil pengguna" },
			{ status: 500 },
		);
	}
}

/**
 * POST /api/users - Create new user
 */
export async function POST(request: Request) {
	try {
		await requireAuth();

		// Check if user can edit
		const canEditCheck = await canEdit();
		if (!canEditCheck) {
			return Response.json(
				{ error: "Anda tidak memiliki izin untuk membuat pengguna" },
				{ status: 403 },
			);
		}

		const body = await request.json();
		const validatedData = createUserSchema.parse(body);

		const db = getDB(process.env);

		// Check if email already exists (exclude soft deleted)
		const existing = await db
			.select()
			.from(users)
			.where(eq(users.email, validatedData.email));

		// Filter out soft deleted users manually
		const activeUsers = existing.filter(
			(user: { deletedAt: null }) => user.deletedAt === null,
		);
		if (activeUsers.length > 0) {
			return Response.json({ error: "Email sudah digunakan" }, { status: 400 });
		}

		const hashedPassword = hashPassword(validatedData.password);

		const result = await db
			.insert(users)
			.values({
				name: validatedData.name,
				email: validatedData.email,
				password: hashedPassword,
				role: validatedData.role,
				createdAt: new Date(),
			})
			.returning();

		return Response.json(
			{
				id: result[0].id,
				name: result[0].name,
				email: result[0].email,
				role: result[0].role,
				createdAt: result[0].createdAt,
			},
			{ status: 201 },
		);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return Response.json(
				{ error: "Validasi gagal", details: error.issues },
				{ status: 400 },
			);
		}

		console.error("Create user error:", error);
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		return Response.json({ error: "Gagal membuat pengguna" }, { status: 500 });
	}
}
