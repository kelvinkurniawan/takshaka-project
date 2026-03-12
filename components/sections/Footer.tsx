"use client";

import { useState } from "react";

interface FooterLink {
	label: string;
	href: string;
}

interface FooterSection {
	title: string;
	links: FooterLink[];
}

interface FooterProps {
	sections: FooterSection[];
	copyright?: string;
}

export default function Footer({ sections, copyright }: FooterProps) {
	const [email, setEmail] = useState("");

	const handleSubscribe = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle subscription logic here
		console.log("Subscribe with email:", email);
		setEmail("");
	};

	return (
		<footer className="w-full" style={{ backgroundColor: "#1a1f3a" }}>
			{/* Subscribe Section */}
			<section className="w-full py-8 md:py-16 px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-7xl">
					<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 md:gap-0">
						{/* Get Inspired */}
						<h3 className="text-white text-lg md:text-2xl font-light tracking-widest mb-0">
							Get Inspired
						</h3>

						{/* Subscribe Form */}
						<form
							onSubmit={handleSubscribe}
							className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto"
						>
							<button
								type="submit"
								className="px-6 py-2 text-white font-semibold text-sm tracking-wider bg-[#A27C34] hover:text-amber-600 transition-colors"
							>
								SUBSCRIBE
							</button>
						</form>
					</div>
				</div>
			</section>

			{/* Footer Links Section */}
			<section
				className="w-full px-4 sm:px-6 lg:px-8"
				style={{ backgroundColor: "#1a1f3a" }}
			>
				<div className="mx-auto max-w-7xl">
					<div className="border-t border-[#A27C34] py-8"></div>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 md:gap-12 mb-8 md:mb-12">
						{sections.map((section, idx) => (
							<div key={idx}>
								<h4 className="text-white font-semibold tracking-wider mb-3 md:mb-4 text-xs uppercase">
									{section.title}
								</h4>
								<ul className="space-y-2 md:space-y-3">
									{section.links.map((link, linkIdx) => (
										<li key={linkIdx}>
											<a
												href={link.href}
												className="text-gray-400 hover:text-white text-sm leading-relaxed transition-colors"
											>
												{link.label}
											</a>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>

					{/* Divider */}
					<div className="border-t border-[#A27C34] pt-6 md:pt-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
						{/* Logo */}
						<div className="mb-0">
							<img
								src="/images/logo.png"
								alt="Takshaka Logo"
								className="h-12 md:h-16"
							/>
						</div>

						{/* Copyright */}
						<p className="text-gray-400 text-xs md:text-sm">
							{copyright || "Copyright 2026. Takshaka Event & Experience"}
						</p>

						{/* Social Links */}
						<div className="flex gap-4 mt-0">
							<span className="text-gray-400 text-xs md:text-sm">
								Follow us on:
							</span>
						</div>
					</div>
				</div>
			</section>
		</footer>
	);
}
