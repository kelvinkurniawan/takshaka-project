"use client";

import Image from "next/image";

interface BoardLetterSectionProps {
	title?: string;
	subtitle?: string;
	imageUrl?: string;
	content?: string;
	paragraphs?: string[];
	signatureName?: string;
	signatureTitle?: string;
}

export default function BoardLetterSection({
	title = "Leadership Team",
	subtitle = "Taksaka",
	imageUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
	paragraphs = [
		"At Taksaka, we believe that leadership is defined by the ability to adapt and innovate in an evolving landscape. This past year has tested our resolve and resilience, strengthening our commitment to our guests and partners. We reimagined experiences with a dedicated Team Taksaka to unlock transformational journeys in excellence.",
		"Our philosophy has always centered on authentic value to our clients and partners. By integrating forward-thinking strategies with a dedicated team, Taksaka is not just keeping pace with the industry—we are setting the standard for the future.",
		"We thank you for your continued trust as we embark on this next chapter of our journey.",
	],
	signatureName = "Leadership Team",
	signatureTitle = "Taksaka",
}: BoardLetterSectionProps) {
	return (
		<section className="py-16 md:py-24 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Main Content Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
					{/* Image Column */}
					<div
						data-aos="fade-right"
						data-aos-duration="800"
						className="flex items-center justify-center"
					>
						<div className="relative w-full h-96 md:h-full">
							<Image
								src={imageUrl}
								alt="Leadership"
								fill
								className="object-cover rounded-lg"
								priority
							/>
						</div>
					</div>

					{/* Text Content Column */}
					<div
						data-aos="fade-left"
						data-aos-duration="800"
						className="space-y-6"
					>
						<div>
							{paragraphs.map((paragraph, index) => (
								<p key={index} className="text-gray-700 leading-relaxed mb-4">
									{paragraph}
								</p>
							))}
						</div>

						{/* Signature */}
						<div className="pt-6 border-t border-gray-300">
							<p className="font-semibold text-gray-900">{signatureName}</p>
							<p className="text-gray-600 text-sm">{signatureTitle}</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
