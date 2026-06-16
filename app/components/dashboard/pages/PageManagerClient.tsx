"use client";
import { apiFetch } from "@/lib/api-fetch";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Edit2, Trash2, Eye, Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface Page {
	id: number;
	title: string;
	slug: string;
	status: "draft" | "published";
	metaTitle: string | null;
	metaDescription: string | null;
	created_at: Date | string;
	updated_at: Date | string;
}

interface UserSession {
	id: number;
	role: string;
}

interface PageManagerClientProps {
	initialPages: Page[];
	user: UserSession;
}

export default function PageManagerClient({
	initialPages,
	user,
}: PageManagerClientProps) {
	const [pages, setPages] = useState<Page[]>(initialPages);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const router = useRouter();

	const filteredPages = useMemo(() => {
		return pages.filter((page) => {
			const matchesSearch =
				page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				page.slug.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesStatus =
				statusFilter === "all" || page.status === statusFilter;

			return matchesSearch && matchesStatus;
		});
	}, [pages, searchQuery, statusFilter]);

	const handleDelete = async (id: number) => {
		if (!confirm("Are you sure you want to delete this page?")) return;

		setLoading(true);
		setError(null);

		try {
			const response = await apiFetch(`/api/pages/${id}`, {
				method: "DELETE",
				credentials: "include",
			});

			if (response.status === 401) {
				window.location.href = "/access-denied";
				return;
			}

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to delete page");
			}

			setPages(pages.filter((page) => page.id !== id));
			setSuccess("Page deleted successfully");
			setTimeout(() => setSuccess(null), 3000);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to delete page");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-[#e5e5e5]">
						Pages
					</h1>
					<p className="text-secondary dark:text-[#929292] text-sm font-medium mt-1">
						Manage your pages with block-based builder
					</p>
				</div>

				{/* Create Button */}
				<Link href="/app/pages/create" className="btn-primary" prefetch={false}>
					+ New Page
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

				{/* Pages List */}
				<div className="space-y-4 mt-4">
					{/* Search and Filter Section */}
					<div className="flex flex-col gap-3">
						<div className="flex flex-col md:flex-row gap-3">
							{/* Search Input */}
							<div className="flex-1 relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary dark:text-[#929292]" />
								<input
									type="text"
									placeholder="Search by title or slug..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-[#e5e5e5] placeholder-secondary dark:placeholder-[#929292] focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							{/* Status Filter */}
							<select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="all">All Status</option>
								<option value="draft">Draft</option>
								<option value="published">Published</option>
							</select>
						</div>

						{/* Results Info */}
						<div className="text-sm text-secondary dark:text-[#929292]">
							Showing {filteredPages.length} of {pages.length} pages
						</div>
					</div>

					<h3 className="text-lg font-semibold text-gray-900 dark:text-[#e5e5e5]">
						List Pages
					</h3>

					{filteredPages.length === 0 ? (
						<p className="text-secondary dark:text-[#929292] text-center">
							{pages.length === 0
								? "No pages found. Please create a new page."
								: "No pages match your search or filter criteria."}
						</p>
					) : (
						<div className="card-modern">
							<div className="overflow-x-auto">
								<table className="table-modern">
									<thead>
										<tr>
											<th>Title</th>
											<th>Slug</th>
											<th>Status</th>
											<th>Created</th>
											<th className="text-right">Actions</th>
										</tr>
									</thead>
									<tbody>
										{filteredPages.map((page) => (
											<tr key={page.id}>
												<td>
													<div>
														<Link
															prefetch={false}
															href={`/app/pages/${page.id}/edit`}
															className="font-medium text-gray-900 hover:text-blue-600 dark:hover:text-blue-400 transition-colors dark:text-[#e5e5e5]"
														>
															{page.title}
														</Link>
														<p className="text-xs text-secondary mt-1">
															<code className="bg-secondary px-2 py-1 rounded text-xs text-gray-900 dark:text-white">
																{page.metaTitle || "No meta title"}
															</code>
														</p>
													</div>
												</td>
												<td>
													<code className="bg-gray-100 dark:bg-[#323232] px-2 py-1 rounded text-xs text-gray-900 dark:text-white">
														/{page.slug}
													</code>
												</td>
												<td>
													<span className={`badge badge-${page.status}`}>
														{page.status.charAt(0).toUpperCase() +
															page.status.slice(1)}
													</span>
												</td>
												<td className="text-secondary text-sm">
													{new Date(page.created_at).toLocaleDateString(
														"id-ID",
													)}
												</td>
												<td className="text-right">
													<div className="flex items-center justify-end gap-1">
														<a
															href={`/${page.slug}`}
															target="_blank"
															rel="noopener noreferrer"
															className="btn-icon btn-icon-primary"
															title="View"
														>
															<Eye className="w-4 h-4" />
														</a>
														<Link
															prefetch={false}
															href={`/app/pages/${page.id}/edit`}
															className="btn-icon btn-icon-primary"
															title="Edit"
														>
															<Edit2 className="w-4 h-4" />
														</Link>
														{user.role === "admin" && (
															<button
																onClick={() => handleDelete(page.id)}
																disabled={loading}
																className="btn-icon btn-icon-danger"
																title="Delete"
															>
																<Trash2 className="w-4 h-4" />
															</button>
														)}
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
