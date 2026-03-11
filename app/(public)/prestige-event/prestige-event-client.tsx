"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ParallaxHero, Footer } from "@/components/sections";
import Image from "next/image";
import { trackPageView } from "@/lib/analytics-client";

interface PrestigeEventClientProps {
	prestigeEvents: any;
	footerSections: any;
}

export default function PrestigeEventClient({
	prestigeEvents,
	footerSections,
}: PrestigeEventClientProps) {
	const pathname = usePathname();

	useEffect(() => {
		trackPageView(pathname, "Prestige Events", document.referrer);
	}, [pathname]);

	return (
		<>
			{/* Hero Section */}
			{prestigeEvents.hero && (
				<ParallaxHero
					title={prestigeEvents.hero.title}
					description={prestigeEvents.hero.description}
					backgroundImage={prestigeEvents.hero.background}
				/>
			)}

			{/* Hero Content Section - Image with Floating Text */}
			{prestigeEvents.heroContent && (
				<section
					className="relative w-full"
					style={{ aspectRatio: "1920/1080" }}
				>
					{/* Background Image */}
					<Image
						src={prestigeEvents.heroContent.backgroundImage}
						alt={prestigeEvents.heroContent.alt}
						fill
						className="object-cover"
						priority
					/>

					{/* Floating Text Content */}
					<div className="absolute inset-0 bg-black/40 flex items-center">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
							<div
								data-aos="fade-up"
								data-aos-duration="800"
								className="space-y-8"
							>
								<div className="inline-block">
									<span className="text-sm uppercase tracking-widest text-gray-300">
										{prestigeEvents.heroContent.badge}
									</span>
								</div>

								<div className="max-w-2xl">
									<h2 className="text-5xl md:text-6xl font-bold leading-tight mb-8 whitespace-pre-line text-white">
										{prestigeEvents.heroContent.heading}
									</h2>
									<p className="text-lg text-gray-200 leading-relaxed max-w-xl">
										{prestigeEvents.heroContent.description}
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>
			)}

			{/* Two Column Section - Image Left, Text Right */}
			{prestigeEvents.twoColumn && (
				<section className="py-16 md:py-24 bg-white">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
							{/* Image */}
							<div
								data-aos="fade-right"
								data-aos-duration="800"
								className="relative w-full h-96 md:h-full"
							>
								<Image
									src={prestigeEvents.twoColumn.imageUrl}
									alt="Business Experience"
									fill
									className="object-cover rounded-lg"
								/>
							</div>

							{/* Text Content */}
							<div
								data-aos="fade-left"
								data-aos-duration="800"
								className="space-y-6"
							>
								<h2 className="text-5xl md:text-6xl font-bold leading-tight">
									{prestigeEvents.twoColumn.title}
									<br />
									<span className="italic">
										{prestigeEvents.twoColumn.titleItalic}
									</span>
									<br />
									{prestigeEvents.twoColumn.titleBold}
								</h2>
								<p className="text-lg text-gray-600 leading-relaxed max-w-xl">
									{prestigeEvents.twoColumn.description}
								</p>
							</div>
						</div>
					</div>
				</section>
			)}

			{/* Image Gallery Grid */}
			{prestigeEvents.imageGallery && (
				<section className="py-16 md:py-24 bg-white">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							{prestigeEvents.imageGallery.images.map(
								(image: any, index: number) => (
									<div
										key={image.id}
										data-aos="fade-up"
										data-aos-delay={index * 100}
										data-aos-duration="800"
										className="relative w-full aspect-[3/4] overflow-hidden rounded-sm"
									>
										<Image
											src={image.src}
											alt={image.alt}
											fill
											className="object-cover hover:scale-105 transition-transform duration-300"
										/>
									</div>
								),
							)}
						</div>
					</div>
				</section>
			)}

			{/* Footer Section */}
			{footerSections && <Footer sections={footerSections} />}
		</>
	);
}
