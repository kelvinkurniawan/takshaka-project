import { getDB } from "@/lib/db";
import { pageViews, analyticsDaily } from "@/lib/schema";
import { sql, count } from "drizzle-orm";

export const runtime = "nodejs";

/**
 * Cron Job untuk aggregate analytics data ke table analytics_daily
 * Dipanggil setiap hari pada waktu tertentu (diatur di vercel.json)
 * GET /api/cron/aggregate-analytics
 */
export async function GET(request: Request) {
	try {
		// Cron must be configured with a secret in every environment.
		const authHeader = request.headers.get("authorization");
		const cronSecret = process.env.CRON_SECRET;

		if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}

		const db = getDB(process.env);

		// Get yesterday's date (untuk daily aggregation)
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);
		const yesterdayStr = yesterday.toISOString().split("T")[0]; // YYYY-MM-DD

		// Get all page slugs that have views in the last 24 hours
		const pageSlugResults = await db
			.selectDistinct({ pageSlug: pageViews.pageSlug })
			.from(pageViews)
			.where(sql`DATE(${pageViews.createdAt}) = ${yesterdayStr}`);

		const pageSlugList = pageSlugResults.map((r: any) => r.pageSlug);

		if (pageSlugList.length === 0) {
			return Response.json({
				success: true,
				message: "No data to aggregate",
				aggregatedPages: 0,
			});
		}

		// For each page slug, calculate stats and upsert to analytics_daily
		let aggregatedCount = 0;

		for (const pageSlug of pageSlugList) {
			// Get total views for this page on this date
			const totalViewsResult = await db
				.select({ count: count() })
				.from(pageViews)
				.where(
					sql`${pageViews.pageSlug} = ${pageSlug} AND DATE(${pageViews.createdAt}) = ${yesterdayStr}`,
				);

			const totalViews = totalViewsResult[0]?.count || 0;

			// Get unique visitors for this page on this date
			const uniqueVisitorsResult = await db
				.select({ count: count(sql`DISTINCT ${pageViews.visitorId}`) })
				.from(pageViews)
				.where(
					sql`${pageViews.pageSlug} = ${pageSlug} AND DATE(${pageViews.createdAt}) = ${yesterdayStr}`,
				);

			const uniqueVisitors = uniqueVisitorsResult[0]?.count || 0;

			// Calculate bounce rate (pages with only 1 view / total unique visitors)
			const singlePageViewVisitors = await db
				.select({ count: count() })
				.from(pageViews)
				.where(
					sql`${pageViews.pageSlug} = ${pageSlug} AND DATE(${pageViews.createdAt}) = ${yesterdayStr} AND ${pageViews.visitorId} IN (SELECT ${pageViews.visitorId} FROM ${pageViews} WHERE DATE(${pageViews.createdAt}) = ${yesterdayStr} GROUP BY ${pageViews.visitorId} HAVING COUNT(*) = 1)`,
				);

			const bounceRate =
				uniqueVisitors > 0
					? ((singlePageViewVisitors[0]?.count || 0) / uniqueVisitors).toFixed(
							2,
						)
					: "0";

			// Upsert into analytics_daily
			const existing = await db
				.select()
				.from(analyticsDaily)
				.where(
					sql`${analyticsDaily.date} = ${yesterdayStr} AND ${analyticsDaily.pageSlug} = ${pageSlug}`,
				)
				.limit(1);

			if (existing.length > 0) {
				// Update existing record
				await db
					.update(analyticsDaily)
					.set({
						totalViews,
						uniqueVisitors,
						bounceRate: parseFloat(bounceRate as string),
					})
					.where(
						sql`${analyticsDaily.date} = ${yesterdayStr} AND ${analyticsDaily.pageSlug} = ${pageSlug}`,
					);
			} else {
				// Insert new record
				await db.insert(analyticsDaily).values({
					date: yesterdayStr,
					pageSlug,
					totalViews,
					uniqueVisitors,
					bounceRate: parseFloat(bounceRate as string),
				});
			}

			aggregatedCount++;
		}

		return Response.json({
			success: true,
			message: `Analytics aggregation completed for ${yesterdayStr}`,
			aggregatedPages: aggregatedCount,
		});
	} catch (error) {
		console.error("Analytics aggregation error:", error);
		return Response.json(
			{
				error: "Failed to aggregate analytics",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}
