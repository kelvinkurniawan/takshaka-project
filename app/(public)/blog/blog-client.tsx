"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ParallaxHero, Footer } from "@/components/sections";
import Link from "next/link";
import Image from "next/image";
import { trackPageView } from "@/lib/analytics-client";

interface Content {
	id: number;
	title: string;
	slug: string;
	excerpt?: string;
	featuredImage?: string;
	publishedAt?: string;
	createdAt: string;
	type?: string;
}

interface BlogClientProps {
	contents: Content[];
	footerSections: any;
}

export default function BlogClient({
	contents,
	footerSections,
}: BlogClientProps) {
	const pathname = usePathname();

	useEffect(() => {
		trackPageView(pathname, "Blog & Artikel", document.referrer);
	}, [pathname]);

	return (
		<>
			{/* Hero Section with Parallax */}
			<section className="relative w-full h-96 flex items-center justify-center overflow-hidden">
				{/* Background Image */}
				<div className="absolute inset-0 z-0">
					<img
						src="/images/contact-us-header.png"
						alt="Contact Us"
						className="w-full h-full object-cover"
					/>
					{/* Dark Overlay */}
					<div className="absolute inset-0 bg-black/50"></div>
				</div>

				{/* Header Content */}
				<div className="relative z-10 text-center">
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wider text-white">
						Articles & Insights
					</h1>
				</div>
			</section>

			{/* Articles Section */}
			<section className="py-16 md:py-24">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Articles Grid */}
					{contents.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-xl text-gray-600">No articles available</p>
						</div>
					) : (
						<div className="space-y-8">
							{contents.map((content, index) => (
								<article
									key={content.id}
									className="group flex flex-col md:flex-row gap-8 pb-8 border-b border-gray-200 last:border-b-0 hover:opacity-75 transition"
									data-aos="fade-up"
									data-aos-delay={index * 100}
									data-aos-duration="800"
								>
									{/* Featured Image */}
									{content.featuredImage && (
										<div className="flex-shrink-0 w-full md:w-72 h-48 md:h-56 rounded-sm overflow-hidden">
											<Image
												src={content.featuredImage}
												alt={content.title}
												width={400}
												height={300}
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
												unoptimized
											/>
										</div>
									)}

									{/* Content */}
									<div className="flex-1 flex flex-col justify-between">
										{/* Header */}
										<div>
											{content.type && (
												<span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs uppercase tracking-wider rounded-full mb-4 font-medium">
													{content.type}
												</span>
											)}

											<Link href={`/blog/${content.slug}`}>
												<h2 className="text-3xl md:text-4xl font-light tracking-wide uppercase mb-3 hover:text-gray-700 transition">
													{content.title}
												</h2>
											</Link>

											{content.excerpt && (
												<p className="text-gray-600 text-base leading-relaxed mb-4 line-clamp-3">
													{content.excerpt}
												</p>
											)}
										</div>

										{/* Footer */}
										<div className="flex items-center justify-between pt-4">
											<span className="text-sm text-gray-500">
												{new Date(
													content.publishedAt || content.createdAt,
												).toLocaleDateString("id-ID", {
													year: "numeric",
													month: "long",
													day: "numeric",
												})}
											</span>

											<Link
												href={`/blog/${content.slug}`}
												className="text-gray-900 font-semibold uppercase tracking-wider text-sm hover:text-gray-600 transition flex items-center gap-2"
											>
												Read More
												<span className="text-xl">→</span>
											</Link>
										</div>
									</div>
								</article>
							))}
						</div>
					)}
				</div>
			</section>
		</>
	);
}
