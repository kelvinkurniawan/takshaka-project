import { getSessionUserId } from "@/lib/session";
import { getDB } from "@/lib/db";
import { pageViews, visitors } from "@/lib/schema";
import { count, sql } from "drizzle-orm";

export const runtime = "nodejs";

interface DateRange {
	startDate: Date;
	endDate: Date;
}

/**
 * Get analytics overview
 * GET /api/app/analytics/overview?days=30
 */
export async function GET(request: Request) {
	try {
		const userId = await getSessionUserId();

		if (!userId) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const days = parseInt(searchParams.get("days") || "30");

		const db = getDB();

		// Calculate date range
		const endDate = new Date();
		const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

		// Get total page views
		const totalViewsResult = await db
			.select({ count: count() })
			.from(pageViews)
			.where(
				sql`${pageViews.createdAt} >= ${startDate} AND ${pageViews.createdAt} <= ${endDate}`,
			);

		const totalViews = totalViewsResult[0]?.count || 0;

		// Get unique visitors
		const uniqueVisitorsResult = await db
			.select({ count: count() })
			.from(visitors)
			.where(
				sql`${visitors.firstVisit} >= ${startDate} AND ${visitors.firstVisit} <= ${endDate}`,
			);

		const uniqueVisitors = uniqueVisitorsResult[0]?.count || 0;

		// Get page views by page
		const pageViewsByPage = await db
			.select({
				pageSlug: pageViews.pageSlug,
				pageTitle: pageViews.pageTitle,
				views: count(),
			})
			.from(pageViews)
			.where(
				sql`${pageViews.createdAt} >= ${startDate} AND ${pageViews.createdAt} <= ${endDate}`,
			)
			.groupBy(pageViews.pageSlug, pageViews.pageTitle)
			.orderBy(sql`COUNT(*) DESC`)
			.limit(10);

		// Calculate trend (compare with previous period)
		const previousPeriodStart = new Date(
			startDate.getTime() - days * 24 * 60 * 60 * 1000,
		);
		const previousPeriodEnd = startDate;

		const previousViewsResult = await db
			.select({ count: count() })
			.from(pageViews)
			.where(
				sql`${pageViews.createdAt} >= ${previousPeriodStart} AND ${pageViews.createdAt} < ${previousPeriodEnd}`,
			);

		const previousViews = previousViewsResult[0]?.count || 0;

		const viewsTrend =
			previousViews > 0
				? (((totalViews - previousViews) / previousViews) * 100).toFixed(1)
				: totalViews > 0
					? "100"
					: "0";

		return Response.json({
			period: {
				days,
				startDate: startDate.toISOString(),
				endDate: endDate.toISOString(),
			},
			summary: {
				totalViews,
				uniqueVisitors,
				viewsTrend: parseFloat(viewsTrend),
				avgViewsPerVisitor:
					uniqueVisitors > 0 ? (totalViews / uniqueVisitors).toFixed(2) : 0,
			},
			topPages: pageViewsByPage,
		});
	} catch (error) {
		console.error("Analytics overview error:", error);
		return Response.json(
			{ error: "Failed to fetch analytics" },
			{ status: 500 },
		);
	}
}
