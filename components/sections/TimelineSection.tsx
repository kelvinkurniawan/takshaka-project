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

const DEFAULT_ITEMS: TimelineItem[] = [
	{
		id: "mount-agung",
		title: "MOUNT AGUNG",
		description: "The axis of spiritual elevation.",
	},
	{
		id: "cloud",
		title: "CLOUD",
		description: "Aspiration beyond boundaries.",
	},
	{
		id: "air",
		title: "AIR",
		description: "Invisible force that connects all.",
	},
	{
		id: "fire",
		title: "FIRE",
		description: "Energy of transformation.",
	},
	{
		id: "water",
		title: "WATER",
		description: "Balance through adaptability.",
	},
	{
		id: "night-queen",
		title: "NIGHT QUEEN",
		description: "Timeless victory and grace.",
	},
	{
		id: "dragon",
		title: "DRAGON",
		description: "Directional growth and evolution.",
	},
	{
		id: "dragon-wing",
		title: "DRAGON WING",
		description: "Transcendental strength.",
	},
	{
		id: "gold-crown",
		title: "GOLD CROWN",
		description: "Illuminated authority.",
	},
	{
		id: "circle",
		title: "CIRCLE",
		description: "Eternal unity.",
	},
	{
		id: "gold-jewels",
		title: "GOLD JEWELS",
		description: "Inner prosperity and clarity.",
	},
];

export default function TimelineSection({
	sectionTitle = "SPIRITUAL JOURNEY",
	items = DEFAULT_ITEMS,
}: TimelineSectionProps) {
	return (
		<section className="py-16 md:py-24 bg-white">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Title */}
				<div
					data-aos="fade-up"
					data-aos-duration="800"
					className="text-center mb-20"
				>
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-wider">
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
								{/* Center Dot */}
								<div className="w-5 h-5 bg-gray-900 rounded-full border-4 border-white shadow-md relative z-10 mb-4"></div>

								{/* Text Content - Centered */}
								<div className="text-center max-w-md">
									<h3 className="text-lg md:text-xl font-bold text-gray-900 tracking-wide mb-1">
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
