"use client";

import Link from "next/link";
import { useState } from "react";

interface NavigationItem {
	id: number;
	label: string;
	url: string;
	parentId: number | null;
	order: number;
	icon: string | null;
	target: string;
	isActive: boolean;
	children?: NavigationItem[];
}

interface NavigationMenuProps {
	items: NavigationItem[];
}

export default function NavigationMenu({ items }: NavigationMenuProps) {
	return (
		<section className="py-24 bg-white/95 backdrop-blur-sm relative border-t border-slate-200">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Navigation Grid - 5 columns for large screens */}
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-4">
					{items
						.filter((item) => item.isActive && !item.parentId)
						.sort((a, b) => a.order - b.order)
						.map((item) => {
							return (
								<Link
									key={item.id}
									href={item.url}
									target={item.target}
									prefetch={false}
									className="group relative p-6 text-center hover:transform hover:scale-105 transition-all duration-300"
								>
									{/* Icon if available */}
									{item.icon && (
										<div className="mb-4 text-4xl text-slate-700 group-hover:text-primary transition-colors duration-300">
											{item.icon}
										</div>
									)}

									{/* Content - display label as-is (uppercase) */}
									<h3 className="text-sm lg:text-base font-semibold text-slate-900 tracking-wider group-hover:text-primary transition-colors duration-300 leading-relaxed">
										{item.label}
									</h3>

									{/* Underline effect */}
									<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-0 bg-gradient-to-r from-transparent via-slate-900 to-transparent group-hover:w-full transition-all duration-300"></div>
								</Link>
							);
						})}
				</div>

				{/* Submenu items if exist */}
				{items.some((item) => item.parentId) && (
					<div className="mt-16 pt-12 border-t border-slate-200">
						<div className="flex flex-wrap justify-center gap-3">
							{items
								.filter((item) => item.parentId && item.isActive)
								.sort((a, b) => a.order - b.order)
								.map((item) => (
									<Link
										key={item.id}
										href={item.url}
										target={item.target}
										prefetch={false}
										className="px-5 py-2 bg-slate-100 text-slate-900 rounded-full text-xs font-semibold hover:bg-slate-900 hover:text-white transition duration-300"
									>
										{item.label}
									</Link>
								))}
						</div>
					</div>
				)}
			</div>
		</section>
	);
}
