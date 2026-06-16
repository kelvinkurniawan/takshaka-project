import { getDB } from "@/lib/db";
import { loginLogs, users } from "@/lib/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { requireAuth } from "@/lib/rbac";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Query parameters:
// - limit: number of results (default 50)
// - offset: pagination offset (default 0)
// - success: filter by success/failure (optional)
// - userId: filter by user ID (optional)

export async function GET(request: Request) {
	try {
		await requireAuth();
		const url = new URL(request.url);
		const limit = parseInt(url.searchParams.get("limit") || "50", 10);
		const offset = parseInt(url.searchParams.get("offset") || "0", 10);
		const successParam = url.searchParams.get("success");
		const userIdParam = url.searchParams.get("userId");

		const db = getDB(process.env);

		// Build query with filters
		let allLogs = await db
			.select()
			.from(loginLogs)
			.orderBy(desc(loginLogs.createdAt));

		// Apply filters in memory
		if (successParam !== null) {
			const isSuccess = successParam === "true";
			allLogs = allLogs.filter((log: any) => log.success === isSuccess);
		}

		if (userIdParam) {
			const userId = parseInt(userIdParam, 10);
			allLogs = allLogs.filter((log: any) => log.userId === userId);
		}

		const total = allLogs.length;

		// Get paginated results
		const logs = allLogs.slice(offset, offset + limit);

		// Fetch user names for display
		const userIds = new Set(
			logs.filter((log: any) => log.userId).map((log: any) => log.userId),
		);

		let userMap: Record<number, string> = {};
		if (userIds.size > 0) {
			const userIdsArray = Array.from(userIds) as number[];
			const userList = await db
				.select({ id: users.id, name: users.name })
				.from(users)
				.where(inArray(users.id, userIdsArray));

			userList.forEach((user: any) => {
				userMap[user.id] = user.name;
			});
		}

		// Format response
		const formattedLogs = logs.map((log: any) => ({
			id: log.id,
			userId: log.userId,
			userName: log.userId ? userMap[log.userId] || "Unknown User" : null,
			email: log.email,
			success: log.success,
			failureReason: log.failureReason,
			ipAddress: log.ipAddress,
			createdAt: log.createdAt,
		}));

		return Response.json({
			logs: formattedLogs,
			pagination: {
				limit,
				offset,
				total,
				hasMore: offset + limit < total,
			},
		});
	} catch (error) {
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		console.error("Login logs fetch error:", error);
		return Response.json(
			{ error: "Failed to fetch login logs" },
			{ status: 500 },
		);
	}
}
