import Link from "next/link";
import React from "react";

interface HeroNavigationProps {
	links?: string[];
	logo?: React.ReactNode;
}

const DEFAULT_LINKS = [
	"OUR INSPIRATION",
	"PRESTIGE EVENT",
	"SIGNATURE VOYAGE",
	"WELLNESS ESCAPE",
	"CURATED EXPERIENCES",
];

export default function HeroNavigation({
	links = DEFAULT_LINKS,
	logo,
}: HeroNavigationProps) {
	return (
		<nav className="absolute top-0 left-0 w-full z-30">
			<div className="max-w-7xl mx-auto flex flex-col items-center px-4 py-4">
				{/* logo on top */}
				<div className="mb-8 mt-4">
					{logo || <span className="text-white font-bold text-lg">LOGO</span>}
				</div>
				{/* navigation links centered below */}
				<div className="flex flex-wrap justify-center space-x-6 mt-2">
					{links.map((label, idx) => (
						<Link
							key={idx}
							href="#"
							className="text-white text-sm font-medium hover:underline"
						>
							{label}
						</Link>
					))}
				</div>
			</div>
		</nav>
	);
}
