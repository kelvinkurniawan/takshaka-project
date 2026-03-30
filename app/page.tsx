import PublicHeader from "@/components/PublicHeader";

import {
	createRequestDB,
	getSettingsFromDB,
	getPageSectionsFromDB,
	getPageByIdFromDB,
	PageContentRenderer,
	type Page,
	getFooterSections,
	transformPageSectionsWithDynamicTabs,
} from "@/lib/page-helpers";
import HomePageClient from "./home-client";

// Revalidate every 60 seconds for ISR (Incremental Static Regeneration)
// This keeps the page fresh when database content changes
export const revalidate = 60;

export default async function Home() {
	// ✅ Create ONE database instance for this entire request
	const db = createRequestDB();

	// ✅ Get settings and page sections using the same db instance
	const [settings, homeSectionsRaw] = await Promise.all([
		getSettingsFromDB(db),
		getPageSectionsFromDB("home", db),
	]);

	// Transform sections to generate dynamic tabs from selectedCategoryIds
	// ✅ Pass db parameter to maintain single connection
	const homeSections = await transformPageSectionsWithDynamicTabs(
		homeSectionsRaw,
		db,
	);

	// Check if index_page is set
	// const indexPageId = settings?.index_page
	// 	? parseInt(settings.index_page, 10)
	// 	: null;
	// let indexPage: Page | null = null;

	// if (indexPageId && !isNaN(indexPageId)) {
	// 	indexPage = await getPageByIdFromDB(indexPageId, db);
	// }

	// If index page is set and found, render it
	// if (indexPage) {
	// 	return (
	// 		<>
	// 			<PublicHeader />
	// 			<div className="public-light flex flex-col min-h-screen bg-white text-gray-900">
	// 				<main className="flex-1">
	// 					<div className="min-h-screen">
	// 						<article
	// 							data-aos="fade-up"
	// 							data-aos-duration="800"
	// 							className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12"
	// 						>
	// 							<div className="index-page-content">
	// 								<PageContentRenderer content={indexPage.content} />
	// 							</div>
	// 						</article>
	// 					</div>
	// 				</main>
	// 			</div>
	// 		</>
	// 	);
	// }

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
		<>
			<PublicHeader />
			<HomePageClient
				homeSections={homeSections}
				footerSections={getFooterSections()}
			/>
		</>
	);
}
