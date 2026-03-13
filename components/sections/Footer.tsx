"use client";

import { useState } from "react";
import { Instagram, Youtube, Linkedin } from "lucide-react";

interface FooterLink {
	label: string;
	href: string;
	mobileOnly?: boolean;
	type?: "button" | "link";
}

interface FooterSection {
	title: string;
	mobileOnly?: boolean;
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
			<section className="w-full pt-8 md:pt-16 pb-4 px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-100">
					<div className="flex flex-row justify-between items-center gap-6 md:gap-0">
						{/* Get Inspired */}
						<h3 className="text-white text-lg md:text-2xl font-light tracking-widest mb-0">
							Get Inspired
						</h3>

						{/* Subscribe Form */}
						<form
							onSubmit={handleSubscribe}
							className="flex flex-col sm:flex-row items-center gap-2 md:w-auto"
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
				<div className="mx-auto max-w-100">
					<div className="border-t border-[#A27C34] pt-8"></div>

					<div className="mb-4  md:hidden">
						<a
							href="/contact-us"
							className="text-white hover:text-gray-400 text-sm leading-relaxed transition-colors duration-300 titlecase border px-2 py-2 border-[#A27C34] w-[120px] text-center tracking-widest"
						>
							CONTACT US
						</a>
					</div>

					<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-6 md:gap-12 mb-8 md:mb-12">
						{sections.map((section, idx) => (
							<div
								key={idx}
								className={`${section.mobileOnly ? "md:hidden" : ""}`}
							>
								<h4 className="text-white font-bold mb-2 text-sm titlecase">
									{section.title}
								</h4>
								<ul className="space-y-1">
									{section.links.map((link, linkIdx) => (
										<li
											key={linkIdx}
											className={`${link.type === "button" ? "border px-2 py-1 border-[#A27C34] w-[100px] text-center tracking-wider" : ""}`}
										>
											<a
												href={link.href}
												className={`text-white hover:text-gray-400 text-sm leading-relaxed transition-colors duration-300 titlecase `}
											>
												{link.label}
											</a>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>

					<div className="mb-4 hidden md:flex">
						<a
							href="/contact-us"
							className="text-white hover:text-gray-400 text-sm leading-relaxed transition-colors duration-300 titlecase border px-2 py-2 border-[#A27C34] w-[120px] text-center tracking-widest"
						>
							CONTACT US
						</a>
					</div>

					{/* Divider */}
					<div className="border-t border-[#A27C34] pt-4 pb-8 grid grid-cols-1 md:grid-cols-5 gap-4">
						{/* Logo */}
						<div className="mb-0">
							<img
								src="/images/logo.png"
								alt="Takshaka Logo"
								className="h-12 md:h-16"
							/>
						</div>
						{/* Social Links */}
						<div className="flex items-center gap-3 md:gap-4 mt-0">
							<span className="text-white text-xs md:text-sm whitespace-nowrap">
								Follow us on:
							</span>
							<div className="flex gap-3 md:gap-4">
								<a
									href="https://instagram.com/takshaka"
									target="_blank"
									rel="noopener noreferrer"
									className="text-white hover:text-[#A27C34] transition-colors duration-300"
									title="Follow us on Instagram"
								>
									<Instagram size={18} />
								</a>
								<a
									href="https://youtube.com/takshaka"
									target="_blank"
									rel="noopener noreferrer"
									className="text-white hover:text-[#A27C34] transition-colors duration-300"
									title="Follow us on YouTube"
								>
									<Youtube size={18} />
								</a>
								<a
									href="https://linkedin.com/company/takshaka"
									target="_blank"
									rel="noopener noreferrer"
									className="text-white hover:text-[#A27C34] transition-colors duration-300"
									title="Follow us on LinkedIn"
								>
									<Linkedin size={18} />
								</a>
							</div>
						</div>

						{/* Copyright */}
						<p className="text-gray-400 text-xs md:text-sm col-span-3 text-end">
							{copyright || "Copyright 2026. Takshaka Event & Experience"}
						</p>
					</div>
				</div>
			</section>
		</footer>
	);
}
