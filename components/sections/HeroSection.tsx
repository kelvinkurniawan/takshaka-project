"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import HeroNavigation from "./HeroNavigation";

export interface HeroSectionProps {
	title: string;
	description: string;
	backgroundImage?: string;
	backgroundScale?: number;
}

// Helper function to detect if URL is a video
const isVideoUrl = (url?: string): boolean => {
	if (!url) return false;
	const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"];
	return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
};

// Collection of beautiful Unsplash images for slideshow
const SLIDESHOW_IMAGES = [
	"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80", // Mountains and nature
	"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80&auto=format&fit=crop", // Ocean landscape
	"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80", // Tropical beach
	"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80", // Scenic landscape
	"https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&q=80", // Ocean sunset
	"https://images.unsplash.com/photo-1502933691298-84fc14542831?w=1920&q=80", // Beach paradise
];

export default function HeroSection({
	title,
	description,
	backgroundImage,
	backgroundScale = 1,
}: HeroSectionProps) {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	const isVideo = isVideoUrl(backgroundImage);
	const images =
		backgroundImage && !isVideo
			? [backgroundImage]
			: isVideo
				? []
				: SLIDESHOW_IMAGES;

	// Auto-advance slideshow (only for images)
	useEffect(() => {
		if (isVideo || images.length <= 1) return;

		const interval = setInterval(() => {
			setCurrentImageIndex((prev) => (prev + 1) % images.length);
		}, 5000); // Change image every 5 seconds

		return () => clearInterval(interval);
	}, [images.length, isVideo]);

	// Handle dot navigation
	const goToSlide = (index: number) => {
		setCurrentImageIndex(index);
	};

	return (
		<>
			<section className="relative h-screen flex items-center justify-center overflow-hidden">
				{/* place navigation inside hero */}
				<HeroNavigation
					logo={
						<img src="/images/logo.png" alt="Logo" className="h-24 w-auto" />
					}
				/>

				{/* Background Video or Image Slideshow */}
				{isVideo ? (
					// Video Background
					<div className="absolute inset-0 overflow-hidden">
						<video
							src={backgroundImage}
							autoPlay
							muted
							loop
							playsInline
							className="w-full h-full object-cover"
							onLoadedData={() => setIsLoading(false)}
						/>
					</div>
				) : (
					// Image Slideshow Background
					<div
						className="absolute inset-0"
						style={{
							transform: `scale(${backgroundScale})`,
							transformOrigin: "center",
							transition: "transform 0.05s linear",
						}}
					>
						{images.map((image, index) => (
							<div
								key={index}
								className={`absolute inset-0 transition-opacity duration-1000 ${
									index === currentImageIndex ? "opacity-100" : "opacity-0"
								}`}
							>
								<Image
									src={image}
									alt={`Slide ${index + 1}`}
									fill
									className="object-cover"
									priority={index === 0}
									unoptimized
									onLoadingComplete={() => setIsLoading(false)}
								/>
							</div>
						))}
					</div>
				)}

				{/* Overlay with gradient */}
				<div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>

				{/* Content */}
				<div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl">
					<h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 font-elegance leading-tight drop-shadow-lg">
						{title}
					</h1>
					<p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 mb-8 sm:mb-12 font-light leading-relaxed max-w-3xl mx-auto drop-shadow">
						{description}
					</p>

					{/* CTA Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
						<Link
							href="#featured"
							className="inline-block bg-white text-slate-900 px-8 sm:px-12 py-2 rounded-full font-semibold hover:bg-gray-100 transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
						>
							EXPLORE NOW
						</Link>
					</div>
				</div>

				{/* Scroll Indicator */}
				<div className="absolute bottom-8 sm:bottom-16 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
					<svg
						className="w-6 sm:w-8 h-6 sm:h-8 text-white drop-shadow"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 14l-7 7m0 0l-7-7m7 7V3"
						/>
					</svg>
				</div>

				{/* Carousel Dots (only for image slideshow) */}
				{!isVideo && images.length > 1 && (
					<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
						{images.map((_, index) => (
							<button
								key={index}
								onClick={() => goToSlide(index)}
								className={`h-2 transition-all duration-300 rounded-full ${
									index === currentImageIndex
										? "w-8 bg-white"
										: "w-2 bg-white/50 hover:bg-white/80"
								}`}
								aria-label={`Go to slide ${index + 1}`}
							/>
						))}
					</div>
				)}
			</section>
		</>
	);
}
