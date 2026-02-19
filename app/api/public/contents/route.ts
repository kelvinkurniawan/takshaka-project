import { getDB } from "@/lib/db";
import { contents } from "@/lib/schema";
import { isNull, eq, desc } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, context: any) {
	try {
		const { searchParams } = new URL(request.url);
		const type = searchParams.get("type");
		const categoryId = searchParams.get("categoryId");

		const { env } = context;
		const db = getDB(env);

		// Fetch all non-deleted contents
		const allContents = await db
			.select()
			.from(contents)
			.orderBy(desc(contents.publishedAt || contents.createdAt));

		// Filter published contents
		let filteredContents = allContents.filter(
			(item: any) => item.deletedAt === null && item.status === "published",
		);

		// Filter by type if provided
		if (type) {
			filteredContents = filteredContents.filter(
				(item: any) => item.type === type,
			);
		}

		// Filter by category if provided
		if (categoryId) {
			filteredContents = filteredContents.filter(
				(item: any) => item.categoryId === parseInt(categoryId),
			);
		}

		return Response.json(filteredContents);
	} catch (error) {
		console.error("Failed to fetch public contents:", error);
		return Response.json(
			{ error: "Failed to fetch contents" },
			{ status: 500 },
		);
	}
}
