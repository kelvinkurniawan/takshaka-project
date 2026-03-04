import { z } from "zod";
import { hashPassword } from "@/lib/auth";

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

		// Use better-sqlite3 directly
		const Database = require("better-sqlite3");
		const db = new Database("dev.db");

		try {
			// Check if user already exists
			const existingUser = db
				.prepare("SELECT id FROM users WHERE email = ?")
				.get(validatedData.email);

			if (existingUser) {
				db.close();
				return Response.json(
					{ error: "User dengan email ini sudah exist" },
					{ status: 400 },
				);
			}

			// Hash password
			const hashedPassword = hashPassword(validatedData.password);

			// Insert user
			const stmt = db.prepare(`
        INSERT INTO users (name, email, password, created_at)
        VALUES (?, ?, ?, ?)
      `);

			stmt.run(
				validatedData.name || validatedData.email.split("@")[0],
				validatedData.email,
				hashedPassword,
				Date.now(),
			);

			db.close();

			return Response.json(
				{
					success: true,
					message: "User berhasil dibuat",
					user: {
						email: validatedData.email,
						name: validatedData.name || validatedData.email.split("@")[0],
					},
				},
				{ status: 201 },
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

		console.error("Seed error:", error);
		return Response.json({ error: "Gagal membuat user" }, { status: 500 });
	}
}
