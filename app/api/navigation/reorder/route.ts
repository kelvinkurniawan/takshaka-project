export const runtime = "nodejs";

import { getDB } from "@/lib/db";
import { navigation } from "@/lib/schema";
import { eq, isNull, asc } from "drizzle-orm";
import { z } from "zod";

const reorderSchema = z.object({
	id: z.number(),
	direction: z.enum(["up", "down"]),
	parentId: z.number().nullable().optional(),
});

export async function POST(request: Request, context: any) {
	try {
		const { env } = context;
		const db = getDB(env);
		const body = await request.json();

		const { id, direction, parentId } = reorderSchema.parse(body);

		// Get the item being moved
		const movingItem = await db
			.select()
			.from(navigation)
			.where(eq(navigation.id, id))
			.limit(1);

		if (movingItem.length === 0) {
			return Response.json(
				{ error: "Navigation item not found" },
				{ status: 404 },
			);
		}

		// Get all siblings (same parent, not deleted)
		const siblings = await db
			.select()
			.from(navigation)
			.where(
				parentId === null || parentId === undefined
					? isNull(navigation.parentId)
					: eq(navigation.parentId, parentId || movingItem[0].parentId),
			)
			.where(isNull(navigation.deletedAt))
			.orderBy(asc(navigation.order));

		const currentItem = movingItem[0];
		const currentIndex = siblings.findIndex((s: { id: number }) => s.id === id);

		if (direction === "up" && currentIndex > 0) {
			const prevItem = siblings[currentIndex - 1];
			// Swap orders
			await db
				.update(navigation)
				.set({ order: prevItem.order, updatedAt: new Date() })
				.where(eq(navigation.id, currentItem.id));
			await db
				.update(navigation)
				.set({ order: currentItem.order, updatedAt: new Date() })
				.where(eq(navigation.id, prevItem.id));
		} else if (direction === "down" && currentIndex < siblings.length - 1) {
			const nextItem = siblings[currentIndex + 1];
			// Swap orders
			await db
				.update(navigation)
				.set({ order: nextItem.order, updatedAt: new Date() })
				.where(eq(navigation.id, currentItem.id));
			await db
				.update(navigation)
				.set({ order: currentItem.order, updatedAt: new Date() })
				.where(eq(navigation.id, nextItem.id));
		}

		return Response.json({ success: true });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return Response.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 },
			);
		}

		console.error("Error reordering navigation:", error);
		return Response.json(
			{ error: "Failed to reorder navigation" },
			{ status: 500 },
		);
	}
}
