import {
	createRequestDB,
	getPageSectionsFromDB,
	getFooterSections,
} from "@/lib/page-helpers";
import CuratedExperienceClient from "./curated-experience-client";
import { Footer } from "@/components/sections";
import { contents, categories as categoriesTable } from "@/lib/schema";
import { inArray, isNull } from "drizzle-orm";

// Revalidate every 60 seconds for ISR (Incremental Static Regeneration)
export const revalidate = 60;

export const metadata = {
	title: "Curated Experience - Takshaka CMS",
	description:
		"Discover our carefully curated collection of premium travel experiences designed for those who value quality and precision",
};

export default async function CuratedExperiencePage() {
	// ✅ Create ONE database instance for this entire request
	const db = createRequestDB();

	// ✅ Use the same db instance for all queries in Promise.all
	const [curatedExperienceSections, footerSections] = await Promise.all([
		getPageSectionsFromDB("curated-experience", db),
		Promise.resolve(getFooterSections()),
	]);

	if (!curatedExperienceSections) {
		return (
			<>
				<div className="text-center py-20">The Page Cannot Be Rendered</div>
			</>
		);
	}

	// ✅ If curatedExperiences has selectedCategoryIds, fetch the articles
	if (
		curatedExperienceSections.curatedExperiences?.selectedCategoryIds &&
		curatedExperienceSections.curatedExperiences.selectedCategoryIds.length > 0
	) {
		try {
			const articles = await db
				.select()
				.from(contents)
				.where(
					inArray(
						contents.categoryId,
						curatedExperienceSections.curatedExperiences.selectedCategoryIds,
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
								curatedExperienceSections.curatedExperiences
									.selectedCategoryIds,
							),
						)
						.limit(1);

					return {
						...article,
						categoryName: category[0]?.name || "Experience",
					};
				}),
			);

			curatedExperienceSections.curatedExperiences.items =
				articlesWithCategories;
		} catch (error) {
			console.error("Error fetching curated experiences:", error);
		}
	}

	// ✅ If pickYourChoose has selectedCategoryIds, fetch the articles and categories
	if (
		curatedExperienceSections.pickYourChoose?.selectedCategoryIds &&
		curatedExperienceSections.pickYourChoose.selectedCategoryIds.length > 0
	) {
		try {
			// Fetch articles from selected categories
			const articles = await db
				.select()
				.from(contents)
				.where(
					inArray(
						contents.categoryId,
						curatedExperienceSections.pickYourChoose.selectedCategoryIds,
					),
				)
				.orderBy(contents.createdAt);

			// Fetch all categories for the category tabs/filter
			const allCategories = await db
				.select()
				.from(categoriesTable)
				.where(
					inArray(
						categoriesTable.id,
						curatedExperienceSections.pickYourChoose.selectedCategoryIds,
					),
				);

			// Map categoryId to categoryName + limit to 4 items per category
			const perCategoryCount: Record<number, number> = {};
			const articlesWithCategories = articles
				.map((article) => {
					const category = allCategories.find(
						(c) => c.id === article.categoryId,
					);
					return {
						...article,
						categoryName: category?.name || "Experience",
					};
				})
				.filter((article) => {
					const catId = article.categoryId ?? 0;
					const count = perCategoryCount[catId] ?? 0;
					if (count >= 4) return false;
					perCategoryCount[catId] = count + 1;
					return true;
				});

			curatedExperienceSections.pickYourChoose.items = articlesWithCategories;
			curatedExperienceSections.pickYourChoose.categories = allCategories;
		} catch (error) {
			console.error("Error fetching pick your choose articles:", error);
		}
	}

	return (
		<>
			<CuratedExperienceClient sections={curatedExperienceSections} />
		</>
	);
}
