"use client";

import Link from "next/link";
import Image from "next/image";

interface EditorPicksItem {
	title: string;
	excerpt?: string;
	image?: string;
	link?: string;
	date?: string;
	category?: string;
}

interface EditorPicksSectionProps {
	items?: EditorPicksItem[];
	articles?: any[]; // Support legacy prop
	title?: string;
	description?: string;
}

export default function EditorPicksSection({
	items,
	articles,
	title = "EDITOR PICKS",
	description = "Pilihan terbaik kami untuk petualangan sempurna Anda",
}: EditorPicksSectionProps) {
	const displayItems = items || articles || [];
	if (displayItems.length === 0) {
		return null;
	}

	return (
		<section className="py-16 md:py-24 bg-gradient-to-b from-[#fff8f5] to-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Title */}
				<div className="text-center mb-16" data-aos="fade-up">
					<h2 className="text-3xl md:text-4xl font-light tracking-wider uppercase">
						{title}
					</h2>
				</div>

				{/* Featured Items Grid - Horizontal Layout */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
					{displayItems.map((item: any, index: number) => {
						const link = item.link || item.slug ? `/blog/${item.slug}` : "#";
						const image = item.image || item.featuredImage;
						const category = item.category || item.type;

						return (
							<Link
								key={index}
								href={link}
								prefetch={false}
								data-aos="fade-up"
								data-aos-delay={index * 100}
								data-aos-duration="800"
							>
								<article className="group cursor-pointer flex flex-col md:flex-row gap-4 md:gap-3">
									{/* Image Thumbnail */}
									<div className="flex-shrink-0 w-full md:w-32 h-32 md:h-28 rounded-sm overflow-hidden bg-gray-200">
										{image ? (
											<Image
												src={image}
												alt={item.title}
												width={150}
												height={120}
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
												unoptimized
											/>
										) : (
											<div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
												<span className="text-xs text-gray-600">No Image</span>
											</div>
										)}
									</div>

									{/* Content */}
									<div className="flex-1">
										{/* Category Tag */}
										{category && (
											<span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs uppercase tracking-widest font-medium rounded mb-2">
												{category}
											</span>
										)}

										{/* Title */}
										<h3 className="text-base md:text-sm font-light tracking-wider uppercase leading-tight mb-2 group-hover:text-gray-700 transition line-clamp-2">
											{item.title}
										</h3>

										{/* Description */}
										{item.excerpt && (
											<p className="text-xs md:text-xs text-gray-600 leading-relaxed line-clamp-2">
												{item.excerpt}
											</p>
										)}
									</div>
								</article>
							</Link>
						);
					})}
				</div>
			</div>
		</section>
	);
}
