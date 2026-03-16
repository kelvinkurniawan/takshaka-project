import { getSessionUserId } from "@/lib/session";
import { getDB } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const runtime = "nodejs";

// Schema for updating profile
const updateProfileSchema = z.object({
	name: z.string().min(1, "Name is required").max(255),
	email: z.string().email("Invalid email"),
});

// GET: Fetch user profile
export async function GET() {
	try {
		const userId = await getSessionUserId();

		if (!userId) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}

		const db = getDB(process.env);

		const user = await db
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

		if (!user[0]) {
			return Response.json({ error: "User not found" }, { status: 404 });
		}

		return Response.json(user[0]);
	} catch (error) {
		console.error("Profile GET error:", error);
		return Response.json({ error: "Failed to fetch profile" }, { status: 500 });
	}
}

// POST: Update user profile
export async function POST(request: Request) {
	try {
		const userId = await getSessionUserId();

		if (!userId) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();

		// Validate input
		const validatedData = updateProfileSchema.parse(body);

		const db = getDB(process.env);

		// Check if email is already taken by another user
		const existingUser = await db
			.select()
			.from(users)
			.where(eq(users.email, validatedData.email))
			.limit(1);

		if (existingUser[0] && existingUser[0].id !== userId) {
			return Response.json({ error: "Email already in use" }, { status: 400 });
		}

		// Update user
		await db
			.update(users)
			.set({
				name: validatedData.name,
				email: validatedData.email,
			})
			.where(eq(users.id, userId));

		// Fetch updated user
		const updatedUser = await db
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

		return Response.json(updatedUser[0]);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return Response.json(
				{ error: "Validation failed", details: error.errors },
				{ status: 400 },
			);
		}

		console.error("Profile POST error:", error);
		return Response.json(
			{ error: "Failed to update profile" },
			{ status: 500 },
		);
	}
}
