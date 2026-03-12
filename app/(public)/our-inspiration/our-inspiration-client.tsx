"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
	ParallaxHero,
	BoardLetterSection,
	TakskaWaySection,
	BrandStorySection,
	TimelineSection,
} from "@/components/sections";
import Image from "next/image";
import { trackPageView } from "@/lib/analytics-client";

interface OurInspirationClientProps {
	inspirationSections: any;
}

export default function OurInspirationClient({
	inspirationSections,
}: OurInspirationClientProps) {
	const pathname = usePathname();

	useEffect(() => {
		trackPageView(pathname, "Our Inspiration", document.referrer);
	}, [pathname]);

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
							unoptimized
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
