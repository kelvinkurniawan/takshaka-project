"use client";

import { useState } from "react";

interface ExperienceItem {
	id: string;
	title: string;
	description: string;
	image: string;
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
				<h2 className="text-center text-2xl md:text-3xl font-light tracking-wider mb-8 md:mb-12">
					CURATED EXPERIENCES
				</h2>

				{/* Tabs */}
				<div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-4 md:mb-4 border-b border-gray-200 overflow-x-auto">
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
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 max-w-100 mx-auto">
						{activeTabContent.items.map((item) => {
							const hasError = imageErrors[item.id];
							const imageUrl = hasError ? PLACEHOLDER_IMAGE : item.image;

							return (
								<div
									key={item.id}
									className="relative h-64 sm:h-80 md:h-96 bg-gray-900 overflow-hidden group"
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
									<div className="absolute top-40 sm:top-48 md:top-60 left-0 right-0 p-4 md:p-6 text-white">
										<h3 className="text-xs md:text-sm font-semibold mb-2 md:mb-4 uppercase tracking-widest text-center">
											{item.title}
										</h3>
										<p className="text-xs text-gray-300 leading-relaxed text-center line-clamp-2 md:line-clamp-none">
											{item.description}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</section>
	);
}
