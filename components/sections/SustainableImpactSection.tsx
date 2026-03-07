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
			className="relative w-full overflow-hidden min-h-screen md:min-h-auto flex items-center justify-center"
			style={{
				aspectRatio: "auto 1 / auto",
				backgroundImage: `url('${backgroundImage}')`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			{/* Dark Overlay */}
			<div className="absolute inset-0 bg-black/40"></div>

			{/* Content */}
			<div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center text-white px-4 py-12 md:py-24">
				<h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-wider mb-3 md:mb-4">
					{title}
				</h2>
				<p className="text-sm md:text-lg lg:text-xl max-w-sm md:max-w-md mx-auto mb-6 md:mb-8 tracking-wide">
					{subtitle}
				</p>
				<button className="px-4 md:px-6 py-2 md:py-2 border-2 bg-white text-[#1E234A] hover:bg-gray-200 transition-colors duration-300 rounded-full text-xs md:text-sm font-medium tracking-widest">
					{buttonText}
				</button>
			</div>
		</section>
	);
}
