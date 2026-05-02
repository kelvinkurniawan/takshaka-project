"use client";

interface SharedExperience {
	id: string;
	title: string;
	description: string;
	image: string;
}

interface ExperiencesSharedSectionProps {
	experiences: SharedExperience[];
}

export default function ExperiencesSharedSection({
	experiences,
}: ExperiencesSharedSectionProps) {
	return (
		<section className="w-full py-12 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#f5f0e6]">
			<div className="mx-auto max-w-7xl">
				{/* Title */}
				<h2 className="text-center text-lg md:text-3xl font-light tracking-widest mb-8 md:mb-20">
					EXPERIENCES SHARED
				</h2>

				{/* Experiences Grid */}
				<div className="space-y-10 md:space-y-20">
					{experiences.map((experience, index) => (
						<div
							key={experience.id}
							data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
							data-aos-duration="400"
							className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${
								index % 2 === 1 ? "md:grid-flow-dense" : ""
							}`}
						>
							{/* Image */}
							<div
								className={`${index % 2 === 1 ? "md:col-start-2" : ""} bg-black inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent h-96 overflow-hidden flex items-center justify-center group`}
							>
								{experience.image && (
									<img
										src={experience.image}
										alt={experience.title}
										className="w-full h-auto object-cover"
									/>
								)}

								{!experience.image && (
									<div className="w-full h-full flex items-center justify-center bg-gray-200">
										<span className="text-gray-500">No Image</span>
									</div>
								)}
							</div>

							{/* Text Content */}
							<div
								className={`${index % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""} max-w-sm mx-auto`}
							>
								<h3 className="text-lg md:text-2xl uppercase tracking-widest mb-6 text-gray-900">
									{experience.title}
								</h3>
								<p className="leading-relaxed text-base md:text-lg italic">
									{experience.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
