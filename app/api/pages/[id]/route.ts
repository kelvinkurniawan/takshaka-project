import { getDB } from "@/lib/db";
import { pages } from "@/lib/schema";
import { eq, and, isNull } from "drizzle-orm";
import { z } from "zod";

export const runtime = "nodejs";

const updatePageSchema = z.object({
  title: z.string().min(1, "Title is required").max(255).optional(),
  slug: z.string().min(1, "Slug is required").max(255).optional(),
  content: z.string().min(1, "Content is required").optional(),
  status: z.enum(["draft", "published"]).optional(),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().max(500).optional(),
});

export async function GET(request: Request, context: any) {
  try {
    const { env, params } = context;
    const db = getDB(env);
    const pageId = parseInt(params.id);

    if (isNaN(pageId)) {
      return Response.json({ error: "Invalid page ID" }, { status: 400 });
    }

    const result = await db
      .select()
      .from(pages)
      .where(and(eq(pages.id, pageId), isNull(pages.deletedAt)))
      .limit(1);

    if (result.length === 0) {
      return Response.json({ error: "Page not found" }, { status: 404 });
    }

    return Response.json(result[0]);
  } catch (error) {
    console.error("Failed to fetch page:", error);
    return Response.json({ error: "Failed to fetch page" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: any) {
  try {
    const { env, params } = context;
    const db = getDB(env);
    const pageId = parseInt(params.id);
    const body = await request.json();

    if (isNaN(pageId)) {
      return Response.json({ error: "Invalid page ID" }, { status: 400 });
    }

    // Validate input
    const validatedData = updatePageSchema.parse(body);

    // Check if page exists
    const existing = await db
      .select()
      .from(pages)
      .where(and(eq(pages.id, pageId), isNull(pages.deletedAt)))
      .limit(1);

    if (existing.length === 0) {
      return Response.json({ error: "Page not found" }, { status: 404 });
    }

    // If slug is being updated, check for conflicts
    if (validatedData.slug) {
      const slugCheck = await db
        .select()
        .from(pages)
        .where(eq(pages.slug, validatedData.slug));

      const activePages = slugCheck.filter(
        (page: any) => page.deletedAt === null && page.id !== pageId,
      );

      if (activePages.length > 0) {
        return Response.json(
          { error: "Slug sudah digunakan" },
          { status: 400 },
        );
      }
    }

    // Update page
    await db
      .update(pages)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(pages.id, pageId));

    return Response.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 },
      );
    }

    console.error("Failed to update page:", error);
    return Response.json({ error: "Failed to update page" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const { env, params } = context;
    const db = getDB(env);
    const pageId = parseInt(params.id);

    if (isNaN(pageId)) {
      return Response.json({ error: "Invalid page ID" }, { status: 400 });
    }

    // Check if page exists
    const existing = await db
      .select()
      .from(pages)
      .where(and(eq(pages.id, pageId), isNull(pages.deletedAt)))
      .limit(1);

    if (existing.length === 0) {
      return Response.json({ error: "Page not found" }, { status: 404 });
    }

    // Soft delete
    await db
      .update(pages)
      .set({ deletedAt: new Date() })
      .where(eq(pages.id, pageId));

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete page:", error);
    return Response.json({ error: "Failed to delete page" }, { status: 500 });
  }
}
