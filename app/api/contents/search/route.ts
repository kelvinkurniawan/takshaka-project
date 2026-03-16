import { getDB } from "@/lib/db";
import { contents, categories } from "@/lib/schema";
import { isNull, eq, ilike, and, gte, lte, or } from "drizzle-orm";
import { z } from "zod";
import { requireAuth } from "@/lib/rbac";

export const dynamic = "force-dynamic";

const searchSchema = z.object({
	// Text search
	q: z.string().optional().default(""),
	// Filtering
	status: z.string().optional(), // draft, published, archived
	categoryId: z.string().transform(Number).optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	type: z.string().optional(),
	// Pagination
	page: z.string().transform(Number).optional().default("1"),
	limit: z.string().transform(Number).optional().default("10"),
	// Sorting
	sortBy: z
		.enum(["title", "createdAt", "updatedAt", "publishedAt"])
		.optional()
		.default("updatedAt"),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

type SearchParams = z.infer<typeof searchSchema>;

/**
 * Advanced search dengan filtering dan full-text search
 * GET /api/contents/search?q=keyword&status=published&categoryId=1&dateFrom=2024-01-01&dateTo=2024-12-31&sortBy=title&sortOrder=asc
 */
export async function GET(request: Request) {
	try {
		await requireAuth();
		const db = getDB(process.env);

		// Parse query parameters
		const url = new URL(request.url);
		const params = Object.fromEntries(url.searchParams);

		const validated = searchSchema.parse(params);

		// Build WHERE conditions
		const conditions: any[] = [];

		// Text search - search di title, content, excerpt
		if (validated.q) {
			const searchQuery = `%${validated.q}%`;
			conditions.push(
				or(
					ilike(contents.title, searchQuery),
					ilike(contents.excerpt, searchQuery),
					ilike(contents.content, searchQuery),
				),
			);
		}

		// Filter by status
		if (validated.status) {
			conditions.push(eq(contents.status, validated.status));
		}

		// Filter by category
		if (validated.categoryId) {
			conditions.push(eq(contents.categoryId, validated.categoryId));
		}

		// Filter by type
		if (validated.type) {
			conditions.push(eq(contents.type, validated.type));
		}

		// Filter by date range
		if (validated.dateFrom) {
			const fromDate = new Date(validated.dateFrom);
			conditions.push(gte(contents.createdAt, fromDate));
		}

		if (validated.dateTo) {
			const toDate = new Date(validated.dateTo);
			// Add 1 day to include the entire end date
			toDate.setDate(toDate.getDate() + 1);
			conditions.push(lte(contents.createdAt, toDate));
		}

		// Exclude soft-deleted items
		conditions.push(isNull(contents.deletedAt));

		// Build the query
		let query = db
			.select()
			.from(contents)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		// Sorting
		const sortField: any = {
			title: contents.title,
			createdAt: contents.createdAt,
			updatedAt: contents.updatedAt,
			publishedAt: contents.publishedAt,
		}[validated.sortBy];

		if (sortField) {
			query =
				validated.sortOrder === "asc"
					? query.orderBy(sortField)
					: query.orderBy(sortField);
		}

		// Execute query to get total count
		const allResults = await query;
		const total = allResults.length;

		// Apply pagination
		const offset = (validated.page - 1) * validated.limit;
		const paginatedResults = allResults.slice(offset, offset + validated.limit);

		const totalPages = Math.ceil(total / validated.limit);

		return Response.json({
			data: paginatedResults,
			pagination: {
				page: validated.page,
				limit: validated.limit,
				total,
				totalPages,
				hasNextPage: validated.page < totalPages,
				hasPrevPage: validated.page > 1,
			},
			meta: {
				searchQuery: validated.q,
				filters: {
					status: validated.status,
					categoryId: validated.categoryId,
					type: validated.type,
					dateRange:
						validated.dateFrom || validated.dateTo
							? {
									from: validated.dateFrom,
									to: validated.dateTo,
								}
							: null,
				},
			},
		});
	} catch (error) {
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		if (error instanceof z.ZodError) {
			return Response.json(
				{ error: "Invalid search parameters", details: error.issues },
				{ status: 400 },
			);
		}
		console.error("Error searching contents:", error);
		return Response.json(
			{ error: "Failed to search contents" },
			{ status: 500 },
		);
	}
}
