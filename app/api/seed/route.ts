import { z } from "zod";
import { hashPassword } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const seedSchema = z.object({
	email: z.string().email("Email tidak valid"),
	password: z.string().min(6, "Password minimal 6 karakter"),
	name: z.string().optional(),
});

export async function POST(request: Request) {
	try {
		const body = await request.json();

		// Validate input
		const validatedData = seedSchema.parse(body);

		const db = getDB(process.env);

		// Check if user already exists
		const existingUsers = await db
			.select()
			.from(users)
			.where(eq(users.email, validatedData.email));

		const activeUser = existingUsers.filter((user: any) => user.deletedAt === null);

		if (activeUser.length > 0) {
			return Response.json(
				{ error: "User dengan email ini sudah exist" },
				{ status: 400 },
			);
		}

		// Hash password
		const hashedPassword = hashPassword(validatedData.password);

		// Insert user
		const result = await db
			.insert(users)
			.values({
				name: validatedData.name || validatedData.email.split("@")[0],
				email: validatedData.email,
				password: hashedPassword,
				role: "editor",
				createdAt: new Date(),
			})
			.returning();

		return Response.json(
			{
				success: true,
				message: "User berhasil dibuat",
				user: {
					id: result[0].id,
					email: result[0].email,
					name: result[0].name,
				},
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

		console.error("Seed error:", error);
		return Response.json({ error: "Gagal membuat user" }, { status: 500 });
	}
}
