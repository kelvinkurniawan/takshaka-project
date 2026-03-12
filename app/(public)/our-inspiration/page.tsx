import { getPageSectionsFromDB } from "@/lib/page-helpers";
import OurInspirationClient from "./our-inspiration-client";

// Revalidate every 60 seconds for ISR (Incremental Static Regeneration)
// This keeps the page fresh when database content changes
export const revalidate = 60;

export const metadata = {
	title: "Our Inspiration",
	description:
		"Discover the inspiration and vision behind our premium experiences",
};

export default async function OurInspirationPage() {
	const inspirationSections = await getPageSectionsFromDB("our-inspiration");

	if (!inspirationSections) {
		return (
			<>
				<div className="text-center py-20">The Page Cannot Be Rendered</div>
			</>
		);
	}

	return <OurInspirationClient inspirationSections={inspirationSections} />;
}
