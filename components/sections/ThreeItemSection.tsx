import React from "react";

export interface SectionItem {
	image: string;
	alt: string;
	title: string;
	description: string;
}

export default function ThreeItemSection() {
	const sectionHeading =
		"Rooted in cultural wisdom, we curate bespoke experiences that are meaningful, transformative, and timeless.";

	const sectionItems: SectionItem[] = [
		{
			image:
				"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80",
			alt: "Impactful Experience",
			title: "Impactful Experience",
			description:
				"Every journey designed with intention, precision, and meaning.",
		},
		{
			image:
				"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80",
			alt: "Cultural Wisdom",
			title: "Cultural Wisdom",
			description:
				"Insired by the depth of cultural wisdom, we design experiences that transcend beauty, harmony, and transformation.",
		},
		{
			image:
				"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80",
			alt: "Bespoke Services",
			title: "Bespoke Services",
			description:
				"We curate bespoke experiences, meticulously crafted for each client, transforming vision into moments of lasting meaning.",
		},
	];

	return (
		<section className="py-16 px-16 bg-white">
			<div className="max-100 mx-auto px-4 sm:px-6 lg:px-8">
				<h2 className="text-center font-light mb-12">{sectionHeading}</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{sectionItems.map((item, idx) => (
						<div key={idx} className="relative group">
							<img
								src={item.image}
								alt={item.alt}
								className="w-full aspect-[3/4] object-cover shadow-lg"
							/>
							<div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
								<div className="text-center text-white px-6">
									<h3 className="text-2xl font-bold uppercase tracking-wide">
										{item.title}
									</h3>
									<p className="mt-4 text-base">{item.description}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
