import {
	createRequestDB,
	getPageSectionsFromDB,
	getFooterSections,
} from "@/lib/page-helpers";
import IndonesiaJournalClient from "./indonesia-journal-client";
import { Footer } from "@/components/sections";

// Revalidate every 60 seconds for ISR (Incremental Static Regeneration)
// This keeps the page fresh when database content changes
export const revalidate = 60;

export const metadata = {
	title: "Indonesia Journal - Takshaka CMS",
	description:
		"Jelajahi petualangan, inspirasi, dan cerita perjalanan melalui Indonesia Journal kami",
};

export default async function IndonesiaJournalPage() {
	// ✅ Create ONE database instance for this entire request
	const db = createRequestDB();

	// ✅ Use the same db instance for all queries in Promise.all
	const [indonesiaJournalSections, footerSections] = await Promise.all([
		getPageSectionsFromDB("indonesia-journal", db),
		Promise.resolve(getFooterSections()),
	]);

	if (!indonesiaJournalSections) {
		return (
			<>
				<div className="text-center py-20">The Page Cannot Be Rendered</div>
			</>
		);
	}

	return (
		<>
			<IndonesiaJournalClient sections={indonesiaJournalSections} />
		</>
	);
}
