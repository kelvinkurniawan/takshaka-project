"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";

interface HeroNavigationProps {
	links?: { label: string; link: string }[];
	logo?: React.ReactNode;
}

const DEFAULT_LINKS = [
	{
		label: "OUR INSPIRATION",
		link: "/our-inspiration",
	},
	{
		label: "PRESTIGE EVENT",
		link: "/prestige-event",
	},
	{
		label: "SIGNATURE VOYAGE",
		link: "/signature-voyage",
	},
	{
		label: "WELLNESS ESCAPE",
		link: "/wellness-escape",
	},
	{
		label: "CURATED EXPERIENCES",
		link: "/curated-experiences",
	},
];

export default function HeroNavigation({
	links = DEFAULT_LINKS,
	logo,
}: HeroNavigationProps) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<nav className="absolute top-0 left-0 w-full z-30">
			<div className="w-full">
				{/* Desktop and Mobile Header */}
				<div className="max-w-7xl mx-auto flex flex-col md:flex-col items-center px-4 py-4 md:py-6">
					{/* logo on top */}
					<a className="mb-8 mt-4 md:mb-8 md:mt-4" href="/">
						{logo || <span className="text-white font-bold text-lg">LOGO</span>}
					</a>

					{/* Desktop Navigation - Hidden on mobile */}
					<div className="flex-wrap md:flex justify-center items-center md:mt-2  hidden ">
						{links.map(({ label, link }, idx) => (
							<Link
								key={idx}
								href={link}
								className="text-white text-sm font-medium hover:underline transition-colors p-1 md:px-4"
							>
								{label}
							</Link>
						))}
					</div>
				</div>
			</div>
		</nav>
	);
}
