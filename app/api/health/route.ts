import { getDB } from "@/lib/db";

export const runtime = "edge";
export const dynamic = "force-dynamic";

// Cloudflare bindings are injected into the request context
export async function GET(request: Request, context: any) {
	try {
		const { env } = context; // Ensure DB can be initialized
		const result = await getDB(env).run("SELECT 1 AS result"); // Simple query to test DB connection

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
