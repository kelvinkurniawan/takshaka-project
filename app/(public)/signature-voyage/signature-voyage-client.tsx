"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { HeroSection, Footer } from "@/components/sections";
import Image from "next/image";
import { trackPageView } from "@/lib/analytics-client";
import type { InferSelectModel } from "drizzle-orm";
import { galleryCategories, galleryOfWorks } from "@/lib/schema";

type GalleryCategory = InferSelectModel<typeof galleryCategories>;
type GalleryItem = InferSelectModel<typeof galleryOfWorks>;

interface SignatureVoyageClientProps {
	signatureVoyage: any;
	footerSections: any;
	galleryCategories: GalleryCategory[];
	galleryItems: GalleryItem[];
}

export default function SignatureVoyageClient({
	signatureVoyage,
	footerSections,
	galleryCategories,
	galleryItems,
}: SignatureVoyageClientProps) {
	const pathname = usePathname();
	const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
	const [selectedCategory, setSelectedCategory] = useState<number | null>(
		galleryCategories.length > 0 ? galleryCategories[0].id : null,
	);
	// state for modal display
	const [selectedDestination, setSelectedDestination] = useState<any | null>(
		null,
	);
	const [isModalVisible, setIsModalVisible] = useState(false);

	useEffect(() => {
		if (selectedDestination) {
			setTimeout(() => setIsModalVisible(true), 10);
		} else {
			setIsModalVisible(false);
		}
	}, [selectedDestination]);

	const handleCloseModal = () => {
		setIsModalVisible(false);
		setTimeout(() => setSelectedDestination(null), 300);
	};

	useEffect(() => {
		trackPageView(pathname, "Signature Voyage", document.referrer);
	}, [pathname]);

	// Auto-rotate hero content slides
	useEffect(() => {
		const slides = signatureVoyage.heroContent?.slides;
		if (!slides || slides.length <= 1) return;

		const interval = setInterval(() => {
			setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
		}, 5000); // Change slide every 5 seconds

		return () => clearInterval(interval);
	}, [signatureVoyage.heroContent?.slides]);

	const handleGoToSlide = (index: number) => {
		setCurrentSlideIndex(index);
	};

	return (
		<>
			{/* Hero Section */}
			{signatureVoyage.hero && (
				<HeroSection
					{...(signatureVoyage.hero.contents
						? { contents: signatureVoyage.hero.contents }
						: {
								title: signatureVoyage.hero.title,
								description: signatureVoyage.hero.description,
								backgroundImage: signatureVoyage.hero.background,
							})}
				/>
			)}
			{/* Top Destinations Section */}
			{signatureVoyage.topDestinations && (
				<section className="py-16 md:py-24">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						{/* Title */}
						<div className="text-center mb-16">
							<h2 className="text-4xl md:text-5xl font-light tracking-widest uppercase mb-4">
								{signatureVoyage.topDestinations.title}
							</h2>
							<p className="text-lg text-gray-600 max-w-2xl mx-auto">
								{signatureVoyage.topDestinations.subtitle}
							</p>
						</div>

						{/* Destinations Grid */}
						<div className="grid grid-cols-1 md:grid-cols-3 grid-flow-dense gap-x-8 gap-y-16">
							{signatureVoyage.topDestinations.destinations?.map(
								(destination: any, index: number) => (
									<div
										key={index}
										className={`group ${index === 0 ? "md:col-span-2" : ""}`}
										data-aos="fade-up"
										data-aos-delay={index * 100}
										data-aos-duration="800"
										onClick={() => setSelectedDestination(destination)}
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

			{/* Destination Modal */}
			{(selectedDestination || isModalVisible) && (
				<div
					className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 transition-opacity duration-300 ${isModalVisible ? "opacity-100" : "opacity-0"}`}
				>
					<div
						className={`relative w-full max-w-3xl mx-auto bg-white rounded-lg overflow-hidden transform transition-transform duration-300 ${isModalVisible ? "scale-100" : "scale-95"}`}
					>
						<button
							className="absolute top-0 right-2 z-50  rounded-full p-2 text-gray-600 hover:text-gray-900 text-4xl leading-none"
							onClick={handleCloseModal}
							aria-label="Close modal"
						>
							&times;
						</button>
						{/* Image */}
						<div className="relative h-64 md:h-96 w-full">
							<Image
								src={selectedDestination.image}
								alt={selectedDestination.title}
								fill
								className="object-cover"
								unoptimized
							/>
						</div>
						{/* Text */}
						<div className="p-6">
							<h3 className="text-2xl font-semibold mb-2">
								{selectedDestination.title}
							</h3>
							<p className="text-gray-700 italic mb-4">
								{selectedDestination.subtitle}
							</p>
							{selectedDestination.description && (
								<p className="text-gray-800">
									{selectedDestination.description}
								</p>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Exclusive Experiences Section */}
			{signatureVoyage.exclusiveExperiences && (
				<section className="py-16 md:py-24 bg-[#f6f1e7]">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						{/* Title */}
						<div className="text-center mb-16">
							<h2 className="text-4xl md:text-5xl font-light tracking-widest uppercase">
								{signatureVoyage.exclusiveExperiences.title}
							</h2>
						</div>

						{/* Experiences Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							{signatureVoyage.exclusiveExperiences.experiences?.map(
								(experience: any, index: number) => (
									<div
										key={index}
										className="group cursor-pointer"
										data-aos="fade-up"
										data-aos-delay={index * 100}
										data-aos-duration="800"
									>
										{/* Image Container */}
										<div className="relative w-full aspect-square overflow-hidden rounded-sm mb-4">
											<Image
												src={experience.image}
												alt={experience.title}
												fill
												className="object-cover group-hover:scale-105 transition-transform duration-300"
												unoptimized
											/>

											{/* Overlay with Title */}
											<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
												<div className="p-6 w-full">
													<h3 className="text-white text-lg md:text-xl font-light tracking-wide uppercase">
														{experience.title}
													</h3>
												</div>
											</div>
										</div>

										{/* Description */}
										{experience.description && (
											<p className="text-sm md:text-base text-gray-700 leading-relaxed text-center">
												{experience.description}
											</p>
										)}
									</div>
								),
							)}
						</div>
					</div>
				</section>
			)}

			{/* Footer Sections */}
			{footerSections && footerSections.length > 0 && (
				<Footer sections={footerSections} />
			)}
		</>
	);
}
