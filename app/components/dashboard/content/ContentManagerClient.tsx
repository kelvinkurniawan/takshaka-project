"use client";
import { apiFetch } from "@/lib/api-fetch";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Edit2, Trash2, Search, Eye, Clock, History } from "lucide-react";

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
	publishedAt?: Date | null;
	scheduledAt?: Date | null;
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
	const [dateFrom, setDateFrom] = useState("");
	const [dateTo, setDateTo] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [showAuditModal, setShowAuditModal] = useState<number | null>(null);

	useEffect(() => {
		const fetchCommentCounts = async () => {
			try {
				const contentIds = contents.map((c) => c.id);
				const response = await apiFetch(
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

			// Category filter
			const matchesCategory =
				categoryFilter === "all" ||
				content.categoryId === parseInt(categoryFilter);

			// Date range filter
			let matchesDateRange = true;
			if (dateFrom || dateTo) {
				const createdDate = new Date(content.createdAt);
				if (dateFrom) {
					matchesDateRange = createdDate >= new Date(dateFrom);
				}
				if (dateTo) {
					const toDate = new Date(dateTo);
					toDate.setDate(toDate.getDate() + 1);
					matchesDateRange = matchesDateRange && createdDate <= toDate;
				}
			}

			return (
				matchesSearch &&
				matchesStatus &&
				matchesType &&
				matchesCategory &&
				matchesDateRange
			);
		});
	}, [
		contents,
		searchQuery,
		statusFilter,
		typeFilter,
		categoryFilter,
		dateFrom,
		dateTo,
	]);

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
			const response = await apiFetch(`/api/contents/${id}`, { method: "DELETE" });

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
				<Link
					href="/app/content/create"
					className="btn-primary"
					prefetch={false}
				>
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
						{/* Search Bar */}
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

						{/* Filter Row 1 */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-900 dark:text-[#e5e5e5] mb-2">
									Status
								</label>
								<select
									value={statusFilter}
									onChange={(e) => setStatusFilter(e.target.value)}
									className="w-full px-4 py-2 border border-gray-300 dark:border-[#424242] rounded-lg bg-white dark:bg-[#222222] text-gray-900 dark:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									<option value="all">All Status</option>
									<option value="draft">Draft</option>
									<option value="published">Published</option>
									<option value="scheduled">Scheduled</option>
									<option value="archived">Archived</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-900 dark:text-[#e5e5e5] mb-2">
									Type
								</label>
								<select
									value={typeFilter}
									onChange={(e) => setTypeFilter(e.target.value)}
									className="w-full px-4 py-2 border border-gray-300 dark:border-[#424242] rounded-lg bg-white dark:bg-[#222222] text-gray-900 dark:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									<option value="all">All Types</option>
									{[...new Set(contents.map((c) => c.type))]
										.sort()
										.map((type) => (
											<option key={type} value={type}>
												{type.charAt(0).toUpperCase() + type.slice(1)}
											</option>
										))}
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-900 dark:text-[#e5e5e5] mb-2">
									Category
								</label>
								<select
									value={categoryFilter}
									onChange={(e) => setCategoryFilter(e.target.value)}
									className="w-full px-4 py-2 border border-gray-300 dark:border-[#424242] rounded-lg bg-white dark:bg-[#222222] text-gray-900 dark:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									<option value="all">All Categories</option>
									{initialCategories.map((cat) => (
										<option key={cat.id} value={cat.id}>
											{cat.name}
										</option>
									))}
								</select>
							</div>
						</div>

						{/* Filter Row 2 - Date Range */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-900 dark:text-[#e5e5e5] mb-2">
									Date From
								</label>
								<input
									type="date"
									value={dateFrom}
									onChange={(e) => setDateFrom(e.target.value)}
									className="w-full px-4 py-2 border border-gray-300 dark:border-[#424242] rounded-lg bg-white dark:bg-[#222222] text-gray-900 dark:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-900 dark:text-[#e5e5e5] mb-2">
									Date To
								</label>
								<input
									type="date"
									value={dateTo}
									onChange={(e) => setDateTo(e.target.value)}
									className="w-full px-4 py-2 border border-gray-300 dark:border-[#424242] rounded-lg bg-white dark:bg-[#222222] text-gray-900 dark:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
						</div>

						{/* Reset Filters Button */}
						{(searchQuery ||
							statusFilter !== "all" ||
							typeFilter !== "all" ||
							categoryFilter !== "all" ||
							dateFrom ||
							dateTo) && (
							<div>
								<button
									onClick={() => {
										setSearchQuery("");
										setStatusFilter("all");
										setTypeFilter("all");
										setCategoryFilter("all");
										setDateFrom("");
										setDateTo("");
									}}
									className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
								>
									Reset Filters
								</button>
							</div>
						)}

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
											<th>Scheduled</th>
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
															prefetch={false}
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
												<td className="text-secondary text-sm">
													{content.scheduledAt ? (
														<div className="flex items-center gap-1">
															<Clock className="w-4 h-4" />
															{new Date(content.scheduledAt).toLocaleDateString(
																"id-ID",
															)}
														</div>
													) : (
														<span className="text-gray-400">-</span>
													)}
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
															prefetch={false}
														>
															<Edit2 className="w-4 h-4" />
														</Link>
														<button
															onClick={() => setShowAuditModal(content.id)}
															className="btn-icon btn-icon-info"
															title="Audit Logs"
														>
															<History className="w-4 h-4" />
														</button>
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

				{/* Audit Logs Modal */}
				{showAuditModal && (
					<AuditLogsModal
						contentId={showAuditModal}
						onClose={() => setShowAuditModal(null)}
					/>
				)}
			</div>
		</div>
	);
}

// Audit Logs Modal Component
function AuditLogsModal({
	contentId,
	onClose,
}: {
	contentId: number;
	onClose: () => void;
}) {
	const [logs, setLogs] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchLogs = async () => {
			try {
				const response = await apiFetch(
					`/api/audit-logs?entityType=contents&entityId=${contentId}`,
				);
				if (!response.ok) throw new Error("Failed to fetch logs");
				const data = await response.json();
				setLogs(data.data || []);
			} catch (err) {
				setError(err instanceof Error ? err.message : "An error occurred");
			} finally {
				setLoading(false);
			}
		};

		fetchLogs();
	}, [contentId]);

	return (
		<div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
			<div className="bg-white dark:bg-[#2a2a2a] rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
				<div className="sticky top-0 bg-white dark:bg-[#2a2a2a] border-b border-gray-200 dark:border-[#424242] p-6 flex justify-between items-center">
					<h2 className="text-xl font-bold text-gray-900 dark:text-[#e5e5e5]">
						Audit Logs - Content #{contentId}
					</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700 dark:text-[#929292] dark:hover:text-[#e5e5e5]"
					>
						✕
					</button>
				</div>

				<div className="p-6">
					{loading ? (
						<p className="text-center text-secondary">Loading...</p>
					) : error ? (
						<p className="text-center text-red-600 dark:text-red-400">
							{error}
						</p>
					) : logs.length === 0 ? (
						<p className="text-center text-secondary">No audit logs found</p>
					) : (
						<div className="space-y-4">
							{logs.map((log) => (
								<div
									key={log.id}
									className="border border-gray-200 dark:border-[#424242] rounded-lg p-4"
								>
									<div className="flex justify-between items-start mb-2">
										<div>
											<p className="font-semibold text-gray-900 dark:text-[#e5e5e5]">
												{log.action.toUpperCase()} - {log.entityType}
											</p>
											<p className="text-sm text-secondary">
												by {log.user?.name || "System"} ({log.user?.email})
											</p>
										</div>
										<p className="text-xs text-secondary">
											{new Date(log.createdAt).toLocaleString("id-ID")}
										</p>
									</div>

									{log.changes && Object.keys(log.changes).length > 0 && (
										<div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-sm mt-2">
											<p className="font-medium text-blue-900 dark:text-blue-200 mb-1">
												Changes:
											</p>
											{Object.entries(log.changes).map(([key, change]: any) => (
												<p
													key={key}
													className="text-blue-800 dark:text-blue-300"
												>
													<strong>{key}</strong>: {change.from} → {change.to}
												</p>
											))}
										</div>
									)}

									{log.metadata && (
										<div className="text-xs text-secondary mt-2 space-y-1">
											{log.metadata.ip && <p>IP: {log.metadata.ip}</p>}
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
