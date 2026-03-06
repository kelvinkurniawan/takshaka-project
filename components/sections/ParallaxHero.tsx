"use client";

import { useEffect, useRef, useState } from "react";
import HeroSection, { type HeroSectionProps } from "./HeroSection";

export default function ParallaxHero(props: HeroSectionProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [offsetY, setOffsetY] = useState(0);
	const [scale, setScale] = useState(1);

	useEffect(() => {
		const handleScroll = () => {
			if (!containerRef.current) return;

			const rect = containerRef.current.getBoundingClientRect();
			const elementTop = rect.top;
			const elementHeight = rect.height;
			const windowHeight = window.innerHeight;

			// Calculate how much of the element is visible
			const percentVisible =
				(windowHeight - elementTop) / (elementHeight + windowHeight);

			// Only apply parallax when element is in or near viewport
			if (elementTop < windowHeight && elementTop + elementHeight > 0) {
				// Apply parallax only as you scroll past (negative values move up)
				const offset = Math.min(elementTop * 0.8, 0);
				setOffsetY(offset);

				// Zoom effect: increases more dramatically as you scroll down
				// Calculate how much of the element has been scrolled past (0 to 1+)
				const scrollPast = Math.max(0, -elementTop / elementHeight);
				// Apply zoom effect: starts at 1, increases to max ~1.5 (50% zoom)
				const zoomScale = 1 + scrollPast * 0.2 + percentVisible * 0.1;
				setScale(Math.min(zoomScale, 1.5));
			}
		};

		return;

		// window.addEventListener("scroll", handleScroll, { passive: true });
		// handleScroll();
		// return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div
			ref={containerRef}
			className="relative w-full"
			style={{
				perspective: "1200px",
				overflow: "hidden",
			}}
		>
			<div
				style={{
					transform: `translateY(${offsetY}px)`,
					transition: "transform 0.05s linear",
					width: "100%",
					willChange: "transform",
				}}
			>
				<HeroSection {...props} backgroundScale={scale} />
			</div>
		</div>
	);
}
