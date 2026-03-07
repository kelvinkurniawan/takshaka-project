import React from "react";

export interface SectionItem {
	image: string;
	alt: string;
	title: string;
	description: string;
}

interface ThreeItemSectionProps {
	images?: SectionItem[];
	heading?: string;
}

export default function ThreeItemSection({
	images,
	heading,
}: ThreeItemSectionProps = {}) {
	const sectionHeading = heading || "";

	const sectionItems: SectionItem[] = images || [];

	return (
		<section className="py-8 md:py-16 px-4 md:px-16 bg-white">
			<div className="max-100 mx-auto px-4 sm:px-6 lg:px-8">
				<h2 className="text-center font-light mb-8 md:mb-12 text-lg md:text-xl">
					{sectionHeading}
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-7xl mx-auto">
					{sectionItems.map((item, idx) => (
						<div key={idx} className="relative group">
							<img
								src={item.image}
								alt={item.alt}
								className="w-full aspect-[3/4] object-cover shadow-lg transition-brightness duration-500 group-hover:brightness-110"
							/>
							<div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 flex pt-60 justify-center transition-bg duration-500">
								<div className="text-center text-white px-6">
									<h3 className="text-2xl font-bold uppercase tracking-wide">
										{item.title}
									</h3>
									<p className="mt-4 text-xl italic">{item.description}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
