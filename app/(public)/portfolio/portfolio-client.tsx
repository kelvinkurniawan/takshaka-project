"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { HeroSection } from "@/components/sections";
import EditorPicksSection from "@/components/sections/EditorPicksSection";
import Link from "next/link";
import Image from "next/image";
import { trackPageView } from "@/lib/analytics-client";

interface PortfolioClientProps {
	sections: any;
}

export default function PortfolioClient({
	sections,
}: PortfolioClientProps) {
	const pathname = usePathname();

	return (
		<>
			{/* Hero Section - Supports both contents array and direct properties */}
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

			{/* Editor Picks Section */}
			{sections.editorPicks && sections.editorPicks.items?.length > 0 && (
				<EditorPicksSection
					items={sections.editorPicks.items}
					title={sections.editorPicks.title}
					description={sections.editorPicks.description}
				/>
			)}

			{/* Two Column Section: Fixed Image + Article Grid */}
			{sections.articlesList && (
				<section className="py-16 md:py-24 bg-[#F6F1E7]">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-1 lg:grid-cols-8 gap-8 lg:gap-12">
							{/* Left Column: Fixed Image (Sticky) */}
							<div className="lg:col-span-3">
								<div className="lg:sticky lg:top-24">
									{sections.articlesList.fixedImage && (
										<div className="relative w-full h-80 md:h-[800] rounded-sm overflow-hidden shadow-lg group">
											<Image
												src={sections.articlesList.fixedImage}
												alt="Featured article"
												fill
												className="object-cover group-hover:scale-105 transition-transform duration-500"
												unoptimized
												priority
											/>
											{/* Overlay with text */}
											<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
												<div className="p-6 text-white text-center">
													<p className="text-sm uppercase tracking-widest font-light">
														Featured
													</p>
													<h3 className="text-xl md:text-2xl font-light tracking-wider uppercase mt-2">
														The Best Places To Travel In 2026
													</h3>
												</div>
											</div>
										</div>
									)}
								</div>
							</div>

							{/* Right Column: Article Grid */}
							<div className="lg:col-span-5">
								{!sections.articlesList.items ||
								sections.articlesList.items.length === 0 ? (
									<div className="text-center py-12">
										<p className="text-xl text-gray-600">
											No articles available
										</p>
									</div>
								) : (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{sections.articlesList.items.map(
											(article: any, index: number) => (
												<Link
													key={index}
													href={article.link || "#"}
													prefetch={false}
													data-aos="fade-up"
													data-aos-delay={index * 100}
													data-aos-duration="800"
												>
													<article className="group cursor-pointer h-full">
														{/* Image Container with Avatar */}
														<div className="relative w-full h-[400px] rounded-sm overflow-hidden mb-4 bg-gray-200">
															{article.image || article.featuredImage ? (
																<Image
																	src={article.image || article.featuredImage}
																	alt={article.title}
																	fill
																	className="object-cover group-hover:scale-105 transition-transform duration-500"
																	unoptimized
																/>
															) : (
																<div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
															)}
														</div>

														{/* Content */}
														<div>
															{/* Title */}
															<h3 className="text-base md:text-lg font-light tracking-wider uppercase leading-snug mb-3 group-hover:text-gray-700 transition line-clamp-2">
																{article.title}
															</h3>

															{/* Description */}
															{article.excerpt && (
																<p className="text-sm text-gray-600 leading-relaxed line-clamp-3 italic">
																	{article.excerpt}
																</p>
															)}
														</div>
														<div className="border-b border-[#A27C34] mt-5"></div>
													</article>
												</Link>
											),
										)}
									</div>
								)}
							</div>
						</div>
					</div>
				</section>
			)}
		</>
	);
}
