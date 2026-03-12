"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ParallaxHero, Footer } from "@/components/sections";
import Image from "next/image";
import { trackPageView } from "@/lib/analytics-client";
import type { InferSelectModel } from "drizzle-orm";
import { galleryCategories, galleryOfWorks } from "@/lib/schema";

type GalleryCategory = InferSelectModel<typeof galleryCategories>;
type GalleryItem = InferSelectModel<typeof galleryOfWorks>;

interface PrestigeEventClientProps {
	prestigeEvents: any;
	footerSections: any;
	galleryCategories: GalleryCategory[];
	galleryItems: GalleryItem[];
}

export default function PrestigeEventClient({
	prestigeEvents,
	footerSections,
	galleryCategories,
	galleryItems,
}: PrestigeEventClientProps) {
	const pathname = usePathname();
	const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
	const [selectedCategory, setSelectedCategory] = useState<number | null>(
		galleryCategories.length > 0 ? galleryCategories[0].id : null,
	);

	useEffect(() => {
		trackPageView(pathname, "Prestige Events", document.referrer);
	}, [pathname]);

	// Auto-rotate hero content slides
	useEffect(() => {
		const slides = prestigeEvents.heroContent?.slides;
		if (!slides || slides.length <= 1) return;

		const interval = setInterval(() => {
			setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
		}, 5000); // Change slide every 5 seconds

		return () => clearInterval(interval);
	}, [prestigeEvents.heroContent?.slides]);

	const handleGoToSlide = (index: number) => {
		setCurrentSlideIndex(index);
	};

	return (
		<>
			{/* Hero Section */}
			{prestigeEvents.hero && (
				<ParallaxHero
					title={prestigeEvents.hero.title}
					description={prestigeEvents.hero.description}
					backgroundImage={prestigeEvents.hero.background}
				/>
			)}

			{/* Hero Content Section - Slideshow with Floating Text */}
			{prestigeEvents.heroContent?.slides &&
				prestigeEvents.heroContent.slides.length > 0 && (
					<section
						className="relative w-full"
						style={{ aspectRatio: "1920/1080" }}
					>
						{/* Slides Container */}
						{prestigeEvents.heroContent.slides.map(
							(slide: any, index: number) => (
								<div
									key={index}
									className={`absolute inset-0 transition-opacity duration-1000 ${
										index === currentSlideIndex ? "opacity-100" : "opacity-0"
									}`}
								>
									{/* Background Image */}
									<Image
										src={slide.backgroundImage}
										alt={slide.alt || `Slide ${index + 1}`}
										fill
										className="object-cover"
										priority={index === 0}
										unoptimized
									/>

									{/* Floating Text Content */}
									<div className="absolute inset-0 bg-black/40 flex items-center">
										<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
											<div
												data-aos="fade-up"
												data-aos-duration="800"
												className="space-y-8"
											>
												<div className="inline-block">
													<span className="text-sm uppercase tracking-widest text-gray-300">
														{slide.badge}
													</span>
												</div>

												<div className="max-w-2xl">
													<h2 className="text-5xl md:text-6xl font-bold leading-tight mb-8 whitespace-pre-line text-white">
														{slide.heading}
													</h2>
													<p className="text-lg text-gray-200 leading-relaxed max-w-xl">
														{slide.description}
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							),
						)}

						{/* Dot Navigation */}
						{prestigeEvents.heroContent.slides.length > 1 && (
							<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
								{prestigeEvents.heroContent.slides.map(
									(_: any, index: number) => (
										<button
											key={index}
											onClick={() => handleGoToSlide(index)}
											className={`h-2 transition-all duration-300 rounded-full ${
												index === currentSlideIndex
													? "w-8 bg-white"
													: "w-2 bg-white/50 hover:bg-white/80"
											}`}
											aria-label={`Go to slide ${index + 1}`}
										/>
									),
								)}
							</div>
						)}
					</section>
				)}

			{/* Two Column Section - Image Left, Text Right */}
			{prestigeEvents.twoColumn && (
				<section className="py-16 md:py-24">
					<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
							{/* Image */}
							<div
								data-aos="fade-right"
								data-aos-duration="800"
								className="relative w-full aspect-square"
							>
								<Image
									src={prestigeEvents.twoColumn.imageUrl}
									alt="Business Experience"
									fill
									className="object-cover"
									unoptimized
								/>
							</div>

							{/* Text Content */}
							<div
								data-aos="fade-left"
								data-aos-duration="800"
								className="space-y-6"
							>
								<h2 className="text-4xl md:text-5xl leading-tight">
									{prestigeEvents.twoColumn.title}
									<br />
									<span className="italic">
										{prestigeEvents.twoColumn.titleItalic}
									</span>
									<br />
									{prestigeEvents.twoColumn.titleBold}
								</h2>
								<p className="text-lg text-gray-600 leading-relaxed max-w-xl">
									{prestigeEvents.twoColumn.description}
								</p>
							</div>
						</div>

						<div className="grid grid-cols-1">
							<div className="text-center mt-32 text-3xl font-light text-gray-900 tracking-widest">
								TAILORED EXPERIENCES FOR EVERY MOMENT
							</div>
						</div>
					</div>
				</section>
			)}

			{/* Image Gallery Grid */}
			{prestigeEvents.imageGallery && (
				<section className="pb-16 pt-8 md:pb-24 md:pt-8">
					<div className="max-w-100 mx-auto">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							{prestigeEvents.imageGallery.images.map(
								(image: any, index: number) => (
									<a
										key={image.id}
										href={image.link || "#"}
										data-aos="fade-up"
										data-aos-delay={index * 100}
										data-aos-duration="800"
										className="relative w-full aspect-[3/4] overflow-hidden rounded-sm group"
									>
										<Image
											src={image.src}
											alt={image.alt}
											fill
											className="object-cover group-hover:scale-105 transition-transform duration-300"
											unoptimized
										/>

										{/* Floating Content Overlay */}
										{(image.caption || image.link) && (
											<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 flex flex-col justify-end p-4 text-center">
												<div className="space-y-3">
													{image.caption && (
														<p className="text-white leading-relaxed uppercase tracking-wide text-lg font-light">
															{image.caption}
														</p>
													)}
												</div>
											</div>
										)}
									</a>
								),
							)}
						</div>
					</div>
				</section>
			)}

			{/* What Makes Us Different Section */}
			{prestigeEvents.whatMakesUsDifferent && (
				<section className="py-16 md:py-24">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						{/* Title */}
						<div className="text-center mb-16">
							<h2 className="text-3xl font-light tracking-widest uppercase">
								{prestigeEvents.whatMakesUsDifferent.title}
							</h2>
						</div>

						{/* Items Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
							{prestigeEvents.whatMakesUsDifferent.items?.map(
								(item: any, index: number) => (
									<div
										key={index}
										className={`text-center px-8 ${
											index <
											prestigeEvents.whatMakesUsDifferent.items.length - 1
												? "lg:border-r border-gray-300"
												: ""
										}`}
										data-aos="fade-up"
										data-aos-delay={index * 100}
										data-aos-duration="800"
									>
										{/* Item Title */}
										<h3 className="text-sm md:text-base font-semibold tracking-widest uppercase mb-4 text-gray-900">
											{item.title}
										</h3>

										{/* Item Description */}
										<p className="text-sm md:text-base leading-relaxed text-gray-700 italic">
											{item.description}
										</p>
									</div>
								),
							)}
						</div>
					</div>
				</section>
			)}

			{/* Gallery of Works Section */}
			{galleryCategories.length > 0 && galleryItems.length > 0 && (
				<section className="py-16 md:py-24 bg-[#f6f1e7]">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						{/* Title */}
						<div className="text-center mb-16">
							<h2 className="text-4xl md:text-5xl font-light tracking-widest uppercase text-gray-900">
								Gallery of Work
							</h2>
						</div>

						{/* Category Tabs */}
						<div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12 pb-6 border-b border-gray-300">
							{galleryCategories.map((category) => (
								<button
									key={category.id}
									onClick={() => setSelectedCategory(category.id)}
									className={`text-xs md:text-sm font-light tracking-widest uppercase transition-colors py-2 ${
										selectedCategory === category.id
											? "text-gray-900 border-b-2 border-gray-900"
											: "text-gray-600 hover:text-gray-900"
									}`}
								>
									{category.name}
								</button>
							))}
						</div>

						{/* Gallery Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{galleryItems
								.filter(
									(item) =>
										selectedCategory === null ||
										item.categoryId === selectedCategory,
								)
								.map((item) => (
									<div
										key={item.id}
										className="group cursor-pointer"
										data-aos="fade-up"
									>
										{/* Image Container */}
										<div className="relative h-96 w-full overflow-hidden rounded-sm mb-4">
											<Image
												src={item.imageUrl}
												alt={item.title}
												fill
												className="object-cover transition-transform duration-300 group-hover:scale-105"
												unoptimized
											/>
										</div>

										{/* Title and Subtitle */}
										<div className="border-b-2 border-gray-300 pb-2 mb-2">
											<p className="text-xs md:text-sm font-light tracking-widest uppercase text-gray-600 mb-1">
												{item.subtitle}
											</p>
											<h3 className="text-base md:text-lg font-light tracking-wide uppercase text-gray-900">
												{item.title}
											</h3>
										</div>
									</div>
								))}
						</div>
					</div>
				</section>
			)}
		</>
	);
}
