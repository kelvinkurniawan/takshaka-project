"use client";

import Image from "next/image";

export interface BrandStoryItem {
	id: string;
	title: string;
	description: string;
	imageUrl: string;
}

interface BrandStorySectionProps {
	backgroundImage?: string;
	sectionTitle?: string;
	items?: BrandStoryItem[];
}

const DEFAULT_ITEMS: BrandStoryItem[] = [
	{
		id: "origin",
		title: "THE ORIGIN",
		description:
			"Taksaka draws from a rich cultural heritage, weaving together ancestral wisdom with contemporary consciousness to create transformative journeys.",
		imageUrl:
			"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
	},
	{
		id: "myth",
		title: "MYTH & SYMBOL",
		description:
			"More than mythology, Taksaka embodies the sacred connection between the ethereal and the spiritual, honoring the timeless and cherished traditions.",
		imageUrl:
			"https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&q=80",
	},
	{
		id: "meaning",
		title: "MEANING",
		description:
			"At its heart, Taksaka seeks to awaken collective revelation advancing consciousness, responsibility, and renewal to transform experience.",
		imageUrl:
			"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80",
	},
];

export default function BrandStorySection({
	backgroundImage = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80",
	sectionTitle = "BRAND STORY",
	items = DEFAULT_ITEMS,
}: BrandStorySectionProps) {
	return (
		<section className="w-full">
			{/* Header Image with Title */}
			<div className="relative w-full" style={{ aspectRatio: "1920/400" }}>
				<Image
					src={backgroundImage}
					alt="Brand Story"
					fill
					className="object-cover"
					priority
				/>
				{/* Title Overlay */}
				<div className="absolute inset-0 flex items-center justify-center bg-black/30">
					<h2 className="text-5xl md:text-6xl font-bold text-white tracking-widest">
						{sectionTitle}
					</h2>
				</div>
			</div>

			{/* Content Grid */}
			<div className="py-16 md:py-24 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="space-y-20">
						{items.map((item, index) => (
							<div
								key={item.id}
								data-aos="fade-up"
								data-aos-delay={index * 100}
								data-aos-duration="800"
								className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${
									index % 2 === 1
										? "md:grid-cols-[1fr_2fr]"
										: "md:grid-cols-[2fr_1fr]"
								}`}
							>
								{/* Image - alternates left/right */}
								{index % 2 === 0 ? (
									<div className="relative w-full h-80 md:h-96 overflow-hidden rounded-lg order-2 md:order-1">
										<Image
											src={item.imageUrl}
											alt={item.title}
											fill
											className="object-cover"
										/>
									</div>
								) : null}

								{/* Text Content */}
								<div
									className={`order-1 ${index % 2 === 0 ? "md:order-2" : "md:order-1"}`}
								>
									<h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-wide">
										{item.title}
									</h3>
									<p className="text-lg text-gray-700 leading-relaxed">
										{item.description}
									</p>
								</div>

								{/* Image - right side for odd items */}
								{index % 2 === 1 ? (
									<div className="relative w-full h-80 md:h-96 overflow-hidden rounded-lg order-2 md:order-2">
										<Image
											src={item.imageUrl}
											alt={item.title}
											fill
											className="object-cover"
										/>
									</div>
								) : null}
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
