import {
	ParallaxHero,
	BoardLetterSection,
	TakskaWaySection,
	BrandStorySection,
	TimelineSection,
} from "@/components/sections";
import Image from "next/image";
import { getPageSectionsFromDB } from "@/lib/page-helpers";

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

	return (
		<>
			{/* Hero Section */}
			{inspirationSections.hero && (
				<ParallaxHero
					title={inspirationSections.hero.title}
					description={inspirationSections.hero.description}
					backgroundImage={inspirationSections.hero.background}
				/>
			)}

			{/* Board Letter Content Section */}
			{inspirationSections.boardLetter && (
				<div data-aos="fade-up" data-aos-duration="800">
					<BoardLetterSection
						imageUrl={inspirationSections.boardLetter.imageUrl}
						paragraphs={inspirationSections.boardLetter.paragraphs}
					/>
				</div>
			)}

			{/* Fullwidth Image Section */}
			{inspirationSections.fullwidthImage && (
				<section className="w-full h-auto">
					<div className="relative w-full" style={{ aspectRatio: "1920/1080" }}>
						<Image
							src={inspirationSections.fullwidthImage.src}
							alt={inspirationSections.fullwidthImage.alt}
							fill
							className="object-cover"
							priority
						/>
					</div>
				</section>
			)}

			{/* Taksaka Way Section */}
			{inspirationSections.takskaWay && (
				<div data-aos="fade-right" data-aos-delay="100" data-aos-duration="800">
					<TakskaWaySection
						sectionTitle={inspirationSections.takskaWay.sectionTitle}
						items={inspirationSections.takskaWay.items}
					/>
				</div>
			)}

			{/* Brand Story Section */}
			{inspirationSections.brandStory && (
				<div data-aos="fade-left" data-aos-delay="200" data-aos-duration="800">
					<BrandStorySection
						backgroundImage={inspirationSections.brandStory.backgroundImage}
						sectionTitle={inspirationSections.brandStory.sectionTitle}
						items={inspirationSections.brandStory.items}
					/>
				</div>
			)}

			{/* Timeline Section */}
			{inspirationSections.timeline && (
				<div data-aos="fade-right" data-aos-delay="300" data-aos-duration="800">
					<TimelineSection
						sectionTitle={inspirationSections.timeline.sectionTitle}
						items={inspirationSections.timeline.items}
					/>
				</div>
			)}
		</>
	);
}
