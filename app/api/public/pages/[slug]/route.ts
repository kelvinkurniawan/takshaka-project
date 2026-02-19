import { getDB } from "@/lib/db";
import { pages } from "@/lib/schema";
import { isNull, eq } from "drizzle-orm";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request: Request, context: any) {
	try {
		const { params } = context;
		const { slug } = await params;

		const { env } = context;
		const db = getDB(env);

		// Fetch page by slug
		const allPages = await db.select().from(pages).where(eq(pages.slug, slug));

		const activePage = allPages.find((page: any) => page.deletedAt === null);

		if (!activePage) {
			return Response.json({ error: "Page not found" }, { status: 404 });
		}

		// Check if published
		if (activePage.status !== "published") {
			return Response.json({ error: "Page not found" }, { status: 404 });
		}

		return Response.json(activePage);
	} catch (error) {
		console.error("Failed to fetch public page:", error);
		return Response.json({ error: "Failed to fetch page" }, { status: 500 });
	}
}
