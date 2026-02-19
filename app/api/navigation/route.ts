export const runtime = "edge";
export const dynamic = "force-dynamic";

import { getDB } from "@/lib/db";
import { navigation } from "@/lib/schema";
import { isNull, eq, asc } from "drizzle-orm";
import { z } from "zod";

const createNavigationSchema = z.object({
	label: z.string().min(1, "Label is required").max(255),
	url: z.string().min(1, "URL is required"),
	parentId: z.number().nullable().optional(),
	order: z.number().default(0),
	icon: z.string().optional().nullable(),
	target: z.enum(["_self", "_blank", "_parent", "_top"]).default("_self"),
	isActive: z.boolean().default(true),
});

export async function GET(request: Request, context: any) {
	try {
		const { env } = context;
		const db = getDB(env);

		// Get all active navigation items
		const items = await db
			.select()
			.from(navigation)
			.where(isNull(navigation.deletedAt))
			.orderBy(asc(navigation.order), asc(navigation.id));

		// Build nested structure
		const buildTree = (items: any[], parentId: number | null = null): any[] => {
			return items
				.filter((item) => item.parentId === parentId)
				.map((item) => ({
					...item,
					children: buildTree(items, item.id),
				}))
				.sort((a, b) => a.order - b.order);
		};

		const tree = buildTree(items);

		return Response.json(tree);
	} catch (error) {
		console.error("Error fetching navigation:", error);
		return Response.json(
			{ error: "Failed to fetch navigation" },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request, context: any) {
	try {
		const { env } = context;
		const db = getDB(env);
		const body = await request.json();

		const validatedData = createNavigationSchema.parse(body);

		const result = await db
			.insert(navigation)
			.values({
				...validatedData,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.returning();

		return Response.json(result[0], { status: 201 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return Response.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 },
			);
		}

		console.error("Error creating navigation:", error);
		return Response.json(
			{ error: "Failed to create navigation" },
			{ status: 500 },
		);
	}
}
