import {
	createRequestDB,
	getPageSectionsFromDB,
	getFooterSections,
	transformWellnessEscapeWithDynamicDestinations,
} from "@/lib/page-helpers";
import WellnessEscapeClient from "./wellness-escape-client";
import { galleryCategories, galleryOfWorks } from "@/lib/schema";
import { isNull } from "drizzle-orm";

// Revalidate every 60 seconds for ISR (Incremental Static Regeneration)
// This keeps the page fresh when database content changes
export const revalidate = 60;

export const metadata = {
	title: "Wellness Escape",
	description:
		"Experience rejuvenating wellness and mindful retreat experiences",
};

export default async function WellnessEscapePage() {
	// ✅ Create ONE database instance for this entire request
	const db = createRequestDB();

	const wellnessEscapeRaw = await getPageSectionsFromDB("wellness-escape", db);

	// Transform sections to generate dynamic destinations from selectedCategoryIds
	// ✅ Pass db parameter to maintain single connection
	const wellnessEscape = await transformWellnessEscapeWithDynamicDestinations(
		wellnessEscapeRaw,
		db,
	);

	// ✅ Use the same db instance for all queries in Promise.all
	const [footerSections, categories, items] = await Promise.all([
		Promise.resolve(getFooterSections()),
		db
			.select()
			.from(galleryCategories)
			.where(isNull(galleryCategories.deletedAt))
			.orderBy(galleryCategories.displayOrder),
		db
			.select()
			.from(galleryOfWorks)
			.where(isNull(galleryOfWorks.deletedAt))
			.orderBy(galleryOfWorks.displayOrder),
	]);

	if (!wellnessEscape) {
		return (
			<>
				<div className="text-center py-20">The Page Cannot Be Rendered</div>
			</>
		);
	}

	return (
		<WellnessEscapeClient
			wellnessEscape={wellnessEscape}
			footerSections={footerSections}
			galleryCategories={categories}
			galleryItems={items}
		/>
	);
}
