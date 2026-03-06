import {
	ParallaxHero,
	BoardLetterSection,
	TakskaWaySection,
	BrandStorySection,
	TimelineSection,
} from "@/components/sections";
import Image from "next/image";

export const metadata = {
	title: "Our Inspiration",
	description:
		"Discover the inspiration and vision behind our premium experiences",
};

export default function OurInspirationPage() {
	return (
		<div className="public-light flex flex-col min-h-screen bg-white text-gray-900">
			<main className="flex-1">
				{/* Hero Section */}
				<ParallaxHero
					title="BOARD LETTER"
					description="A message from our leadership"
					backgroundImage="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80"
				/>

				{/* Board Letter Content Section */}
				<BoardLetterSection
					imageUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"
					paragraphs={[
						"At Taksaka, we believe that leadership is defined by the ability to adapt and innovate in an evolving landscape. This past year has tested our resolve and resilience, strengthening our commitment to our guests and partners. We reimagined experiences with a dedicated Team Taksaka to unlock transformational journeys in excellence.",
						"Our philosophy has always centered on authentic value to our clients and partners. By integrating forward-thinking strategies with a dedicated team, Taksaka is not just keeping pace with the industry—we are setting the standard for the future.",
						"We thank you for your continued trust as we embark on this next chapter of our journey.",
					]}
					signatureName="Leadership Team"
					signatureTitle="Taksaka"
				/>

				{/* Fullwidth Image Section */}
				<section className="w-full h-auto">
					<div className="relative w-full" style={{ aspectRatio: "1920/1080" }}>
						<Image
							src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80"
							alt="Inspiration"
							fill
							className="object-cover"
							priority
						/>
					</div>
				</section>

				{/* Taksaka Way Section */}
				<TakskaWaySection />

				{/* Brand Story Section */}
				<BrandStorySection />

				{/* Timeline Section */}
				<TimelineSection />
			</main>
		</div>
	);
}
