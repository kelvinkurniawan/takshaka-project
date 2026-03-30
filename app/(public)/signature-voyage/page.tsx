import {
	createRequestDB,
	getPageSectionsFromDB,
	getFooterSections,
	transformSignatureVoyageWithDynamicDestinations,
} from "@/lib/page-helpers";
import SignatureVoyageClient from "./signature-voyage-client";
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
	// ✅ Create ONE database instance for this entire request
	const db = createRequestDB();

	const signatureVoyageRaw = await getPageSectionsFromDB(
		"signature-voyage",
		db,
	);

	// Transform sections to generate dynamic destinations from selectedCategoryIds
	// ✅ Pass db parameter to maintain single connection
	const signatureVoyage = await transformSignatureVoyageWithDynamicDestinations(
		signatureVoyageRaw,
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
