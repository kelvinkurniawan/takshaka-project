"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { HeroSection } from "@/components/sections";
import Link from "next/link";
import Image from "next/image";
import { trackPageView } from "@/lib/analytics-client";

interface CuratedExperienceClientProps {
	sections: any;
}

export default function CuratedExperienceClient({
	sections,
}: CuratedExperienceClientProps) {
	const pathname = usePathname();
	const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

	useEffect(() => {
		trackPageView(pathname);
	}, [pathname]);

	// Set default selected category
	useEffect(() => {
		if (
			sections.pickYourChoose?.categories &&
			sections.pickYourChoose.categories.length > 0 &&
			!selectedCategory
		) {
			setSelectedCategory(sections.pickYourChoose.categories[0].id);
		}
	}, [sections.pickYourChoose, selectedCategory]);

	return (
		<>
			{/* Hero Section */}
			{sections.hero && (
				<HeroSection
					contents={
						sections.hero.contents || [
							{
								title: sections.hero.title,
								description: sections.hero.description,
								background: sections.hero.background,
							},
						]
					}
				/>
			)}

			{/* Our Approach Section */}
			{sections.approachSection && (
				<section className="py-16 md:py-24 bg-white">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
						{/* Decorative ornament top */}
						<div className="flex justify-center mb-8">
							<Image
								src={"/images/symbol.png"}
								alt="Decorative Symbol"
								width={40}
								height={40}
							/>
						</div>

						{/* Section Title */}
						<div className="text-center mb-8">
							<h2 className="text-3xl md:text-4xl font-light tracking-wider uppercase">
								{sections.approachSection.title || "Our Approach to Experience"}
							</h2>
						</div>

						{/* Section Description */}
						{sections.approachSection.description && (
							<p className="text-center text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
								{sections.approachSection.description}
							</p>
						)}

						{/* Decorative ornament bottom */}
						<div className="flex justify-center mt-8">
							<Image
								src={"/images/symbol.png"}
								alt="Decorative Symbol"
								width={40}
								height={40}
							/>
						</div>
					</div>
				</section>
			)}

			{/* Highlighted Experience Section */}
			{sections.highlightedExperience &&
				sections.highlightedExperience.items?.length > 0 && (
					<section className="py-16 md:py-24 bg-[#F6F1E7]">
						<div className="max-w-7xl mx-auto px-12 sm:px-6 lg:px-12">
							{/* Section Title */}
							{sections.highlightedExperience.title && (
								<div className="text-center mb-16">
									<h2 className="text-3xl md:text-4xl font-light tracking-wider uppercase">
										{sections.highlightedExperience.title}
									</h2>
								</div>
							)}

							{/* Highlighted Experiences Grid */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
								{sections.highlightedExperience.items.map(
									(experience: any, index: number) => (
										<Link
											key={index}
											href={experience.url || experience.link || "#"}
											prefetch={false}
											data-aos="fade-up"
											data-aos-delay={index * 100}
											data-aos-duration="800"
										>
											<div className="group cursor-pointer text-center">
												{/* Experience Image */}
												<div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden bg-gray-200 mb-6">
													{experience.image || experience.featuredImage ? (
														<Image
															src={experience.image || experience.featuredImage}
															alt={experience.title}
															fill
															className="object-cover group-hover:scale-105 transition-transform duration-500"
															unoptimized
														/>
													) : (
														<div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
													)}
												</div>

												{/* Title */}
												<h3 className="text-base font-light tracking-wider uppercase mb-3 group-hover:text-blue-600 transition-colors">
													{experience.title}
												</h3>

												{/* Description */}
												<p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
													{experience.description || experience.excerpt}
												</p>
											</div>
										</Link>
									),
								)}
							</div>
						</div>
					</section>
				)}

			{/* Why Curated Experience Section */}
			{sections.whyCuratedExperience &&
				sections.whyCuratedExperience.items?.length > 0 && (
					<section className="py-16 md:py-24 bg-white">
						<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
							{/* Section Title */}
							{sections.whyCuratedExperience.title && (
								<div className="text-center mb-16">
									<h2 className="text-3xl md:text-4xl font-light tracking-wider uppercase">
										{sections.whyCuratedExperience.title}
									</h2>
								</div>
							)}

							{/* Items List */}
							<div className="space-y-8">
								{sections.whyCuratedExperience.items.map(
									(item: any, index: number) => (
										<div
											key={index}
											className="pb-8 border-b border-[#A27C34] last:border-b-0"
											data-aos="fade-up"
											data-aos-delay={index * 100}
											data-aos-duration="800"
										>
											{/* Item Title */}
											<h3 className="text-base md:text-lg font-light tracking-wider uppercase mb-2">
												{item.title}
											</h3>

											{/* Item Description */}
											<p className="text-gray-600 text-sm md:text-base leading-relaxed italic">
												{item.description}
											</p>
										</div>
									),
								)}
							</div>
						</div>
					</section>
				)}

			{/* Pick Your Choose Section */}
			{sections.pickYourChoose && sections.pickYourChoose.items?.length > 0 && (
				<section className="py-16 md:py-24 bg-white">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						{/* Section Title */}
						{sections.pickYourChoose.title && (
							<div className="text-center mb-12">
								<h2 className="text-3xl md:text-4xl font-light tracking-wider uppercase">
									{sections.pickYourChoose.title}
								</h2>
							</div>
						)}

						{/* Category Tabs */}
						{sections.pickYourChoose.categories &&
							sections.pickYourChoose.categories.length > 0 && (
								<div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12 pb-6 border-b border-[#A27C34]">
									{sections.pickYourChoose.categories.map((category: any) => (
										<button
											key={category.id}
											onClick={() => setSelectedCategory(category.id)}
											className={`text-sm uppercase tracking-widest font-light transition-colors pb-2 ${
												selectedCategory === category.id
													? "text-gray-900 border-b-2 border-gray-900"
													: "text-gray-500 hover:text-gray-700"
											}`}
										>
											{category.name}
										</button>
									))}
								</div>
							)}

						{/* Items Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
							{sections.pickYourChoose.items
								.filter(
									(item: any) =>
										!selectedCategory || item.categoryId === selectedCategory,
								)
								.map((item: any, index: number) => (
									<Link
										key={index}
										href={item.link || item.slug ? `/blog/${item.slug}` : "#"}
										prefetch={false}
										data-aos="fade-up"
										data-aos-delay={index * 100}
										data-aos-duration="800"
									>
										<div className="group cursor-pointer relative aspect-[3/4] rounded-sm overflow-hidden">
											{/* Item Image */}
											{item.image || item.featuredImage ? (
												<Image
													src={item.featuredImage || item.image}
													alt={item.title}
													fill
													className="object-cover group-hover:scale-105 transition-transform duration-500"
													unoptimized
												/>
											) : (
												<div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
											)}

											{/* Dark Overlay */}
											<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300" />

											{/* Content */}
											<div className="absolute inset-0 p-6 flex flex-col justify-end">
												{/* Title and Description */}
												<div className="text-center">
													<h3 className="text-white text-base font-light tracking-wide uppercase mb-2">
														{item.title}
													</h3>
													<p className="text-white/90 text-xs leading-relaxed line-clamp-2">
														{item.excerpt || item.description}
													</p>
												</div>
											</div>
										</div>
									</Link>
								))}
						</div>

						{/* CTA Button */}
						{sections.pickYourChoose.buttonText &&
							sections.pickYourChoose.buttonLink && (
								<div className="flex justify-center mt-12">
									<Link
										href={sections.pickYourChoose.buttonLink}
										prefetch={false}
										className="px-8 py-3 border-2 border-gray-900 text-gray-900 font-light uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-colors rounded-sm"
									>
										{sections.pickYourChoose.buttonText}
									</Link>
								</div>
							)}
					</div>
				</section>
			)}
		</>
	);
}
