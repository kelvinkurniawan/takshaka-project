import { getDB } from "@/lib/db";
import { mediaGallery } from "@/lib/schema";
import { isNull, eq } from "drizzle-orm";
import { requireAuth } from "@/lib/rbac";

export const runtime = "nodejs";

/**
 * GET /api/media-gallery - Get all media
 */
export async function GET(request: Request, context: any) {
  try {
    await requireAuth();

    const { env } = context;
    const db = getDB(env);

    const media = await db
      .select()
      .from(mediaGallery)
      .where(isNull(mediaGallery.deletedAt))
      .orderBy(mediaGallery.createdAt);

    return Response.json(media);
  } catch (error) {
    console.error("Get media error:", error);
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    return Response.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

/**
 * DELETE /api/media-gallery/:id - Delete media (soft delete)
 */
export async function DELETE(request: Request, context: any) {
  try {
    await requireAuth();

    const url = new URL(request.url);
    const id = parseInt(url.searchParams.get("id") || "");

    if (!id) {
      return Response.json({ error: "Media ID is required" }, { status: 400 });
    }

    const { env } = context;
    const db = getDB(env);

    // Soft delete
    await db
      .update(mediaGallery)
      .set({ deletedAt: new Date() })
      .where(eq(mediaGallery.id, id));

    return Response.json({ success: true, message: "Media deleted" });
  } catch (error) {
    console.error("Delete media error:", error);
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    return Response.json({ error: "Failed to delete media" }, { status: 500 });
  }
}
