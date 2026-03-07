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
		<section className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-[#f5f0e6]">
			<div className="mx-auto max-w-7xl">
				{/* Title */}
				<h2 className="text-center text-4xl md:text-5xl font-light tracking-wider mb-12">
					EXPERIENCES SHARED
				</h2>

				{/* Experiences Grid */}
				<div className="space-y-20">
					{experiences.map((experience, index) => (
						<div
							key={experience.id}
							data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
							data-aos-duration="800"
							className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${
								index % 2 === 1 ? "md:grid-flow-dense" : ""
							}`}
						>
							{/* Image */}
							<div
								className={`${index % 2 === 1 ? "md:col-start-2" : ""} bg-black inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent h-[400px]`}
							>
								<img
									src={experience.image}
									alt={experience.title}
									className="w-full h-auto object-cover"
								/>
							</div>

							{/* Text Content */}
							<div
								className={`${index % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""} max-w-sm mx-auto`}
							>
								<h3 className="text-2xl md:text-2xl uppercase tracking-widest mb-6 text-gray-900">
									{experience.title}
								</h3>
								<p className="leading-relaxed text-base italic">
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
