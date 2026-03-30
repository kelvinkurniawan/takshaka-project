"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HeroSection, Footer } from "@/components/sections";
import Image from "next/image";
import { trackPageView } from "@/lib/analytics-client";
import type { InferSelectModel } from "drizzle-orm";
import { galleryCategories, galleryOfWorks } from "@/lib/schema";

type GalleryCategory = InferSelectModel<typeof galleryCategories>;
type GalleryItem = InferSelectModel<typeof galleryOfWorks>;

interface WellnessEscapeClientProps {
	wellnessEscape: any;
	footerSections: any;
	galleryCategories: GalleryCategory[];
	galleryItems: GalleryItem[];
}

export default function WellnessEscapeClient({
	wellnessEscape,
	footerSections,
	galleryCategories,
	galleryItems,
}: WellnessEscapeClientProps) {
	const pathname = usePathname();
	const router = useRouter();
	const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
	const [selectedCategory, setSelectedCategory] = useState<number | null>(
		galleryCategories.length > 0 ? galleryCategories[0].id : null,
	);

	useEffect(() => {
		trackPageView(pathname, "Wellness Escape", document.referrer);
	}, [pathname]);

	// Auto-rotate hero content slides
	useEffect(() => {
		const slides = wellnessEscape.heroContent?.slides;
		if (!slides || slides.length <= 1) return;

		const interval = setInterval(() => {
			setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
		}, 5000); // Change slide every 5 seconds

		return () => clearInterval(interval);
	}, [wellnessEscape.heroContent?.slides]);

	const handleGoToSlide = (index: number) => {
		setCurrentSlideIndex(index);
	};

	const handleDestinationClick = (destination: any) => {
		if (destination.slug) {
			router.push(`/blog/${destination.slug}`);
		}
	};

	return (
		<>
			{/* Hero Section */}
			{wellnessEscape.hero && (
				<HeroSection
					{...(wellnessEscape.hero.contents
						? { contents: wellnessEscape.hero.contents }
						: {
								title: wellnessEscape.hero.title,
								description: wellnessEscape.hero.description,
								backgroundImage: wellnessEscape.hero.background,
							})}
				/>
			)}

			{/* Intro Section */}
			{wellnessEscape.introSection && (
				<section className="py-16 md:py-24 bg-white">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
							{/* Left Image */}
							<div
								className="order-2 md:order-1"
								data-aos="fade-right"
								data-aos-duration="800"
							>
								<div className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-sm">
									<Image
										src={wellnessEscape.introSection.image}
										alt={wellnessEscape.introSection.title}
										fill
										className="object-cover"
										unoptimized
									/>
								</div>
							</div>

							{/* Right Text Content */}
							<div
								className="order-1 md:order-2"
								data-aos="fade-left"
								data-aos-duration="800"
							>
								<h2 className="text-4xl md:text-5xl font-light tracking-widest uppercase mb-6">
									{wellnessEscape.introSection.title}
								</h2>
								<p className="text-base md:text-lg text-gray-700 leading-relaxed whitespace-pre-line">
									{wellnessEscape.introSection.description}
								</p>
							</div>
						</div>
					</div>
				</section>
			)}

			{/* Top Destinations Section */}
			{wellnessEscape.theHolisticExperience && (
				<section className="py-16 md:py-24">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						{/* Title */}
						<div className="text-center mb-16">
							<h2 className="text-4xl md:text-5xl font-light tracking-widest uppercase mb-4">
								{wellnessEscape.theHolisticExperience.title}
							</h2>
							<p className="text-lg text-gray-600 max-w-2xl mx-auto">
								{wellnessEscape.theHolisticExperience.subtitle}
							</p>
						</div>

						{/* Destinations Grid */}
						<div className="grid grid-cols-1 md:grid-cols-3 grid-flow-dense gap-x-8 gap-y-16">
							{wellnessEscape.theHolisticExperience.destinations?.map(
								(destination: any, index: number) => (
									<div
										key={index}
										className={`group cursor-pointer ${index === 0 ? "md:col-span-2" : ""}`}
										data-aos="fade-up"
										data-aos-delay={index * 100}
										data-aos-duration="800"
										onClick={() => handleDestinationClick(destination)}
									>
										{/* Image */}
										<div
											className={`relative overflow-hidden rounded-sm w-full h-[420px]`}
										>
											<Image
												src={destination.image}
												alt={destination.title}
												fill
												className="object-cover group-hover:scale-105 transition-transform duration-300"
												unoptimized
											/>
										</div>

										{/* Content */}
										<div className="mt-4 border-b-2 border-gray-200 pb-4">
											<h3 className="text-lg md:text-xl font-light tracking-wide uppercase mb-1">
												{destination.title}
											</h3>

											<p className="text-gray-600 text-sm">
												{destination.subtitle}
											</p>
										</div>
									</div>
								),
							)}
						</div>
					</div>
				</section>
			)}
		</>
	);
}
