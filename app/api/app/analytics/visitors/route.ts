import { getSessionUserId } from "@/lib/session";
import { getDB } from "@/lib/db";
import { visitors, pageViews } from "@/lib/schema";
import { count, sql, desc } from "drizzle-orm";

export const runtime = "nodejs";

/**
 * Get visitor analytics
 * GET /api/app/analytics/visitors?days=30
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

		const endDate = new Date();
		const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

		// Get total new visitors count
		const newVisitorsResult = await db
			.select({ count: count() })
			.from(visitors)
			.where(
				sql`${visitors.firstVisit} >= ${startDate} AND ${visitors.firstVisit} <= ${endDate}`,
			);

		const newVisitors = newVisitorsResult[0]?.count || 0;

		// Get returning visitors
		const returningVisitorsResult = await db
			.select({ count: count() })
			.from(visitors)
			.where(
				sql`${visitors.lastVisit} >= ${startDate} AND ${visitors.lastVisit} <= ${endDate} AND ${visitors.lastVisit} != ${visitors.firstVisit}`,
			);

		const returningVisitors = returningVisitorsResult[0]?.count || 0;

		// Get visitor distribution by page views count
		const pageViewsDistribution = await db
			.select({
				pageViewsCount: visitors.pageViewsCount,
				count: count(),
			})
			.from(visitors)
			.where(
				sql`${visitors.firstVisit} >= ${startDate} AND ${visitors.firstVisit} <= ${endDate}`,
			)
			.groupBy(visitors.pageViewsCount)
			.orderBy(desc(count()));

		// Get referrer sources
		const referrerSources = await db
			.select({
				refererDomain: visitors.refererDomain,
				count: count(),
			})
			.from(visitors)
			.where(
				sql`${visitors.firstVisit} >= ${startDate} AND ${visitors.firstVisit} <= ${endDate}`,
			)
			.groupBy(visitors.refererDomain)
			.orderBy(desc(count()))
			.limit(10);

		// Get daily visitor trend
		const dailyVisitorTrend = await db
			.select({
				date: sql<string>`DATE(${visitors.firstVisit})`,
				newVisitors: count(),
			})
			.from(visitors)
			.where(
				sql`${visitors.firstVisit} >= ${startDate} AND ${visitors.firstVisit} <= ${endDate}`,
			)
			.groupBy(sql`DATE(${visitors.firstVisit})`)
			.orderBy(sql`DATE(${visitors.firstVisit})`);

		// Calculate average page views per visitor
		const avgPageViewsResult = await db
			.select({
				avg: sql<number>`AVG(${visitors.pageViewsCount})`,
			})
			.from(visitors)
			.where(
				sql`${visitors.firstVisit} >= ${startDate} AND ${visitors.firstVisit} <= ${endDate}`,
			);

		const avgPageViewsPerVisitor = Number(avgPageViewsResult[0]?.avg) || 0;

		return Response.json({
			period: {
				days,
				startDate,
				endDate,
			},
			summary: {
				newVisitors,
				returningVisitors,
				avgPageViewsPerVisitor: avgPageViewsPerVisitor.toFixed(2),
				totalVisitors: newVisitors + returningVisitors,
			},
			pageViewsDistribution,
			topReferrers: referrerSources.filter((r: any) => r.refererDomain),
			dailyTrend: dailyVisitorTrend,
		});
	} catch (error) {
		console.error("Visitors analytics error:", error);
		return Response.json(
			{ error: "Failed to fetch visitor analytics" },
			{ status: 500 },
		);
	}
}
