import { getDB } from "@/lib/db";
import { pageViews, visitors } from "@/lib/schema";
import { eq, isNull } from "drizzle-orm";
import crypto from "crypto";

export const runtime = "nodejs";

/**
 * Track page view
 * POST /api/app/analytics/track
 * Body: { pageSlug, pageTitle, referrer }
 */
export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { pageSlug, pageTitle, referrer } = body;

		if (!pageSlug) {
			return Response.json({ error: "pageSlug is required" }, { status: 400 });
		}

		// Get visitor info from headers
		const userAgent = request.headers.get("user-agent") || "";
		const ipAddress =
			request.headers.get("x-forwarded-for") ||
			request.headers.get("x-real-ip") ||
			"unknown";

		// Create visitor ID from IP + UserAgent hash
		const visitorIdString = `${ipAddress}${userAgent}`;
		const visitorId = crypto
			.createHash("sha256")
			.update(visitorIdString)
			.digest("hex")
			.substring(0, 32); // Shortened for storage

		const db = getDB(process.env);

		// Record page view
		await db.insert(pageViews).values({
			pageSlug,
			pageTitle: pageTitle || null,
			visitorId,
			referrer: referrer || null,
			userAgent,
			ipAddress,
		});

		// Check if visitor exists
		const existingVisitor = await db
			.select()
			.from(visitors)
			.where(eq(visitors.visitorId, visitorId))
			.limit(1);

		if (existingVisitor.length === 0) {
			// New visitor
			const refererDomain = referrer ? new URL(referrer).hostname : null;

			await db.insert(visitors).values({
				visitorId,
				refererDomain,
				userAgent,
				ipAddress,
			});
		} else {
			// Update existing visitor
			await db
				.update(visitors)
				.set({
					lastVisit: new Date(),
					pageViewsCount: (existingVisitor[0].pageViewsCount || 0) + 1,
				})
				.where(eq(visitors.visitorId, visitorId));
		}

		return Response.json({ success: true, visitorId });
	} catch (error) {
		console.error("Track analytics error:", error);
		return Response.json(
			{ error: "Failed to track page view" },
			{ status: 500 },
		);
	}
}
