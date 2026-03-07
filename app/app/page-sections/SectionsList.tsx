"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Search, AlertCircle, Loader, ArrowRight } from "lucide-react";

interface PageSection {
	id: number;
	pageName: string;
	pageSlug: string;
	pageData: string;
	created_by: number;
	created_at: string;
	updated_at: string;
}

export default function SectionsList() {
	const [sections, setSections] = useState<PageSection[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredSections = useMemo(() => {
		return sections.filter(
			(section) =>
				section.pageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
				section.pageSlug.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [sections, searchQuery]);

	useEffect(() => {
		fetchSections();
	}, []);

	const fetchSections = async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/page-sections");

			if (!response.ok) {
				throw new Error("Failed to fetch sections");
			}

			const data = await response.json();
			setSections(data);
			setError(null);
		} catch (err) {
			console.error("Error fetching sections:", err);
			setError("Failed to load page sections. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-96">
				<Loader className="animate-spin text-blue-500" size={40} />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Search Bar */}
			<div className="relative">
				<Search
					className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#828282]"
					size={20}
				/>
				<input
					type="text"
					placeholder="Search page sections by name or slug..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 dark:border-[#525252] rounded-lg bg-white dark:bg-[#222222] text-gray-900 dark:text-[#e5e5e5] placeholder-gray-400 dark:placeholder-[#828282] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
				/>
			</div>

			{/* Error Alert */}
			{error && (
				<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
					<AlertCircle
						className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
						size={20}
					/>
					<div>
						<p className="text-red-900 dark:text-red-200 font-semibold text-sm">
							Error
						</p>
						<p className="text-red-800 dark:text-red-300 text-sm mt-1">
							{error}
						</p>
					</div>
				</div>
			)}

			{/* Empty State */}
			{sections.length === 0 ? (
				<div className="bg-gray-50 dark:bg-[#222222] rounded-lg p-12 text-center">
					<p className="text-gray-600 dark:text-[#929292] font-medium mb-1">
						No page sections found
					</p>
					<p className="text-gray-500 dark:text-[#828282] text-sm">
						Create your first page section to get started
					</p>
				</div>
			) : filteredSections.length === 0 ? (
				<div className="bg-gray-50 dark:bg-[#222222] rounded-lg p-12 text-center">
					<p className="text-gray-600 dark:text-[#929292] font-medium mb-1">
						No sections match your search
					</p>
					<p className="text-gray-500 dark:text-[#828282] text-sm">
						Try adjusting your search query
					</p>
				</div>
			) : (
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{filteredSections.map((section) => {
						const dateParts = new Date(section.updated_at).toLocaleDateString(
							"id-ID",
							{
								year: "numeric",
								month: "short",
								day: "numeric",
							},
						);

						return (
							<Link
								key={section.id}
								href={`/app/page-sections/${section.id}`}
								className="group relative bg-white dark:bg-[#323232] border border-gray-200 dark:border-[#424242] rounded-lg overflow-hidden hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg dark:hover:shadow-blue-900/30 transition-all duration-200 h-full flex flex-col"
							>
								{/* Background gradient on hover */}
								<div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

								{/* Content */}
								<div className="relative p-4 h-full flex flex-col justify-between">
									<div className="space-y-3">
										<h3 className="font-semibold text-sm text-gray-900 dark:text-[#e5e5e5] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
											{section.pageName}
										</h3>
										<div className="space-y-2">
											<div className="flex items-start gap-2">
												<span className="text-xs font-medium text-gray-600 dark:text-[#929292] whitespace-nowrap">
													Slug:
												</span>
												<code className="text-xs bg-gray-100 dark:bg-[#222222] px-2 py-1 rounded text-gray-700 dark:text-[#a0a0a0] break-all">
													{section.pageSlug}
												</code>
											</div>
										</div>
									</div>

									<div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-[#424242]">
										<p className="text-xs text-gray-500 dark:text-[#828282]">
											{dateParts}
										</p>
										<ArrowRight className="w-4 h-4 text-gray-400 dark:text-[#828282] group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
									</div>
								</div>
							</Link>
						);
					})}
				</div>
			)}

			{/* Results Count */}
			{filteredSections.length > 0 && (
				<div className="text-center text-sm text-gray-600 dark:text-[#929292]">
					Showing {filteredSections.length} of {sections.length} sections
				</div>
			)}
		</div>
	);
}
