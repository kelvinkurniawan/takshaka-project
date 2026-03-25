import { getDB } from "@/lib/db";
import { sql } from "drizzle-orm";
import { users } from "@/lib/schema";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	try {
		const db = getDB(process.env);
		// Simple query to test DB connection
		const result = await db.select().from(users).limit(1);

		return Response.json({
			success: true,
			message: "Database connection OK",
			usersCount: result.length,
		});
	} catch (error) {
		console.error("Health check error:", error);
		return Response.json(
			{
				success: false,
				error: String(error),
				errorFrom: "Failed to connect to the database or execute query",
			},
			{ status: 500 },
		);
	}
}
