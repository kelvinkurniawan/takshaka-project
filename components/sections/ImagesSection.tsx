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
						className={`w-full h-48 md:h-64 overflow-hidden ${
							index === images.length - 1 ? "mb-0" : "mb-4"
						}`}
					>
						<img
							src={image.src}
							alt={image.alt}
							className="w-full h-full object-cover"
						/>
					</div>
				))}
			</div>

			{/* Description section */}
			<div className="bg-[#F6F1E7] py-12 px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-3xl">
					<p className="text-center text-gray-700 text-base leading-relaxed">
						{description}
					</p>
				</div>
			</div>
		</section>
	);
}
