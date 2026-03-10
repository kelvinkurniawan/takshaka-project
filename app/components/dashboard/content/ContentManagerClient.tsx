"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Edit2, Trash2, Search, Eye } from "lucide-react";

interface Content {
	id: number;
	title: string;
	slug: string;
	content: string;
	type: string;
	status?: string;
	categoryId: number | null;
	createdBy: number;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;
	featuredImage: string | null;
	metaTitle: string | null;
	metaDescription: string | null;
	metaKeywords: string | null;
	ogTitle: string | null;
	ogDescription: string | null;
	ogImage: string | null;
	category?: { id: number; name: string } | null;
	creator?: { id: number; name: string };
}

interface Category {
	id: number;
	name: string;
	slug: string;
	description: string | null;
}

interface User {
	id: number;
	name: string;
	email: string;
}

interface ContentManagerClientProps {
	initialContents: Content[];
	initialCategories: Category[];
	initialUsers: User[];
}

export default function ContentManagerClient({
	initialContents,
	initialCategories,
	initialUsers,
}: ContentManagerClientProps) {
	const [contents, setContents] = useState<Content[]>(initialContents);
	const [commentCounts, setCommentCounts] = useState<Map<number, number>>(
		new Map(),
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [typeFilter, setTypeFilter] = useState("all");

	useEffect(() => {
		const fetchCommentCounts = async () => {
			try {
				const contentIds = contents.map((c) => c.id);
				const response = await fetch(
					`/api/comments/count?contentIds=${contentIds.join(",")}`,
				);
				if (response.ok) {
					const data = await response.json();
					setCommentCounts(
						new Map(
							Object.entries(data).map(([k, v]) => [parseInt(k), v as number]),
						),
					);
				}
			} catch (err) {
				console.error("Failed to fetch comment counts:", err);
			}
		};

		if (contents.length > 0) {
			fetchCommentCounts();
		}
	}, [contents]);

	// Filter contents based on search query and filters
	const filteredContents = useMemo(() => {
		return contents.filter((content) => {
			// Search filter
			const matchesSearch =
				searchQuery === "" ||
				content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				content.slug.toLowerCase().includes(searchQuery.toLowerCase());

			// Status filter
			const matchesStatus =
				statusFilter === "all" || content.status === statusFilter;

			// Type filter
			const matchesType = typeFilter === "all" || content.type === typeFilter;

			return matchesSearch && matchesStatus && matchesType;
		});
	}, [contents, searchQuery, statusFilter, typeFilter]);

	// Get unique types for filter dropdown
	const uniqueTypes = useMemo(() => {
		const types = new Set(contents.map((c) => c.type));
		return Array.from(types).sort();
	}, [contents]);

	const handleDelete = async (id: number) => {
		if (!confirm("Are you sure you want to delete this content?")) return;

		setLoading(true);
		setError(null);

		try {
			const response = await fetch(`/api/contents/${id}`, { method: "DELETE" });

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to delete content");
			}

			setContents(contents.filter((c) => c.id !== id));
			setSuccess("Content deleted successfully");
			setTimeout(() => setSuccess(null), 3000);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-[#e5e5e5]">
						Articles
					</h1>
					<p className="text-secondary text-sm font-medium mt-1">
						Manage your content articles here
					</p>
				</div>

				{/* Create Button */}
				<Link href="/app/content/create" className="btn-primary">
					+ New Content
				</Link>
			</div>
			<div className="space-y-6">
				{/* Success Message */}
				{success && (
					<div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-800 dark:text-green-200 px-4 py-3 rounded">
						{success}
					</div>
				)}

				{/* Error Message */}
				{error && (
					<div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded">
						{error}
					</div>
				)}

				{/* Contents List */}
				<div className="space-y-4 mt-4">
					<div className="flex flex-col gap-4">
						<div className="flex flex-col md:flex-row items-start md:items-end gap-4">
							<div className="flex-1">
								<label className="block text-sm font-medium text-gray-900 dark:text-[#e5e5e5] mb-2">
									Search Content
								</label>
								<div className="relative">
									<Search className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-600" />
									<input
										type="text"
										placeholder="Search by title or slug..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-[#424242] rounded-lg bg-white dark:bg-[#222222] text-gray-900 dark:text-[#e5e5e5] placeholder-gray-500 dark:placeholder-[#828282] focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>
							</div>

							<div className="w-full md:w-48">
								<label className="block text-sm font-medium text-gray-900 dark:text-[#e5e5e5] mb-2">
									Filter by Status
								</label>
								<select
									value={statusFilter}
									onChange={(e) => setStatusFilter(e.target.value)}
									className="w-full px-4 py-2 border border-gray-300 dark:border-[#424242] rounded-lg bg-white dark:bg-[#222222] text-gray-900 dark:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									<option value="all">All Status</option>
									<option value="draft">Draft</option>
									<option value="published">Published</option>
								</select>
							</div>

							<div className="w-full md:w-48">
								<label className="block text-sm font-medium text-gray-900 dark:text-[#e5e5e5] mb-2">
									Filter by Type
								</label>
								<select
									value={typeFilter}
									onChange={(e) => setTypeFilter(e.target.value)}
									className="w-full px-4 py-2 border border-gray-300 dark:border-[#424242] rounded-lg bg-white dark:bg-[#222222] text-gray-900 dark:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									<option value="all">All Types</option>
									{uniqueTypes.map((type) => (
										<option key={type} value={type}>
											{type.charAt(0).toUpperCase() + type.slice(1)}
										</option>
									))}
								</select>
							</div>
						</div>

						{/* Results info */}
						<div className="text-sm text-secondary dark:text-[#929292]">
							Showing {filteredContents.length} of {contents.length} content
							{searchQuery && ` (search: "${searchQuery}")`}
						</div>
					</div>

					<h3 className="text-lg font-semibold text-gray-900 dark:text-[#e5e5e5]">
						List Content ({filteredContents.length})
					</h3>

					{filteredContents.length === 0 ? (
						<p className="text-secondary dark:text-[#929292] text-center py-8">
							{searchQuery || statusFilter !== "all" || typeFilter !== "all"
								? "No contents found matching your filters."
								: "No contents found. Please create a new content."}
						</p>
					) : (
						<div className="card-modern">
							<div className="overflow-x-auto">
								<table className="table-modern">
									<thead>
										<tr>
											<th>Title</th>
											<th>Status</th>
											<th>Category</th>
											<th>Type</th>
											<th>Created By</th>
											<th>Created</th>
											<th className="text-center">Comments</th>
											<th className="text-right">Actions</th>
										</tr>
									</thead>
									<tbody>
										{filteredContents.map((content) => (
											<tr key={content.id}>
												<td>
													<div>
														<Link
															href={`/app/content/${content.id}/edit`}
															className="font-medium text-gray-900 dark:text-[#e5e5e5] hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
														>
															{content.title}
														</Link>
														<p className="text-xs text-secondary mt-1">
															<code className="bg-secondary px-2 py-1 rounded text-xs text-gray-900 dark:text-[#e5e5e5]">
																{content.slug}
															</code>
														</p>
													</div>
												</td>
												<td>
													{content.status ? (
														<span
															className={
																content.status === "published"
																	? "badge badge-success"
																	: "badge badge-warning"
															}
														>
															{content.status.charAt(0).toUpperCase() +
																content.status.slice(1)}
														</span>
													) : (
														<span className="badge badge-gray">Unknown</span>
													)}
												</td>
												<td>
													{content.category ? (
														<span className="badge badge-primary">
															{content.category.name}
														</span>
													) : (
														<span className="text-secondary">-</span>
													)}
												</td>
												<td className="capitalize text-secondary">
													{content.type}
												</td>
												<td className="text-secondary">
													{content.creator?.name || "Unknown"}
												</td>
												<td className="text-secondary text-sm">
													{new Date(content.createdAt).toLocaleDateString(
														"id-ID",
													)}
												</td>
												<td className="text-center">
													<span className="badge badge-primary">
														{commentCounts.get(content.id) || 0}
													</span>
												</td>
												<td className="text-right">
													<div className="flex items-center justify-end gap-1">
														<a
															href={`/blog/${content.slug}`}
															target="_blank"
															rel="noopener noreferrer"
															className="btn-icon btn-icon-primary"
															title="View"
														>
															<Eye className="w-4 h-4" />
														</a>
														<Link
															href={`/app/content/${content.id}/edit`}
															className="btn-icon btn-icon-primary"
															title="Edit"
														>
															<Edit2 className="w-4 h-4" />
														</Link>
														<button
															onClick={() => handleDelete(content.id)}
															disabled={loading}
															className="btn-icon btn-icon-danger"
															title="Delete"
														>
															<Trash2 className="w-4 h-4" />
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
