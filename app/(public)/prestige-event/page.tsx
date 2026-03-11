import { getPageSectionsFromDB, getFooterSections } from "@/lib/page-helpers";
import PrestigeEventClient from "./prestige-event-client";

export const metadata = {
	title: "Prestige Events",
	description:
		"Transformative events and conferences that create meaningful impact",
};

export default async function PrestigeEventPage() {
	const [prestigeEvents, footerSections] = await Promise.all([
		getPageSectionsFromDB("prestige-events"),
		getFooterSections(),
	]);

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
		/>
	);
}
