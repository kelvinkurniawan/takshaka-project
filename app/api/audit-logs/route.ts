import { getDB } from "@/lib/db";
import { auditLogs, users } from "@/lib/schema";
import { eq, desc, gte, lte, and, isNull, or } from "drizzle-orm";
import { z } from "zod";
import { requireAuth } from "@/lib/rbac";

export const dynamic = "force-dynamic";

const querySchema = z.object({
	entityType: z.string().optional(),
	entityId: z.string().transform(Number).optional(),
	action: z.string().optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	page: z.string().transform(Number).optional().default("1"),
	limit: z.string().transform(Number).optional().default("20"),
});

/**
 * Get audit logs dengan filtering
 * GET /api/audit-logs?entityType=contents&entityId=1&action=update
 */
export async function GET(request: Request) {
	try {
		await requireAuth();
		const db = getDB();

		const url = new URL(request.url);
		const params = Object.fromEntries(url.searchParams);

		const validated = querySchema.parse(params);

		const conditions: any[] = [];

		if (validated.entityType) {
			conditions.push(eq(auditLogs.entityType, validated.entityType));
		}

		if (validated.entityId) {
			conditions.push(eq(auditLogs.entityId, validated.entityId));
		}

		if (validated.action) {
			conditions.push(eq(auditLogs.action, validated.action));
		}

		if (validated.dateFrom) {
			conditions.push(gte(auditLogs.createdAt, new Date(validated.dateFrom)));
		}

		if (validated.dateTo) {
			const toDate = new Date(validated.dateTo);
			toDate.setDate(toDate.getDate() + 1);
			conditions.push(lte(auditLogs.createdAt, toDate));
		}

		let query = db
			.select()
			.from(auditLogs)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(auditLogs.createdAt));

		const allResults = await query;
		const total = allResults.length;

		const offset = (validated.page - 1) * validated.limit;
		const paginatedResults = allResults.slice(offset, offset + validated.limit);

		// Enrich dengan user info
		const userIds = [
			...new Set(paginatedResults.map((log: any) => log.userId)),
		];
		const userMap = new Map();

		if (userIds.length > 0) {
			const userRecords = await db.select().from(users);
			userRecords.forEach((user: any) => {
				userMap.set(user.id, {
					id: user.id,
					name: user.name,
					email: user.email,
				});
			});
		}

		const enrichedResults = paginatedResults.map((log: any) => {
			const changes = log.changes ? JSON.parse(log.changes) : null;
			const oldValues = log.oldValues ? JSON.parse(log.oldValues) : null;
			const newValues = log.newValues ? JSON.parse(log.newValues) : null;
			const metadata = log.metadata ? JSON.parse(log.metadata) : null;

			return {
				...log,
				user: userMap.get(log.userId) || { id: log.userId },
				changes,
				oldValues,
				newValues,
				metadata,
			};
		});

		const totalPages = Math.ceil(total / validated.limit);

		return Response.json({
			data: enrichedResults,
			pagination: {
				page: validated.page,
				limit: validated.limit,
				total,
				totalPages,
				hasNextPage: validated.page < totalPages,
				hasPrevPage: validated.page > 1,
			},
		});
	} catch (error) {
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		console.error("Error fetching audit logs:", error);
		return Response.json(
			{ error: "Failed to fetch audit logs" },
			{ status: 500 },
		);
	}
}
