import Link from "next/link";
import React from "react";

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
	return (
		<nav className="absolute top-0 left-0 w-full z-30">
			<div className="max-w-7xl mx-auto flex flex-col items-center px-4 py-4">
				{/* logo on top */}
				<a className="mb-8 mt-4" href="/">
					{logo || <span className="text-white font-bold text-lg">LOGO</span>}
				</a>
				{/* navigation links centered below */}
				<div className="flex flex-wrap justify-center space-x-6 mt-2">
					{links.map(({ label, link }, idx) => (
						<Link
							key={idx}
							href={link}
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
