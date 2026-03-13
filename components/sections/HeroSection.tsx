"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import HeroNavigation from "./HeroNavigation";

export interface HeroContentItem {
	title: string;
	description: string;
	background?: string; // Can be image or video URL
}

export interface HeroSectionProps {
	contents?: HeroContentItem[]; // New: multiple contents
	// Legacy support for old interface
	title?: string;
	description?: string;
	backgroundImage?: string;
	background?: string;
	backgroundScale?: number;
	autoAdvanceInterval?: number; // in milliseconds, default 5000
}

// Helper function to detect if URL is a video
const isVideoUrl = (url?: string): boolean => {
	if (!url) return false;
	const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"];
	return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
};

export default function HeroSection({
	contents,
	title,
	description,
	backgroundImage,
	background,
	backgroundScale = 1,
	autoAdvanceInterval = 5000,
}: HeroSectionProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [touchStart, setTouchStart] = useState(0);
	const [touchEnd, setTouchEnd] = useState(0);

	// Support both new (contents array) and legacy (title/description/backgroundImage) interfaces
	const validContents: HeroContentItem[] = (() => {
		// If contents array is provided (new interface)
		if (contents && contents.length > 0) {
			return contents;
		}
		// If legacy properties are provided
		if (title || description || backgroundImage || background) {
			return [
				{
					title: title || "Welcome",
					description: description || "",
					background: background || backgroundImage,
				},
			];
		}
		// Default fallback
		return [
			{
				title: "Welcome",
				description: "Experience the journey",
			},
		];
	})();

	const currentContent = validContents[currentIndex];
	const isVideo = isVideoUrl(currentContent?.background);

	// Check if any content has a video - disable auto-advance if yes
	const hasAnyVideo = validContents.some((content) =>
		isVideoUrl(content.background),
	);
	const effectiveAutoAdvanceInterval = hasAnyVideo ? 0 : autoAdvanceInterval;

	// Auto-advance slideshow (disabled if there's a video)
	useEffect(() => {
		if (validContents.length <= 1 || effectiveAutoAdvanceInterval === 0) return;

		const interval = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % validContents.length);
		}, effectiveAutoAdvanceInterval);

		return () => clearInterval(interval);
	}, [validContents.length, effectiveAutoAdvanceInterval]);

	// Handle touch swipe
	const handleTouchStart = (e: React.TouchEvent) => {
		setTouchStart(e.targetTouches[0].clientX);
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		setTouchEnd(e.targetTouches[0].clientX);
	};

	const handleTouchEnd = () => {
		if (!touchStart || !touchEnd) return;

		const swipeDistance = touchStart - touchEnd;
		const isSwipeLeft = swipeDistance > 50; // Swipe left (next)
		const isSwipeRight = swipeDistance < -50; // Swipe right (previous)

		if (isSwipeLeft) {
			goToNext();
		} else if (isSwipeRight) {
			goToPrevious();
		}
	};

	// Handle keyboard navigation
	useEffect(() => {
		if (validContents.length <= 1) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowLeft") {
				goToPrevious();
			} else if (e.key === "ArrowRight") {
				goToNext();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [validContents.length]);

	// Handle navigation
	const goToSlide = (index: number) => {
		setCurrentIndex(index);
	};

	const goToPrevious = () => {
		setCurrentIndex((prev) =>
			prev === 0 ? validContents.length - 1 : prev - 1,
		);
	};

	const goToNext = () => {
		setCurrentIndex((prev) => (prev + 1) % validContents.length);
	};

	return (
		<>
			<section
				className="relative h-[90vh] md:h-screen flex items-center justify-center overflow-hidden"
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
			>
				{/* Navigation */}
				<HeroNavigation
					logo={
						<img src="/images/logo.png" alt="Logo" className="h-24 w-auto" />
					}
				/>

				{/* Background Video or Image */}
				{isVideo && currentContent?.background ? (
					// Video Background
					<div
						key={`video-${currentIndex}`}
						className="absolute inset-0 overflow-hidden transition-opacity duration-1000"
					>
						<video
							src={currentContent.background}
							autoPlay
							muted
							loop
							playsInline
							className="w-full h-full object-cover"
							onLoadedData={() => setIsLoading(false)}
						/>
					</div>
				) : (
					// Image Background
					<div
						key={`image-${currentIndex}`}
						className="absolute inset-0 transition-opacity duration-1000"
						style={{
							transform: `scale(${backgroundScale})`,
							transformOrigin: "center",
							transition: "transform 0.05s linear, opacity 1s ease-in-out",
						}}
					>
						{currentContent?.background ? (
							<Image
								src={currentContent.background}
								alt="Hero Background"
								fill
								className="object-cover"
								priority
								unoptimized
								onLoadingComplete={() => setIsLoading(false)}
							/>
						) : (
							<div className="w-full h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" />
						)}
					</div>
				)}

				{/* Overlay with gradient */}
				<div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>

				{/* Content */}
				<div
					key={`content-${currentIndex}`}
					className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl"
				>
					<h1 className="text-xl sm:text-3xl md:text-5xl mb-2 font-elegance uppercase leading-tight drop-shadow-lg tracking-widest">
						{currentContent?.title}
					</h1>
					<p className="text-base sm:text-lg md:text-base text-gray-100 mb-4 font-light leading-relaxed max-w-3xl mx-auto drop-shadow">
						{currentContent?.description}
					</p>

					{/* CTA Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
						<Link
							href="#featured"
							className="inline-block bg-white text-slate-900 px-4 sm:px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base tracking-widest"
						>
							EXPLORE NOW
						</Link>
					</div>
				</div>

				{/* Scroll Indicator - only show if single slide */}
				{validContents.length === 1 && (
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
				)}

				{/* Navigation Arrows - show only if multiple slides */}
				{validContents.length > 1 && (
					<>
						{/* Previous Button */}
						<button
							onClick={goToPrevious}
							className="absolute left-4 sm:left-8 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition duration-300 hover:scale-110"
							aria-label="Previous slide"
						>
							<svg
								className="w-5 sm:w-6 h-5 sm:h-6"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth={2}
							>
								<path d="M15 19l-7-7 7-7" />
							</svg>
						</button>

						{/* Next Button */}
						<button
							onClick={goToNext}
							className="absolute right-4 sm:right-8 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition duration-300 hover:scale-110"
							aria-label="Next slide"
						>
							<svg
								className="w-5 sm:w-6 h-5 sm:h-6"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth={2}
							>
								<path d="M9 5l7 7-7 7" />
							</svg>
						</button>
					</>
				)}

				{/* Carousel Dots - show only if multiple slides */}
				{validContents.length > 1 && (
					<div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-50 pointer-events-auto">
						{validContents.map((_, index) => (
							<button
								key={index}
								onClick={() => goToSlide(index)}
								className={`h-3 rounded-full transition-all duration-300 cursor-pointer ${
									index === currentIndex
										? "w-8 bg-white shadow-lg"
										: "w-3 bg-white/50 hover:bg-white/80"
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
