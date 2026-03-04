import { getDB } from "@/lib/db";
import { contents } from "@/lib/schema";
import { isNull, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ slug: string }> },
) {
	try {
		const { slug } = await params;

		const db = getDB();

		// Fetch content by slug
		const allContents = await db
			.select()
			.from(contents)
			.where(eq(contents.slug, slug));

		const activeContent = allContents.find(
			(item: any) => item.deletedAt === null,
		);

		if (!activeContent) {
			return Response.json({ error: "Content not found" }, { status: 404 });
		}

		// Check if published
		if (activeContent.status !== "published") {
			return Response.json({ error: "Content not found" }, { status: 404 });
		}

		return Response.json(activeContent);
	} catch (error) {
		console.error("Failed to fetch public content:", error);
		return Response.json({ error: "Failed to fetch content" }, { status: 500 });
	}
}
