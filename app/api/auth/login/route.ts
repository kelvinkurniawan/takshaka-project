import { z } from "zod";
import { verifyPassword } from "@/lib/auth";
import { setSessionCookie } from "@/lib/session";

export const runtime = "edge";
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

		// Use better-sqlite3 directly
		const Database = require("better-sqlite3");
		const db = new Database("dev.db");

		try {
			// Find user by email
			const user = db
				.prepare("SELECT id, name, email, password FROM users WHERE email = ?")
				.get(validatedData.email) as any;

			if (!user) {
				db.close();
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
				db.close();
				return Response.json(
					{ error: "Email atau password salah" },
					{ status: 401 },
				);
			}

			db.close();

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
			db.close();
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
