import { getSessionUserId } from "@/lib/session";
import { getDB } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import crypto from "crypto";

export const runtime = "nodejs";

const changePasswordSchema = z.object({
	currentPassword: z.string().min(1, "Current password is required"),
	newPassword: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.regex(/[A-Z]/, "Password must contain uppercase letter")
		.regex(/[0-9]/, "Password must contain number"),
	confirmPassword: z.string(),
});

function hashPassword(password: string): string {
	return crypto.createHash("sha256").update(password).digest("hex");
}

export async function POST(request: Request) {
	try {
		const userId = await getSessionUserId();

		if (!userId) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();

		// Validate input
		const validatedData = changePasswordSchema.parse(body);

		// Check if new password and confirm password match
		if (validatedData.newPassword !== validatedData.confirmPassword) {
			return Response.json(
				{ error: "New password and confirm password do not match" },
				{ status: 400 },
			);
		}

		const db = getDB(process.env);

		// Get current user
		const user = await db
			.select()
			.from(users)
			.where(eq(users.id, userId))
			.limit(1);

		if (!user[0]) {
			return Response.json({ error: "User not found" }, { status: 404 });
		}

		// Verify current password
		const hashedCurrentPassword = hashPassword(validatedData.currentPassword);
		if (user[0].password !== hashedCurrentPassword) {
			return Response.json(
				{ error: "Current password is incorrect" },
				{ status: 400 },
			);
		}

		// Hash new password
		const hashedNewPassword = hashPassword(validatedData.newPassword);

		// Update password
		await db
			.update(users)
			.set({ password: hashedNewPassword })
			.where(eq(users.id, userId));

		return Response.json({ success: true });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return Response.json(
				{ error: "Validation failed", details: error.errors },
				{ status: 400 },
			);
		}

		console.error("Change password error:", error);
		return Response.json(
			{ error: "Failed to change password" },
			{ status: 500 },
		);
	}
}
