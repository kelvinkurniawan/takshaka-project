import {
	createRequestDB,
	getPageSectionsFromDB,
	getFooterSections,
} from "@/lib/page-helpers";
import SustainabilityImpactClient from "./sustainability-impact-client";
import { Footer } from "@/components/sections";
import { contents, categories as categoriesTable } from "@/lib/schema";
import { inArray, isNull } from "drizzle-orm";

// Revalidate every 60 seconds for ISR (Incremental Static Regeneration)
export const revalidate = 60;

export const metadata = {
	title: "Sustainability Impact - Takshaka CMS",
	description:
		"Discover our commitment to environmental sustainability and social responsibility initiatives",
};

export default async function SustainabilityImpactPage() {
	// ✅ Create ONE database instance for this entire request
	const db = createRequestDB();

	// ✅ Use the same db instance for all queries in Promise.all
	const [sustainabilityImpactSections, footerSections] = await Promise.all([
		getPageSectionsFromDB("sustainability-impact", db),
		Promise.resolve(getFooterSections()),
	]);

	if (!sustainabilityImpactSections) {
		return (
			<>
				<div className="text-center py-20">The Page Cannot Be Rendered</div>
			</>
		);
	}

	// ✅ If projectsSection has selectedCategoryIds, fetch the articles
	if (
		sustainabilityImpactSections.projectsSection?.selectedCategoryIds &&
		sustainabilityImpactSections.projectsSection.selectedCategoryIds.length > 0
	) {
		try {
			const articles = await db
				.select()
				.from(contents)
				.where(
					inArray(
						contents.categoryId,
						sustainabilityImpactSections.projectsSection.selectedCategoryIds,
					),
				)
				.orderBy(contents.createdAt);

			// Get category names for each article
			const articlesWithCategories = await Promise.all(
				articles.map(async (article) => {
					const category = await db
						.select()
						.from(categoriesTable)
						.where(
							inArray(
								categoriesTable.id,
								sustainabilityImpactSections.projectsSection
									.selectedCategoryIds,
							),
						)
						.limit(1);

					return {
						...article,
						categoryName: category[0]?.name || "Project",
					};
				}),
			);

			sustainabilityImpactSections.projectsSection.items =
				articlesWithCategories;
		} catch (error) {
			console.error("Error fetching projects:", error);
		}
	}

	return (
		<>
			<SustainabilityImpactClient sections={sustainabilityImpactSections} />
			<Footer sections={footerSections} />
		</>
	);
}
