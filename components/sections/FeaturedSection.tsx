"use client";

import Image from "next/image";
import Link from "next/link";

interface Content {
	id: number;
	title: string;
	slug: string;
	excerpt?: string;
	featuredImage?: string;
	publishedAt?: string;
	createdAt: string;
	type?: string;
}

interface FeaturedSectionProps {
	items: Content[];
}

export default function FeaturedSection({ items }: FeaturedSectionProps) {
	return (
		<section
			id="featured"
			className="py-24 bg-gradient-to-b from-slate-50 to-white"
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="text-center mb-16">
					<h2 className="text-5xl font-bold text-slate-900 mb-4">
						Featured Experiences
					</h2>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Handpicked selections for unforgettable moments
					</p>
					<div className="w-20 h-1 bg-gradient-to-r from-primary via-blue-500 to-transparent mx-auto mt-6"></div>
				</div>

				{/* Featured Items Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{items.map((item, index) => (
						<div
							key={item.id}
							className={`group relative overflow-hidden rounded-2xl hover:shadow-2xl transition-all duration-500 ${
								index === 0 ? "lg:col-span-2 lg:row-span-2" : ""
							}`}
						>
							{/* Background Image with Overlay */}
							<div className="relative h-96 lg:h-full lg:min-h-96 overflow-hidden bg-slate-200">
								{item.featuredImage && (
									<Image
										src={item.featuredImage}
										alt={item.title}
										fill
										className="object-cover group-hover:scale-110 transition-transform duration-700"
										unoptimized
									/>
								)}

								{/* Dark overlay */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

								{/* Category Badge */}
								{item.type && (
									<div className="absolute top-6 right-6 z-10">
										<span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md text-white text-sm font-semibold rounded-full border border-white/30">
											{item.type}
										</span>
									</div>
								)}

								{/* Content */}
								<div className="absolute inset-0 flex flex-col justify-end p-8 group-hover:p-10 transition-all duration-300 z-10">
									<h3 className="text-2xl md:text-3xl font-bold text-white mb-3 line-clamp-2 group-hover:text-white transition">
										{item.title}
									</h3>

									{item.excerpt && (
										<p className="text-white/80 text-sm md:text-base mb-6 line-clamp-2 group-hover:line-clamp-none transition">
											{item.excerpt}
										</p>
									)}

									{/* CTA */}
									<div className="flex items-center justify-between">
										<span className="text-sm text-white/60">
											{new Date(
												item.publishedAt || item.createdAt,
											).toLocaleDateString("id-ID", {
												year: "numeric",
												month: "short",
												day: "numeric",
											})}
										</span>
										<Link
											prefetch={false}
											href={`/blog/${item.slug}`}
											className="inline-flex items-center gap-2 text-white font-semibold group/cta hover:gap-3 transition-all"
										>
											Explore
											<svg
												className="w-5 h-5 group-hover/cta:translate-x-1 transition-transform"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fillRule="evenodd"
													d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
													clipRule="evenodd"
												/>
											</svg>
										</Link>
									</div>
								</div>

								{/* Decorative accent */}
								<div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							</div>
						</div>
					))}
				</div>

				{/* Bottom CTA */}
				<div className="text-center mt-16">
					<p className="text-gray-600 mb-6 text-lg">
						Discover more experiences and inspiration
					</p>
					<Link
						href="/blog"
						prefetch={false}
						className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-primary transition-colors duration-300 shadow-lg hover:shadow-xl"
					>
						Explore All
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path
								fillRule="evenodd"
								d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</Link>
				</div>
			</div>
		</section>
	);
}
