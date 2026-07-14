"use client";

interface ImageItem {
	src: string;
	alt: string;
}

interface ImagesSectionProps {
	images: ImageItem[];
	description: string;
}

export default function ImagesSection({
	images,
	description,
}: ImagesSectionProps) {
	return (
		<section id="images-section" className="w-full bg-white">
			{/* Full width images container */}
			<div className="flex flex-col">
				{images.map((image, index) => (
					// if last index, add margin-bottom-0, else mb-4
					<div
						key={index}
						className={`relative w-full h-40 md:h-64 overflow-hidden transform transition-transform duration-500 ease-out hover:scale-105 cursor-pointer ${
							index === images.length - 1 ? "mb-0" : "mb-2 md:mb-4"
						}`}
					>
						<img
							src={image.src}
							alt={image.alt}
							className="w-full h-full object-cover transition-brightness duration-500 group-hover:brightness-110"
							loading="lazy"
							decoding="async"
						/>
						{/* dark overlay that deepens on hover */}
						<div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-opacity duration-500" />
					</div>
				))}
			</div>

			{/* Description section */}
			<div className="bg-[#f5f0e6] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-4xl">
					<p className="text-center text-gray-700 text-base md:text-xl leading-relaxed">
						{description}
					</p>
				</div>
			</div>
		</section>
	);
}
