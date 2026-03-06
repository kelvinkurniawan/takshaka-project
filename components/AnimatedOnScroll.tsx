"use client";

import React, { useEffect, useRef, useState } from "react";

interface AnimatedOnScrollProps {
	children: React.ReactNode;
	className?: string;
	delay?: number;
	threshold?: number;
}

/**
 * Component that triggers animations when element enters viewport
 * Uses Intersection Observer API for performance
 */
export default function AnimatedOnScroll({
	children,
	className = "",
	delay = 0,
	threshold = 0.1,
}: AnimatedOnScrollProps) {
	const [isVisible, setIsVisible] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					// Trigger animation when visible
					setTimeout(() => {
						setIsVisible(true);
					}, delay);
					// Stop observing after animation triggered
					observer.unobserve(entry.target);
				}
			},
			{
				threshold,
				rootMargin: "0px 0px -50px 0px", // Start animation 50px before element enters viewport
			},
		);

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => {
			if (ref.current) {
				observer.unobserve(ref.current);
			}
		};
	}, [delay, threshold]);

	return (
		<div
			ref={ref}
			className={`transition-all duration-700 ${
				isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
			} ${className}`}
		>
			{children}
		</div>
	);
}
