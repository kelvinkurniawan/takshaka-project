"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { HeroSection } from "@/components/sections";
import Link from "next/link";
import { trackPageView } from "@/lib/analytics-client";

interface SustainabilityImpactClientProps {
	sections: any;
}

export default function SustainabilityImpactClient({
	sections,
}: SustainabilityImpactClientProps) {
	const pathname = usePathname();

	useEffect(() => {
		trackPageView(pathname);
	}, [pathname]);

	return (
		<>
			{/* Hero Section - Supports contents array structure */}
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

			{/* Our Impacts Section */}
			{sections.ourImpacts && (
				<section className="py-16 md:py-24 bg-white">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						{/* Section Header */}
						{sections.ourImpacts.title && (
							<div className="text-center mb-16">
								<h2 className="text-3xl md:text-4xl font-light tracking-wider uppercase">
									{sections.ourImpacts.title}
								</h2>
								{sections.ourImpacts.description && (
									<p className="text-gray-600 text-lg mt-4 max-w-2xl mx-auto">
										{sections.ourImpacts.description}
									</p>
								)}
							</div>
						)}

						{/* Impact Stats Grid */}
						{sections.ourImpacts.items &&
							sections.ourImpacts.items.length > 0 && (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
									{sections.ourImpacts.items.map((item: any, index: number) => (
										<div
											key={index}
											className="text-center group"
											data-aos="fade-up"
											data-aos-delay={index * 100}
											data-aos-duration="800"
										>
											{/* Stat Number */}
											<div className="mb-4">
												<span className="text-5xl md:text-6xl font-light text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
													{item.number}
												</span>
											</div>

											{/* Label */}
											<p className="text-sm md:text-base uppercase tracking-widest font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
												{item.label}
											</p>

											{/* Description */}
											{item.description && (
												<p className="text-xs md:text-sm text-gray-500 mt-3 leading-relaxed">
													{item.description}
												</p>
											)}
										</div>
									))}
								</div>
							)}
					</div>
				</section>
			)}

			{/* Additional Impact Stories Section (Optional) */}
			{sections.impactStories && sections.impactStories.items?.length > 0 && (
				<section className="py-16 md:py-24 bg-gray-50">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						{/* Section Header */}
						{sections.impactStories.title && (
							<div className="text-center mb-12">
								<h2 className="text-3xl md:text-4xl font-light tracking-wider uppercase">
									{sections.impactStories.title}
								</h2>
								{sections.impactStories.description && (
									<p className="text-gray-600 text-lg mt-4 max-w-2xl mx-auto">
										{sections.impactStories.description}
									</p>
								)}
							</div>
						)}

						{/* Stories Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{sections.impactStories.items.map((story: any, index: number) => (
								<div
									key={index}
									className="group cursor-pointer"
									data-aos="fade-up"
									data-aos-delay={index * 100}
									data-aos-duration="800"
								>
									{/* Story Image */}
									{story.image && (
										<div className="relative w-full h-64 rounded-sm overflow-hidden mb-4 bg-gray-200">
											<img
												src={story.image}
												alt={story.title}
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
											/>
										</div>
									)}

									{/* Story Content */}
									<h3 className="text-lg font-light tracking-wide uppercase mb-2 group-hover:text-blue-600 transition-colors">
										{story.title}
									</h3>

									{story.excerpt && (
										<p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
											{story.excerpt}
										</p>
									)}

									{story.link && (
										<Link
											href={story.link}
											prefetch={false}
											className="mt-4 text-sm font-semibold uppercase tracking-widest text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-2 w-fit"
										>
											Learn More
											<span className="text-xl">→</span>
										</Link>
									)}
								</div>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Our Projects Section */}
			{sections.projectsSection &&
				sections.projectsSection.items?.length > 0 && (
					<section className="py-16 md:py-24 bg-white">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							{/* Section Header */}
							{sections.projectsSection.title && (
								<div className="text-center mb-16">
									<h2 className="text-3xl md:text-4xl font-light tracking-wider uppercase">
										{sections.projectsSection.title}
									</h2>
									{sections.projectsSection.description && (
										<p className="text-gray-600 text-base mt-6 max-w-2xl mx-auto leading-relaxed">
											{sections.projectsSection.description}
										</p>
									)}
								</div>
							)}

							{/* Projects Grid */}
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
								{sections.projectsSection.items.map(
									(project: any, index: number) => (
										<Link
											key={index}
											href={
												project.link || project.slug
													? `/blog/${project.slug}`
													: "#"
											}
											prefetch={false}
											data-aos="fade-up"
											data-aos-delay={index * 100}
											data-aos-duration="800"
										>
											<div className="group cursor-pointer h-full">
												{/* Project Image */}
												<div className="relative w-full h-56 rounded-sm overflow-hidden mb-4 bg-gray-200">
													<img
														src={project.featuredImage || project.image}
														alt={project.title}
														className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
													/>
												</div>

												{/* Project Content */}
												<div>
													{/* Category Tag */}
													{project.categoryName && (
														<span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs uppercase tracking-widest font-semibold rounded-sm mb-3">
															{project.categoryName}
														</span>
													)}

													{/* Project Title */}
													<h3 className="text-lg font-light tracking-wide uppercase mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
														{project.title}
													</h3>

													{/* Project Description */}
													<p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
														{project.excerpt || project.description}
													</p>
												</div>
											</div>
										</Link>
									),
								)}
							</div>
						</div>
					</section>
				)}
		</>
	);
}
