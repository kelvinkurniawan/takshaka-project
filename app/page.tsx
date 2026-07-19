import PublicHeader from "@/components/PublicHeader";
import RouteProgress from "@/components/RouteProgress";

import {
	createRequestDB,
	getPageSectionsFromDB,
	getFooterSections,
	transformPageSectionsWithDynamicTabs,
	getSocialMediaLinks,
} from "@/lib/page-helpers";
import HomePageClient from "./home-client";

// Revalidate every 60 seconds for ISR (Incremental Static Regeneration)
// This keeps the page fresh when database content changes
export const revalidate = 60;

export default async function Home() {
	// ✅ Create ONE database instance for this entire request
	const db = createRequestDB();

	// ✅ Get settings and page sections using the same db instance
	const [homeSectionsRaw] = await Promise.all([
		getPageSectionsFromDB("home", db),
	]);

	// Transform sections to generate dynamic tabs from selectedCategoryIds
	// ✅ Pass db parameter to maintain single connection
	const homeSections = await transformPageSectionsWithDynamicTabs(
		homeSectionsRaw,
		db,
	);

	// If dynamic page sections exist, use them
	if (!homeSections) {
		return (
			<>
				<div className="text-center py-20">The Section Cannot Be Rendered</div>
			</>
		);
	}

	// Pass data to client component for tracking and rendering
	return (
		<div className="page-transition">
			<RouteProgress />
			<PublicHeader />
			<HomePageClient
				homeSections={homeSections}
				footerSections={getFooterSections()}
				socialLinks={await getSocialMediaLinks()}
			/>
		</div>
	);
}
