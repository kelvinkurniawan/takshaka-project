import { getPageSectionsFromDB, getFooterSections } from "@/lib/page-helpers";
import PrestigeEventClient from "./prestige-event-client";
import { getDB } from "@/lib/db";
import { galleryCategories, galleryOfWorks } from "@/lib/schema";
import { isNull } from "drizzle-orm";

// Revalidate every 60 seconds for ISR (Incremental Static Regeneration)
// This keeps the page fresh when database content changes
export const revalidate = 60;

export const metadata = {
	title: "Prestige Events",
	description:
		"Transformative events and conferences that create meaningful impact",
};

export default async function PrestigeEventPage() {
	const [prestigeEvents, footerSections, categories, items] = await Promise.all(
		[
			getPageSectionsFromDB("prestige-events"),
			getFooterSections(),
			getDB()
				.select()
				.from(galleryCategories)
				.where(isNull(galleryCategories.deletedAt))
				.orderBy(galleryCategories.displayOrder),
			getDB()
				.select()
				.from(galleryOfWorks)
				.where(isNull(galleryOfWorks.deletedAt))
				.orderBy(galleryOfWorks.displayOrder),
		],
	);

	if (!prestigeEvents) {
		return (
			<>
				<div className="text-center py-20">The Page Cannot Be Rendered</div>
			</>
		);
	}

	return (
		<PrestigeEventClient
			prestigeEvents={prestigeEvents}
			footerSections={footerSections}
			galleryCategories={categories}
			galleryItems={items}
		/>
	);
}
