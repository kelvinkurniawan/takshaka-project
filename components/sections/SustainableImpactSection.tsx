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
			className="relative w-full h-80 md:h-96 flex items-center justify-center overflow-hidden"
			style={{
				backgroundImage: `url('${backgroundImage}')`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			{/* Dark Overlay */}
			<div className="absolute inset-0 bg-black/50"></div>

			{/* Content */}
			<div className="relative z-10 text-center text-white">
				<h2 className="text-4xl md:text-5xl font-bold tracking-wider mb-4">
					{title}
				</h2>
				<p className="text-lg md:text-xl mb-8 tracking-wide">{subtitle}</p>
				<button className="px-8 py-3 border-2 border-white text-white font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 tracking-wider text-sm">
					{buttonText}
				</button>
			</div>
		</section>
	);
}
