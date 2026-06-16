import { getDB } from "@/lib/db";
import {
	contents,
	users,
	categories,
	pageViews,
	loginLogs,
} from "@/lib/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { requireAuth } from "@/lib/rbac";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	try {
		await requireAuth();
		const db = getDB(process.env);

		// Get today's date (start and end)
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const todayEnd = new Date(today);
		todayEnd.setHours(23, 59, 59, 999);

		// Fetch all data in parallel
		const [allContents, allUsers, allCategories, todayPageViews, recentLogins] =
			await Promise.all([
				db.select().from(contents),
				db.select().from(users),
				db.select().from(categories),
				db
					.select()
					.from(pageViews)
					.where(
						and(
							gte(pageViews.createdAt, today),
							lte(pageViews.createdAt, todayEnd),
						),
					),
				db
					.select()
					.from(loginLogs)
					.where(
						and(
							gte(loginLogs.createdAt, today),
							lte(loginLogs.createdAt, todayEnd),
							eq(loginLogs.success, true),
						),
					),
			]);

		// Filter active records (non-deleted)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const activeContents = allContents.filter((c: any) => c.deletedAt === null);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const activeUsers = allUsers.filter((u: any) => u.deletedAt === null);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const activeCategories = allCategories.filter(
			(cat: any) => cat.deletedAt === null,
		);

		// Count unique visitors today
		const uniqueVisitorsToday = new Set(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			todayPageViews.map((pv: any) => pv.visitorId),
		).size;

		// Calculate hourly breakdown
		const hourlyData: Record<number, number> = {};
		for (let i = 0; i < 24; i++) {
			hourlyData[i] = 0;
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		todayPageViews.forEach((pv: any) => {
			if (pv.createdAt) {
				const hour = new Date(pv.createdAt).getHours();
				hourlyData[hour] = (hourlyData[hour] || 0) + 1;
			}
		});

		// Convert to array for chart
		const hourlyBreakdown = Object.entries(hourlyData).map(([hour, count]) => ({
			hour: parseInt(hour),
			visitors: count,
		}));

		// Prepare recent login summary (last 5 successful logins today)
		const recentLoginSummary = recentLogins
			.slice(-5)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.map((log: any) => ({
				id: log.id,
				email: log.email,
				userName: log.userId ? "User" : "Unknown",
				time: log.createdAt,
			}));

		return Response.json({
			totals: {
				contents: activeContents.length,
				users: activeUsers.length,
				categories: activeCategories.length,
			},
			today: {
				totalPageViews: todayPageViews.length,
				uniqueVisitors: uniqueVisitorsToday,
				successfulLogins: recentLogins.length,
				hourlyBreakdown,
			},
			recentLogins: recentLoginSummary,
		});
	} catch (error) {
		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		console.error("Dashboard stats error:", error);
		return Response.json(
			{ error: "Failed to fetch dashboard stats" },
			{ status: 500 },
		);
	}
}
