import { getDB } from "@/lib/db";
import { pages } from "@/lib/schema";
import { isNull, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export async function GET(request: Request) {
	try {
		const db = getDB(process.env);

		// Fetch all published pages (not deleted)
		const allPages = await db
			.select()
			.from(pages)
			.where(isNull(pages.deletedAt));

		// Filter published pages in application layer
		const publishedPages = allPages.filter(
			(page: any) => page.status === "published",
		);

		return Response.json(publishedPages);
	} catch (error) {
		console.error("Failed to fetch public pages:", error);
		return Response.json({ error: "Failed to fetch pages" }, { status: 500 });
	}
}
