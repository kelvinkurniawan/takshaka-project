/**
 * Analytics Tracking Script
 *
 * Usage in public pages (Next.js):
 * Call this function in useEffect hook in a client component:
 *
 * import { trackPageView } from "@/lib/analytics-client";
 *
 * useEffect(() => {
 *   trackPageView(pathname, documentTitle, document.referrer);
 * }, [pathname]);
 */

export async function trackPageView(
	pageSlug: string,
	pageTitle?: string,
	referrer?: string,
) {
	try {
		// Get or create visitor ID from localStorage
		let visitorId = localStorage.getItem("analytics_visitor_id");

		if (!visitorId) {
			// Create a new visitor ID if doesn't exist
			visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
			localStorage.setItem("analytics_visitor_id", visitorId);
		}

		// Track page view
		const response = await fetch("/api/app/analytics/track", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				pageSlug,
				pageTitle: pageTitle || document.title,
				referrer: referrer || document.referrer,
			}),
		});

		if (!response.ok) {
			console.error("Failed to track page view:", response.statusText);
		}
	} catch (error) {
		// Silently fail - don't break the site if analytics fails
		console.error("Analytics tracking error:", error);
	}
}

/**
 * Alternative: Initialize automatic tracking for all page views
 * Call this once in your root layout
 */
export function initializeAnalytics() {
	if (typeof window === "undefined") return;

	// Track initial page load
	trackPageView(window.location.pathname, document.title, document.referrer);

	// Optionally: Track page changes if using Next.js router
	// (handled separately in useEffect hooks in components)
}
