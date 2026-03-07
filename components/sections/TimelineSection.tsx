"use client";

export interface TimelineItem {
	id: string;
	title: string;
	description: string;
}

interface TimelineSectionProps {
	sectionTitle?: string;
	items?: TimelineItem[];
}

const DEFAULT_ITEMS: TimelineItem[] = [];

export default function TimelineSection({
	sectionTitle = "SPIRITUAL JOURNEY",
	items = DEFAULT_ITEMS,
}: TimelineSectionProps) {
	return (
		<section className="py-8 md:py-24 bg-[#fff8f5]">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Title */}
				<div
					data-aos="fade-up"
					data-aos-duration="800"
					className="text-center mb-10"
				>
					<h2 className="text-center text-4xl md:text-5xl font-light tracking-wider mb-12">
						{sectionTitle}
					</h2>
				</div>

				{/* Timeline Container */}
				<div className="relative flex flex-col items-center">
					{/* Center Vertical Line */}
					<div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gray-400"></div>

					{/* Timeline Items */}
					<div className="space-y-8 md:space-y-12 w-full">
						{items.map((item, index) => (
							<div
								key={item.id}
								data-aos="fade-up"
								data-aos-delay={index * 50}
								data-aos-duration="600"
								className="flex flex-col items-center relative"
							>
								{/* Text Content - Centered */}
								<div className="text-center max-w-md bg-[#fff8f5] py-4">
									<h3 className="text-lg md:text-xl  text-gray-900 tracking-wide mb-1">
										{item.title}
									</h3>
									<p className="text-sm md:text-base text-gray-600 leading-relaxed">
										{item.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
