"use client";

import { useState } from "react";
import Link from "next/link";
import { Instagram, Youtube, Linkedin, Facebook, Twitter } from "lucide-react";

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

interface SocialLink {
	platform: string;
	url: string;
}

interface FooterProps {
	sections: FooterSection[];
	copyright?: string;
	socialLinks?: SocialLink[];
}

export default function Footer({
	sections,
	copyright,
	socialLinks,
}: FooterProps) {
	const [email, setEmail] = useState("");

	const handleSubscribe = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle subscription logic here
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
						<Link
							href="/contact-us"
							prefetch={false}
							className="text-white hover:text-gray-400 text-sm leading-relaxed transition-colors duration-300 titlecase border px-2 py-2 border-[#A27C34] w-[120px] text-center tracking-widest"
						>
							CONTACT US
						</Link>
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
											<Link
												href={link.href}
												prefetch={false}
												className={`text-white hover:text-gray-400 text-sm leading-relaxed transition-colors duration-300 titlecase `}
											>
												{link.label}
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>

					<div className="mb-4 hidden md:flex">
						<Link
							href="/contact-us"
							prefetch={false}
							className="text-white hover:text-gray-400 text-sm leading-relaxed transition-colors duration-300 titlecase border px-2 py-2 border-[#A27C34] w-[120px] text-center tracking-widest"
						>
							CONTACT US
						</Link>
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
								{socialLinks && socialLinks.length > 0 ? (
									socialLinks.map((link) => {
										const getIcon = () => {
											const platformLower = link.platform.toLowerCase();
											switch (platformLower) {
												case "instagram":
													return <Instagram size={18} />;
												case "youtube":
													return <Youtube size={18} />;
												case "linkedin":
													return <Linkedin size={18} />;
												case "facebook":
													return <Facebook size={18} />;
												case "twitter":
													return <Twitter size={18} />;
												default:
													return null;
											}
										};

										return (
											<a
												key={link.platform}
												href={link.url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-white hover:text-[#A27C34] transition-colors duration-300"
												title={`Follow us on ${link.platform}`}
											>
												{getIcon()}
											</a>
										);
									})
								) : (
									<>
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
									</>
								)}
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
