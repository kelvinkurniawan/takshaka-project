"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
	HeroSection,
	ThreeItemSection,
	ImagesSection,
	CuratedExperiencesSection,
	ExperiencesSharedSection,
	SustainableImpactSection,
	Footer,
} from "@/components/sections";
import { trackPageView } from "@/lib/analytics-client";

interface HomeSections {
	hero?: {
		title?: string;
		subtitle?: string;
		background?: string;
		contents?: any;
	};
	threeItemSection?: any;
	imagesSection?: any;
	curatedExperiences?: any;
	experiencesShared?: any;
}

interface FooterSection {
	title: string;
	links: any[];
}

interface HomePageClientProps {
	homeSections: HomeSections;
	footerSections: FooterSection[];
	socialLinks: any[];
}

export default function HomePageClient({
	homeSections,
	footerSections,
	socialLinks,
}: HomePageClientProps) {
	const pathname = usePathname();

	// Track page view on mount and pathname change
	useEffect(() => {
		trackPageView(pathname, "Home", document.referrer);
	}, [pathname]);

	return (
		<div className="public-light flex flex-col min-h-screen bg-[#fff8f5] text-gray-900 overflow-x-hidden">
			<main className="flex-1">
				{/* Hero Section */}
				{homeSections.hero && (
					<HeroSection
						{...(homeSections.hero.contents
							? { contents: homeSections.hero.contents }
							: {
									title: homeSections.hero.title,
									description: homeSections.hero.subtitle,
									backgroundImage: homeSections.hero.background,
								})}
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
				<SustainableImpactSection
					title="SUSTAINABLE IMPACT"
					subtitle="Our Consent to Environment & Communities"
					buttonText="SEE OUR IMPACT"
					backgroundImage="/images/cta_background.png"
				/>
			</main>

			{/* Footer */}
			<Footer
				sections={footerSections}
				copyright="Copyright 2026. Takshaka Event & Experience"
				socialLinks={socialLinks}
			/>
		</div>
	);
}
