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

const DEFAULT_ITEMS: BrandStoryItem[] = [];

export default function BrandStorySection({
	backgroundImage = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80",
	sectionTitle = "BRAND STORY",
	items = DEFAULT_ITEMS,
}: BrandStorySectionProps) {
	return (
		<section className="w-full">
			{/* Header Image with Title */}
			<div className="relative w-full">
				<img
					src={backgroundImage}
					alt="Brand Story"
					className="object-cover w-full h-full"
				/>
				{/* Title Overlay */}
				<div className="absolute inset-0 flex items-center justify-center bg-black/30">
					<h2 className="text-2xl underline text-white tracking-widest">
						{sectionTitle}
					</h2>
				</div>
			</div>

			{/* Content Grid */}
			<div className="py-16 md:py-24 ">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="space-y-20">
						{items.map((item, index) => {
							const isEven = index % 2 === 0;
							return (
								<div
									key={item.id}
									data-aos="fade-up"
									data-aos-delay={index * 100}
									data-aos-duration="800"
									className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
								>
									{/* Image */}
									<div
										className={`relative overflow-hidden ${
											isEven ? "md:order-1" : "md:order-2"
										}`}
									>
										<Image
											src={item.imageUrl}
											alt={item.title}
											width={500}
											height={500}
											className="w-full h-auto object-cover"
										/>
									</div>

									{/* Text Content */}
									<div
										className={`${isEven ? "md:order-2" : "md:order-1"} max-w-sm mx-auto`}
									>
										<h3 className="text-3xl md:text-2xl text-gray-900 mb-6 tracking-wide">
											{item.title}
										</h3>
										<p className="text-lg text-gray-700 leading-relaxed">
											{item.description}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
