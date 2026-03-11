import { getSessionUserId } from "@/lib/session";
import { getDB } from "@/lib/db";
import { pageViews, visitors } from "@/lib/schema";
import { count, sql, desc } from "drizzle-orm";

export const runtime = "nodejs";

/**
 * Get detailed page analytics
 * GET /api/app/analytics/pages?days=30
 */
export async function GET(request: Request) {
	try {
		const userId = await getSessionUserId();

		if (!userId) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const days = parseInt(searchParams.get("days") || "30");
		const pageSlug = searchParams.get("pageSlug");

		const db = getDB();

		const endDate = new Date();
		const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

		// Get all page stats
		let query = db
			.select({
				pageSlug: pageViews.pageSlug,
				pageTitle: pageViews.pageTitle,
				totalViews: count(),
			})
			.from(pageViews)
			.where(
				sql`${pageViews.createdAt} >= ${startDate} AND ${pageViews.createdAt} <= ${endDate}`,
			)
			.groupBy(pageViews.pageSlug, pageViews.pageTitle)
			.orderBy(desc(count()));

		const allPages = await query;

		// If specific page requested, get detailed stats for that page
		let pageDetail = null;
		if (pageSlug) {
			const detailedStats = await db
				.select({
					pageSlug: pageViews.pageSlug,
					pageTitle: pageViews.pageTitle,
					totalViews: count(),
				})
				.from(pageViews)
				.where(
					sql`${pageViews.pageSlug} = ${pageSlug} AND ${pageViews.createdAt} >= ${startDate} AND ${pageViews.createdAt} <= ${endDate}`,
				)
				.groupBy(pageViews.pageSlug, pageViews.pageTitle);

			if (detailedStats.length > 0) {
				pageDetail = detailedStats[0];
			}

			// Get referrers for this page
			const referrerStats = await db
				.select({
					referrer: pageViews.referrer,
					count: count(),
				})
				.from(pageViews)
				.where(
					sql`${pageViews.pageSlug} = ${pageSlug} AND ${pageViews.createdAt} >= ${startDate} AND ${pageViews.createdAt} <= ${endDate}`,
				)
				.groupBy(pageViews.referrer)
				.orderBy(desc(count()))
				.limit(10);

			pageDetail = {
				...pageDetail,
				topReferrers: referrerStats.filter((r: any) => r.referrer),
			};
		}

		// Get daily stats for chart
		const dailyStats = await db
			.select({
				date: sql<string>`DATE(${pageViews.createdAt})`,
				views: count(),
			})
			.from(pageViews)
			.where(
				sql`${pageViews.createdAt} >= ${startDate} AND ${pageViews.createdAt} <= ${endDate}`,
			)
			.groupBy(sql`DATE(${pageViews.createdAt})`)
			.orderBy(sql`DATE(${pageViews.createdAt})`);

		return Response.json({
			period: {
				days,
				startDate,
				endDate,
			},
			pages: allPages,
			pageDetail,
			dailyStats,
		});
	} catch (error) {
		console.error("Pages analytics error:", error);
		return Response.json(
			{ error: "Failed to fetch page analytics" },
			{ status: 500 },
		);
	}
}
