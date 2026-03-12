import { getDB } from "@/lib/db";
import { galleryCategories } from "@/lib/schema";
import { eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { NextResponse } from "next/server";
import { revalidateAllPages } from "@/lib/revalidate";

const categorySchema = z.object({
	name: z.string().min(1, "Name is required"),
	slug: z.string().min(1, "Slug is required"),
	displayOrder: z.number().default(0),
});

export const runtime = "nodejs";

// Get all categories
export async function GET(request: Request, context: any) {
	try {
		const db = getDB();

		const categories = await db
			.select()
			.from(galleryCategories)
			.where(isNull(galleryCategories.deletedAt))
			.orderBy(galleryCategories.displayOrder);

		return NextResponse.json(categories);
	} catch (error) {
		console.error("Failed to fetch gallery categories:", error);
		return NextResponse.json(
			{ error: "Failed to fetch categories" },
			{ status: 500 },
		);
	}
}

// Create new category
export async function POST(request: Request, context: any) {
	try {
		const db = getDB();
		const body = await request.json();

		const validatedData = categorySchema.parse(body);

		// Check if slug already exists
		const existing = await db
			.select()
			.from(galleryCategories)
			.where(eq(galleryCategories.slug, validatedData.slug));

		const activeExisting = existing.filter(
			(cat: any) => cat.deletedAt === null,
		);
		if (activeExisting.length > 0) {
			return NextResponse.json(
				{ error: "Slug sudah digunakan" },
				{ status: 400 },
			);
		}

		const result = await db
			.insert(galleryCategories)
			.values({
				...validatedData,
			})
			.returning();

		// Revalidate pages that use gallery data
		await revalidateAllPages();

		return NextResponse.json(result[0]);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.errors },
				{ status: 400 },
			);
		}

		console.error("Failed to create gallery category:", error);
		return NextResponse.json(
			{ error: "Failed to create category" },
			{ status: 500 },
		);
	}
}

// Delete category (soft delete)
export async function DELETE(request: Request, context: any) {
	try {
		const db = getDB();
		const body = await request.json();
		const { id } = body;

		if (!id) {
			return NextResponse.json(
				{ error: "Category ID is required" },
				{ status: 400 },
			);
		}

		await db
			.update(galleryCategories)
			.set({ deletedAt: new Date() })
			.where(eq(galleryCategories.id, id));

		// Revalidate pages that use gallery data
		await revalidateAllPages();

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Failed to delete gallery category:", error);
		return NextResponse.json(
			{ error: "Failed to delete category" },
			{ status: 500 },
		);
	}
}
