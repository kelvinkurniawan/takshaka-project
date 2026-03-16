export const dynamic = "force-dynamic";

import { getDB } from "@/lib/db";
import { navigation } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const updateNavigationSchema = z.object({
	label: z.string().min(1, "Label is required").max(255).optional(),
	url: z.string().min(1, "URL is required").optional(),
	parentId: z.number().nullable().optional(),
	order: z.number().optional(),
	icon: z.string().optional().nullable(),
	target: z.enum(["_self", "_blank", "_parent", "_top"]).optional(),
	isActive: z.boolean().optional(),
	platform: z.enum(["desktop", "mobile"]).optional(),
});

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const db = getDB(process.env);
		const { id } = await params;
		const body = await request.json();

		const validatedData = updateNavigationSchema.parse(body);

		const result = await db
			.update(navigation)
			.set({
				...validatedData,
				updatedAt: new Date(),
			})
			.where(eq(navigation.id, parseInt(id)))
			.returning();

		if (result.length === 0) {
			return Response.json(
				{ error: "Navigation item not found" },
				{ status: 404 },
			);
		}

		return Response.json(result[0]);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return Response.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 },
			);
		}

		console.error("Error updating navigation:", error);
		return Response.json(
			{ error: "Failed to update navigation" },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const db = getDB(process.env);
		const { id } = await params;

		const result = await db
			.update(navigation)
			.set({
				deletedAt: new Date(),
				updatedAt: new Date(),
			})
			.where(eq(navigation.id, parseInt(id)))
			.returning();

		if (result.length === 0) {
			return Response.json(
				{ error: "Navigation item not found" },
				{ status: 404 },
			);
		}

		return Response.json({ success: true });
	} catch (error) {
		console.error("Error deleting navigation:", error);
		return Response.json(
			{ error: "Failed to delete navigation" },
			{ status: 500 },
		);
	}
}
