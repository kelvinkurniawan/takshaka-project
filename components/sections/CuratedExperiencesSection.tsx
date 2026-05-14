"use client";

import { useState } from "react";
import Link from "next/link";

interface ExperienceItem {
	id: string;
	title: string;
	description: string;
	image: string;
	slug?: string;
}

const PLACEHOLDER_IMAGE =
	"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='16' fill='%23999' text-anchor='middle' dominant-baseline='middle'%3ENo Image Available%3C/text%3E%3C/svg%3E";

interface TabContent {
	id: string;
	label: string;
	items: ExperienceItem[];
}

interface CuratedExperiencesSectionProps {
	tabs: TabContent[];
}

export default function CuratedExperiencesSection({
	tabs,
}: CuratedExperiencesSectionProps) {
	const [activeTab, setActiveTab] = useState(tabs[0]?.id || "");
	const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

	const activeTabContent = tabs.find((tab) => tab.id === activeTab);

	const handleImageError = (itemId: string) => {
		setImageErrors((prev) => ({
			...prev,
			[itemId]: true,
		}));
	};

	return (
		<section className="w-full py-12 md:py-24 px-4 sm:px-6 lg:px-8">
			<div className="mx-auto">
				{/* Title */}
				<h2 className="text-center text-lg md:text-3xl font-light tracking-widest mb-8 md:mb-12">
					CURATED EXPERIENCES
				</h2>

				{/* Tabs */}
				<div className="flex  justify-center gap-3 md:gap-6 mb-4 md:mb-4 border-b border-gray-200 overflow-x-auto">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm tracking-widest font-medium transition-all whitespace-nowrap ${
								activeTab === tab.id
									? "text-gray-900 border-b-2 border-amber-700"
									: "text-gray-500 hover:text-gray-700"
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>

				{/* Tab Content - Grid of Images */}
				{activeTabContent && (
					<div>
						<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 max-w-100 mx-auto">
							{activeTabContent.items.map((item) => {
								const hasError = imageErrors[item.id];
								const imageUrl = hasError ? PLACEHOLDER_IMAGE : item.image;

								return (
									<Link
										key={item.id}
										href={item.slug ? `/blog/${item.slug}` : "#"}
										className="relative aspect-[3/4] bg-gray-900 overflow-hidden group block"
									>
										{/* Image */}
										<img
											src={imageUrl}
											alt={item.title}
											className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
											onError={() => handleImageError(item.id)}
										/>

										{/* Overlay */}
										<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

										{/* Floating Content */}
										<div className="absolute bottom-0 sm:bottom-48 md:bottom-0 left-0 right-0 p-4 md:p-6 text-white">
											<h3 className="text-xs md:text-sm font-semibold mb-2 md:mb-4 uppercase tracking-widest text-center">
												{item.title}
											</h3>
											<p className="text-xs text-gray-300 leading-relaxed text-center line-clamp-2 md:line-clamp-none">
												{item.description}
											</p>
										</div>
									</Link>
								);
							})}
						</div>

						{/* View All Button */}
						<div className="flex justify-center mt-12">
							<Link
								href="/curated-experiences"
								className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-amber-700 transition-colors duration-300 shadow-lg hover:shadow-xl uppercase tracking-widest text-sm"
							>
								Explore All
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 10l-4.293-4.293a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</Link>
						</div>
					</div>
				)}
			</div>
		</section>
	);
}
