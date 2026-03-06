"use client";

import React, { useState } from "react";

interface OptimizedImageProps {
	src: string;
	alt: string;
	width?: string;
	height?: string;
	objectFit?: "cover" | "contain" | "fill" | "scale-down";
	borderRadius?: string;
	className?: string;
	aspectRatio?: string; // e.g., "16/9", "4/3", "1/1"
}

/**
 * Image component with broken image fallback
 * Shows placeholder with proper aspect ratio while loading/broken
 */
export default function OptimizedImage({
	src,
	alt,
	width = "100%",
	height = "auto",
	objectFit = "cover",
	borderRadius = "0px",
	className = "",
	aspectRatio = "auto",
}: OptimizedImageProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	const handleLoad = () => {
		setIsLoading(false);
	};

	const handleError = () => {
		setIsLoading(false);
		setHasError(true);
	};

	// Calculate height from aspect ratio
	const getHeightFromAspectRatio = () => {
		if (aspectRatio === "auto" || height !== "auto") {
			return height;
		}

		// Parse aspect ratio string like "16/9"
		const ratio = aspectRatio.split("/");
		if (ratio.length === 2) {
			const w = parseFloat(ratio[0]);
			const h = parseFloat(ratio[1]);
			const percentage = ((h / w) * 100).toFixed(2);
			return `${percentage}%`;
		}

		return height;
	};

	const computedHeight = getHeightFromAspectRatio();
	const containerStyle: React.CSSProperties =
		aspectRatio !== "auto"
			? {
					position: "relative",
					width: width,
					paddingBottom: computedHeight,
					overflow: "hidden",
					borderRadius: borderRadius,
				}
			: {
					borderRadius: borderRadius,
				};

	const imageStyle: React.CSSProperties =
		aspectRatio !== "auto"
			? {
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					objectFit: objectFit,
				}
			: {
					width: width,
					height: computedHeight,
					objectFit: objectFit,
				};

	if (hasError) {
		// Fallback placeholder for broken images
		return (
			<div
				style={containerStyle}
				className={`bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center ${className}`}
			>
				<div className="text-center">
					<svg
						className="w-12 h-12 mx-auto mb-2 text-gray-400 dark:text-gray-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={1.5}
							d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
					<p className="text-xs text-gray-500 dark:text-gray-400">
						Image not available
					</p>
				</div>
			</div>
		);
	}

	return (
		<div style={containerStyle} className="relative">
			{isLoading && (
				<div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
			)}
			<img
				src={src}
				alt={alt}
				style={imageStyle}
				className={`${
					isLoading ? "invisible" : "visible"
				} max-w-full h-auto ${className}`}
				onLoad={handleLoad}
				onError={handleError}
			/>
		</div>
	);
}
