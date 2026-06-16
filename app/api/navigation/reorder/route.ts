export const dynamic = "force-dynamic";

import { getDB } from "@/lib/db";
import { navigation } from "@/lib/schema";
import { eq, isNull, asc, and } from "drizzle-orm";
import { z } from "zod";
import { requireAuth, canEdit } from "@/lib/rbac";

const reorderSchema = z.object({
	id: z.number(),
	direction: z.enum(["up", "down"]),
	parentId: z.number().nullable().optional(),
	platform: z.enum(["desktop", "mobile"]).default("desktop"),
});

export async function POST(request: Request) {
	try {
		await requireAuth();
		const canEditCheck = await canEdit();
		if (!canEditCheck) {
			return Response.json({ error: "Forbidden" }, { status: 403 });
		}
		const db = getDB(process.env);
		const body = await request.json();

		const { id, direction, parentId, platform } = reorderSchema.parse(body);

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

		// Get all siblings (same parent, same platform, not deleted)
		const targetParentId = parentId !== undefined ? parentId : movingItem[0].parentId;
		const siblings = await db
			.select()
			.from(navigation)
			.where(
				and(
					targetParentId === null
						? isNull(navigation.parentId)
						: eq(navigation.parentId, targetParentId),
					isNull(navigation.deletedAt),
					eq(navigation.platform, platform),
				),
			)
			.orderBy(asc(navigation.order));

		const currentItem = movingItem[0];
		const currentIndex = siblings.findIndex((s: { id: number }) => s.id === id);

		if (direction === "up" && currentIndex > 0) {
			// Move item up: swap positions with previous item
			const newIndex = currentIndex - 1;
			const reorderedItems = [
				...siblings.slice(0, newIndex),
				siblings[currentIndex],
				siblings[newIndex],
				...siblings.slice(currentIndex + 1),
			];

			// Update all affected items with new order values
			for (let i = newIndex; i <= currentIndex; i++) {
				await db
					.update(navigation)
					.set({ order: i, updatedAt: new Date() })
					.where(eq(navigation.id, reorderedItems[i].id));
			}
		} else if (direction === "down" && currentIndex < siblings.length - 1) {
			// Move item down: swap positions with next item
			const newIndex = currentIndex + 1;
			const reorderedItems = [
				...siblings.slice(0, currentIndex),
				siblings[newIndex],
				siblings[currentIndex],
				...siblings.slice(newIndex + 1),
			];

			// Update all affected items with new order values
			for (let i = currentIndex; i <= newIndex; i++) {
				await db
					.update(navigation)
					.set({ order: i, updatedAt: new Date() })
					.where(eq(navigation.id, reorderedItems[i].id));
			}
		}

		return Response.json({ success: true });
	} catch (error) {
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
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
