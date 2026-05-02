"use client";

import { useState } from "react";
import Image from "next/image";

interface FeaturedImageSectionProps {
	src: string;
	alt: string;
}

export default function FeaturedImageSection({
	src,
	alt,
}: FeaturedImageSectionProps) {
	const [hasError, setHasError] = useState(false);

	const handleError = () => {
		setHasError(true);
	};

	// If image failed to load or not found, don't render
	if (hasError) {
		return null;
	}

	return (
		<div className="relative w-full h-96 bg-gray-200 overflow-hidden mx-auto max-w-7xl">
			<Image
				src={src}
				alt={alt}
				fill
				className="object-cover"
				unoptimized
				onError={handleError}
			/>
		</div>
	);
}
