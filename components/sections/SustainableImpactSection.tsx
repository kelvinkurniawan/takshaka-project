"use client";

interface SustainableImpactSectionProps {
	title?: string;
	subtitle?: string;
	buttonText?: string;
	backgroundImage?: string;
}

export default function SustainableImpactSection({
	title = "SUSTAINABLE IMPACT",
	subtitle = "Our Commitment to Environment & Communities",
	buttonText = "SEE OUR IMPACT",
	backgroundImage = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80",
}: SustainableImpactSectionProps) {
	return (
		<section
			className="relative w-full overflow-hidden"
			style={{
				aspectRatio: "1728/549",
				backgroundImage: `url('${backgroundImage}')`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			{/* Content */}
			<div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center text-white">
				<h2 className="text-4xl md:text-4xl font-bold tracking-wider mb-4">
					{title}
				</h2>
				<p className="text-lg md:text-xl max-w-sm mx-auto mb-8 tracking-wide">
					{subtitle}
				</p>
				<button className="px-3 py-1  border-2 bg-white text-[#1E234A] hover:bg-gray-400 transition-colors duration-300 rounded-3xl">
					{buttonText}
				</button>
			</div>
		</section>
	);
}
