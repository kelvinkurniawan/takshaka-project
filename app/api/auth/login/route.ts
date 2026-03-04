import { z } from "zod";
import { verifyPassword } from "@/lib/auth";
import { setSessionCookie } from "@/lib/session";
import { getDB } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

// Use nodejs runtime to support better-sqlite3 in development and D1 in production
export const dynamic = "force-dynamic";

const loginSchema = z.object({
	email: z.string().email("Email tidak valid"),
	password: z.string().min(1, "Password tidak boleh kosong"),
});

export async function POST(request: Request) {
	try {
		const body = await request.json();

		// Validate input
		const validatedData = loginSchema.parse(body);

		// Get database instance with proper environment handling
		const db = getDB();

		try {
			// Find user by email using Drizzle ORM
			const userResult = await db
				.select({
					id: users.id,
					name: users.name,
					email: users.email,
					password: users.password,
				})
				.from(users)
				.where(eq(users.email, validatedData.email))
				.limit(1);

			const user = userResult[0];

			if (!user) {
				return Response.json(
					{ error: "Email atau password salah" },
					{ status: 401 },
				);
			}

			// Verify password
			const isPasswordValid = verifyPassword(
				validatedData.password,
				user.password,
			);

			if (!isPasswordValid) {
				return Response.json(
					{ error: "Email atau password salah" },
					{ status: 401 },
				);
			}

			// Set session cookie
			await setSessionCookie(user.id);

			return Response.json(
				{
					success: true,
					user: {
						id: user.id,
						name: user.name,
						email: user.email,
					},
				},
				{ status: 200 },
			);
		} catch (error) {
			console.error("Database error:", error);
			throw error;
		}
	} catch (error) {
		if (error instanceof z.ZodError) {
			return Response.json(
				{ error: "Validasi gagal", details: error.issues },
				{ status: 400 },
			);
		}

		console.error("Login error:", error);
		return Response.json({ error: "Gagal memproses login" }, { status: 500 });
	}
}
