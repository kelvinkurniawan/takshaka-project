import { getSessionUserId } from "@/lib/session";
import { getDB } from "@/lib/db";
import { auditLogs, users } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export const runtime = "nodejs";

// GET: Fetch notifications based on audit logs
export async function GET(request: Request) {
	try {
		const userId = await getSessionUserId();

		if (!userId) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Get query parameters
		const { searchParams } = new URL(request.url);
		const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
		const offset = parseInt(searchParams.get("offset") || "0");

		const db = getDB(process.env);

		// Get recent audit logs
		const logs = await db
			.select({
				id: auditLogs.id,
				userId: auditLogs.userId,
				action: auditLogs.action,
				entityType: auditLogs.entityType,
				entityId: auditLogs.entityId,
				entityName: auditLogs.entityName,
				createdAt: auditLogs.createdAt,
			})
			.from(auditLogs)
			.orderBy(desc(auditLogs.createdAt))
			.limit(limit)
			.offset(offset);

		// Get all unique user IDs from logs to fetch their names
		const userIds = [...new Set(logs.map((log: any) => log.userId))];
		let userMap: Record<number, string> = {};

		if (userIds.length > 0) {
			const { inArray } = await import("drizzle-orm");
			const usersList = await db
				.select({ id: users.id, name: users.name })
				.from(users)
				.where(inArray(users.id, userIds as number[]));

			usersList.forEach((user: any) => {
				userMap[user.id] = user.name;
			});
		}

		// Enrich logs with user names
		const enrichedLogs = logs.map((log: any) => ({
			...log,
			userName: userMap[log.userId] || "Unknown User",
		}));

		// Get total count for pagination
		const countResult = await db
			.select({ count: auditLogs.id })
			.from(auditLogs);

		const total = countResult.length;

		return Response.json({
			notifications: enrichedLogs,
			pagination: {
				limit,
				offset,
				total,
			},
		});
	} catch (error) {
		console.error("Notifications GET error:", error);
		return Response.json(
			{ error: "Failed to fetch notifications" },
			{ status: 500 },
		);
	}
}
