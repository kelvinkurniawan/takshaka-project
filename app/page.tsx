import PublicHeader from "@/components/PublicHeader";
import {
	ParallaxHero,
	ThreeItemSection,
	ImagesSection,
	CuratedExperiencesSection,
	ExperiencesSharedSection,
	SustainableImpactSection,
	Footer,
} from "@/components/sections";

import {
	getSettingsFromDB,
	getPageSectionsFromDB,
	getPageByIdFromDB,
	PageContentRenderer,
	type Page,
	getFooterSections,
} from "@/lib/page-helpers";

export default async function Home() {
	const [settings, homeSections] = await Promise.all([
		getSettingsFromDB(),
		getPageSectionsFromDB("home"),
	]);

	// Check if index_page is set
	const indexPageId = settings?.index_page
		? parseInt(settings.index_page, 10)
		: null;
	let indexPage: Page | null = null;

	if (indexPageId && !isNaN(indexPageId)) {
		indexPage = await getPageByIdFromDB(indexPageId);
	}

	// If index page is set and found, render it
	if (indexPage) {
		return (
			<>
				<PublicHeader />
				<div className="public-light flex flex-col min-h-screen bg-white text-gray-900">
					<main className="flex-1">
						<div className="min-h-screen">
							<article
								data-aos="fade-up"
								data-aos-duration="800"
								className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12"
							>
								<div className="index-page-content">
									<PageContentRenderer content={indexPage.content} />
								</div>
							</article>
						</div>
					</main>
				</div>
			</>
		);
	}

	// If dynamic page sections exist, use them
	if (!homeSections) {
		return (
			<>
				<div className="text-center py-20">The Section Cannot Be Rendered</div>
			</>
		);
	}

	return (
		<>
			<PublicHeader />
			<div className="public-light flex flex-col min-h-screen bg-white text-gray-900 overflow-x-hidden">
				<main className="flex-1">
					{/* Hero Section */}
					{homeSections.hero && (
						<ParallaxHero
							title={homeSections.hero.title}
							description={homeSections.hero.subtitle}
							backgroundImage={homeSections.hero.background}
						/>
					)}

					{/* Three Item Section */}
					{homeSections.threeItemSection && (
						<div
							data-aos="fade-right"
							data-aos-delay="100"
							data-aos-duration="800"
						>
							<ThreeItemSection
								images={homeSections.threeItemSection.images}
								heading={homeSections.threeItemSection.heading}
							/>
						</div>
					)}

					{/* Images Section */}
					{homeSections.imagesSection && (
						<div
							data-aos="fade-left"
							data-aos-delay="200"
							data-aos-duration="800"
						>
							<ImagesSection
								images={homeSections.imagesSection.images}
								description={homeSections.imagesSection.description}
							/>
						</div>
					)}

					{/* Curated Experiences Section */}
					{homeSections.curatedExperiences && (
						<div
							data-aos="fade-right"
							data-aos-delay="300"
							data-aos-duration="800"
						>
							<CuratedExperiencesSection
								tabs={homeSections.curatedExperiences.tabs}
							/>
						</div>
					)}

					{/* Experiences Shared Section */}
					{homeSections.experiencesShared && (
						<div
							data-aos="fade-left"
							data-aos-delay="400"
							data-aos-duration="800"
						>
							<ExperiencesSharedSection
								experiences={homeSections.experiencesShared.experiences}
							/>
						</div>
					)}

					{/* Sustainable Impact Section */}
					<div
						data-aos="fade-right"
						data-aos-delay="500"
						data-aos-duration="800"
					>
						<SustainableImpactSection
							title="SUSTAINABLE IMPACT"
							subtitle="Our Commitment to Environment & Communities"
							buttonText="SEE OUR IMPACT"
							backgroundImage="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=80"
						/>
					</div>
				</main>

				{/* Footer */}
				<Footer
					sections={getFooterSections()}
					copyright="Copyright 2026. Takshaka Event & Experience"
				/>
			</div>
		</>
	);
}
