"use client";

import Image from "next/image";

export interface TakskaWayItem {
	id: string;
	title: string;
	imageUrl: string;
}

interface TakskaWaySectionProps {
	sectionTitle?: string;
	items?: TakskaWayItem[];
}

const DEFAULT_ITEMS: TakskaWayItem[] = [
	{
		id: "authenticity",
		title: "AUTHENTICITY",
		imageUrl:
			"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80",
	},
	{
		id: "transformation",
		title: "TRANSFORMATION",
		imageUrl:
			"https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=500&q=80",
	},
	{
		id: "sustainability",
		title: "SUSTAINABILITY",
		imageUrl:
			"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&q=80",
	},
	{
		id: "harmony",
		title: "HARMONY",
		imageUrl:
			"https://images.unsplash.com/photo-1502933691298-84fc14542831?w=500&q=80",
	},
	{
		id: "excellence",
		title: "EXCELLENCE\nIN EXPERIENCE",
		imageUrl:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80",
	},
];

export default function TakskaWaySection({
	sectionTitle = "TAKSHAKA WAY",
	items = DEFAULT_ITEMS,
}: TakskaWaySectionProps) {
	return (
		<section className="py-16 md:py-24 ">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Title */}
				<div
					data-aos="fade-up"
					data-aos-duration="800"
					className="text-center mb-16"
				>
					<h2 className="text-center text-4xl md:text-5xl font-light tracking-wider mb-12">
						{sectionTitle}
					</h2>
				</div>

				{/* Images Grid - 5 columns on desktop, horizontal scroll on mobile */}
				<div className="hidden md:grid md:grid-cols-5 gap-4 md:gap-6">
					{items.map((item, index) => (
						<div
							key={item.id}
							data-aos="fade-up"
							data-aos-delay={index * 100}
							data-aos-duration="800"
							className="flex flex-col items-center"
						>
							{/* Image Container */}
							<div className="relative w-full aspect-[3/4] mb-4 overflow-hidden rounded-sm">
								<Image
									src={item.imageUrl}
									alt={item.title}
									fill
									className="object-cover hover:scale-105 transition-transform duration-300"
									sizes="(max-width: 768px) 50vw, 20vw"
									unoptimized
								/>
							</div>

							{/* Title */}
							<h3 className="text-center text-sm md:text-base font-semibold text-gray-900 tracking-wide whitespace-pre-line">
								{item.title}
							</h3>
						</div>
					))}
				</div>

				{/* Mobile Horizontal Scrollable */}
				<div className="md:hidden overflow-x-auto overflow-y-hidden pb-4">
					<div className="flex gap-4 px-4">
						{items.map((item, index) => (
							<div
								key={item.id}
								data-aos="fade-up"
								data-aos-delay={index * 100}
								data-aos-duration="800"
								className="flex flex-col items-center flex-shrink-0"
								style={{ width: "160px" }}
							>
								{/* Image Container */}
								<div className="relative w-full aspect-[3/4] mb-3 overflow-hidden rounded-sm">
									<Image
										src={item.imageUrl}
										alt={item.title}
										fill
										className="object-cover hover:scale-105 transition-transform duration-300"
										sizes="160px"
										unoptimized
									/>
								</div>

								{/* Title */}
								<h3 className="text-center text-xs sm:text-sm font-semibold text-gray-900 tracking-wide whitespace-pre-line">
									{item.title}
								</h3>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
