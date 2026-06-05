import {
	createRequestDB,
	getPageSectionsFromDB,
	getFooterSections,
} from "@/lib/page-helpers";
import PortfolioClient from "./portfolio-client";
import { Footer } from "@/components/sections";

// Revalidate every 60 seconds for ISR (Incremental Static Regeneration)
// This keeps the page fresh when database content changes
export const revalidate = 60;

export const metadata = {
	title: "Portfolio - Takshaka CMS",
	description:
		"Jelajahi portofolio proyek dan karya terbaik kami",
};

export default async function PortfolioPage() {
	// ✅ Create ONE database instance for this entire request
	const db = createRequestDB();

	// ✅ Use the same db instance for all queries in Promise.all
	const [portfolioSections, footerSections] = await Promise.all([
		getPageSectionsFromDB("portfolio", db),
		Promise.resolve(getFooterSections()),
	]);

	if (!portfolioSections) {
		return (
			<>
				<div className="text-center py-20">The Page Cannot Be Rendered</div>
			</>
		);
	}

	return (
		<>
			<PortfolioClient sections={portfolioSections} />
		</>
	);
}
