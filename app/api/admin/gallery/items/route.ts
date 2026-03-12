import { getDB } from "@/lib/db";
import { galleryOfWorks } from "@/lib/schema";
import { eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { NextResponse } from "next/server";
import { revalidateAllPages } from "@/lib/revalidate";

const galleryItemSchema = z.object({
	categoryId: z.number().min(1, "Category is required"),
	title: z.string().min(1, "Title is required"),
	subtitle: z.string().optional(),
	description: z.string().optional(),
	imageUrl: z.string().url("Invalid image URL"),
	slug: z.string().min(1, "Slug is required"),
	displayOrder: z.number().default(0),
});

export const runtime = "nodejs";

// Get all gallery items
export async function GET(request: Request, context: any) {
	try {
		const db = getDB();
		const url = new URL(request.url);
		const categoryId = url.searchParams.get("categoryId");

		let query = db
			.select()
			.from(galleryOfWorks)
			.where(isNull(galleryOfWorks.deletedAt));

		if (categoryId) {
			const parsed = parseInt(categoryId);
			query = query.where(isNull(galleryOfWorks.deletedAt));
		}

		const items = await query.orderBy(galleryOfWorks.displayOrder);

		return NextResponse.json(items);
	} catch (error) {
		console.error("Failed to fetch gallery items:", error);
		return NextResponse.json(
			{ error: "Failed to fetch items" },
			{ status: 500 },
		);
	}
}

// Create new gallery item
export async function POST(request: Request, context: any) {
	try {
		const db = getDB();
		const body = await request.json();
		const userId = body.userId || 1; // Fallback for now

		const validatedData = galleryItemSchema.parse(body);

		// Check if slug already exists
		const existing = await db
			.select()
			.from(galleryOfWorks)
			.where(eq(galleryOfWorks.slug, validatedData.slug));

		const activeExisting = existing.filter(
			(item: any) => item.deletedAt === null,
		);
		if (activeExisting.length > 0) {
			return NextResponse.json(
				{ error: "Slug sudah digunakan" },
				{ status: 400 },
			);
		}

		const result = await db
			.insert(galleryOfWorks)
			.values({
				...validatedData,
				createdBy: userId,
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

		console.error("Failed to create gallery item:", error);
		return NextResponse.json(
			{ error: "Failed to create item" },
			{ status: 500 },
		);
	}
}

// Update gallery item
export async function PUT(request: Request, context: any) {
	try {
		const db = getDB();
		const body = await request.json();
		const { id, ...updateData } = body;

		if (!id) {
			return NextResponse.json(
				{ error: "Item ID is required" },
				{ status: 400 },
			);
		}

		const validatedData = galleryItemSchema.partial().parse(updateData);

		const result = await db
			.update(galleryOfWorks)
			.set({
				...validatedData,
				updatedAt: new Date(),
			})
			.where(eq(galleryOfWorks.id, id))
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

		console.error("Failed to update gallery item:", error);
		return NextResponse.json(
			{ error: "Failed to update item" },
			{ status: 500 },
		);
	}
}

// Delete gallery item (soft delete)
export async function DELETE(request: Request, context: any) {
	try {
		const db = getDB();
		const body = await request.json();
		const { id } = body;

		if (!id) {
			return NextResponse.json(
				{ error: "Item ID is required" },
				{ status: 400 },
			);
		}

		await db
			.update(galleryOfWorks)
			.set({ deletedAt: new Date() })
			.where(eq(galleryOfWorks.id, id));

		// Revalidate pages that use gallery data
		await revalidateAllPages();

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Failed to delete gallery item:", error);
		return NextResponse.json(
			{ error: "Failed to delete item" },
			{ status: 500 },
		);
	}
}
