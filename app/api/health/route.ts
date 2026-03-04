import { getDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	try {
		const db = getDB();
		// Simple query to test DB connection
		const result = await db.select().from(db.sql`SELECT 1 AS result`);

		return Response.json({
			success: true,
			db: result,
		});
	} catch (error) {
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
