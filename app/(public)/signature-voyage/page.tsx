import { getPageSectionsFromDB, getFooterSections } from "@/lib/page-helpers";
import SignatureVoyageClient from "./signature-voyage-client";
import { getDB } from "@/lib/db";
import { galleryCategories, galleryOfWorks } from "@/lib/schema";
import { isNull } from "drizzle-orm";

// Revalidate every 60 seconds for ISR (Incremental Static Regeneration)
// This keeps the page fresh when database content changes
export const revalidate = 60;

export const metadata = {
	title: "Signature Voyage",
	description:
		"Experience unforgettable journeys and curated travel adventures",
};

export default async function SignatureVoyagePage() {
	const [signatureVoyage, footerSections, categories, items] =
		await Promise.all([
			getPageSectionsFromDB("signature-voyage"),
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
		]);

	if (!signatureVoyage) {
		return (
			<>
				<div className="text-center py-20">The Page Cannot Be Rendered</div>
			</>
		);
	}

	return (
		<SignatureVoyageClient
			signatureVoyage={signatureVoyage}
			footerSections={footerSections}
			galleryCategories={categories}
			galleryItems={items}
		/>
	);
}
