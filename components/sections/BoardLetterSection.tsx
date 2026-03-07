"use client";

interface BoardLetterSectionProps {
	title?: string;
	subtitle?: string;
	imageUrl?: string;
	content?: string;
	paragraphs?: string[];
	signatureName?: string;
	signatureTitle?: string;
}

type Paragraph = {
	null: string;
};

export default function BoardLetterSection({
	imageUrl = "",
	paragraphs = [],
}: BoardLetterSectionProps) {
	// Normalize paragraphs data to always be an array of strings
	const normalizeParagraphs = (data: any): string[] => {
		if (!data) return [];
		const result = data.map(
			(item: Record<string, string>) => Object.values(item)[0],
		);

		return result;
	};

	const normalizedParagraphs = normalizeParagraphs(paragraphs);
	return (
		<section className="py-32 ">
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
							<img
								src={imageUrl}
								alt="Leadership"
								className="object-cover w-full h-full"
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
							{normalizedParagraphs.map((paragraph, index) => (
								<p key={index} className="text-gray-700 leading-relaxed mb-4">
									{paragraph}
								</p>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
