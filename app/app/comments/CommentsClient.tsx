"use client";

import { useState, useEffect } from "react";
import { Loader2, Check, X, Trash2, Eye } from "lucide-react";

interface Comment {
	id: number;
	contentId: number;
	name: string;
	email: string;
	content: string;
	status: string;
	isSpam: boolean;
	createdAt: string;
	updatedAt: string;
}

interface Content {
	id: number;
	title: string;
	slug: string;
}

interface PaginationInfo {
	total: number;
	limit: number;
	offset: number;
}

type StatusFilter = "all" | "pending" | "approved" | "rejected";
type SpamFilter = "all" | "spam" | "legitimate";

export default function CommentsClient() {
	const [comments, setComments] = useState<Comment[]>([]);
	const [loading, setLoading] = useState(true);
	const [actionLoading, setActionLoading] = useState<number | null>(null);
	const [pagination, setPagination] = useState<PaginationInfo>({
		total: 0,
		limit: 20,
		offset: 0,
	});
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
	const [spamFilter, setSpamFilter] = useState<SpamFilter>("all");
	const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
	const [selectedContent, setSelectedContent] = useState<Content | null>(null);
	const [showDetailModal, setShowDetailModal] = useState(false);
	const [contentLoading, setContentLoading] = useState(false);

	const fetchComments = async (offset: number = 0) => {
		try {
			setLoading(true);
			const response = await fetch(
				`/api/admin/comments?limit=${pagination.limit}&offset=${offset}&status=${statusFilter}&spam=${spamFilter}`,
			);
			const data = await response.json();
			setComments(data.data || []);
			setPagination(data);
		} catch (error) {
			console.error("Failed to fetch comments:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchComments(0);
	}, [statusFilter, spamFilter]);

	const fetchContentDetails = async (contentId: number) => {
		try {
			setContentLoading(true);
			const response = await fetch(`/api/contents/${contentId}`);
			if (response.ok) {
				const data = await response.json();
				setSelectedContent(data);
			} else {
				setSelectedContent(null);
			}
		} catch (error) {
			console.error("Failed to fetch content details:", error);
			setSelectedContent(null);
		} finally {
			setContentLoading(false);
		}
	};

	const handleApprove = async (commentId: number) => {
		try {
			setActionLoading(commentId);
			const response = await fetch(`/api/admin/comments/${commentId}/approve`, {
				method: "POST",
			});

			if (response.ok) {
				setComments(
					comments.map((c) =>
						c.id === commentId ? { ...c, status: "approved" } : c,
					),
				);
			}
		} catch (error) {
			console.error("Failed to approve comment:", error);
		} finally {
			setActionLoading(null);
		}
	};

	const handleReject = async (commentId: number) => {
		try {
			setActionLoading(commentId);
			const response = await fetch(`/api/admin/comments/${commentId}/reject`, {
				method: "POST",
			});

			if (response.ok) {
				setComments(
					comments.map((c) =>
						c.id === commentId ? { ...c, status: "rejected" } : c,
					),
				);
			}
		} catch (error) {
			console.error("Failed to reject comment:", error);
		} finally {
			setActionLoading(null);
		}
	};

	const handleDelete = async (commentId: number) => {
		if (!confirm("Apakah Anda yakin ingin menghapus komentar ini?")) return;

		try {
			setActionLoading(commentId);
			const response = await fetch(`/api/admin/comments/${commentId}`, {
				method: "DELETE",
			});

			if (response.ok) {
				setComments(comments.filter((c) => c.id !== commentId));
			}
		} catch (error) {
			console.error("Failed to delete comment:", error);
		} finally {
			setActionLoading(null);
		}
	};

	const getStatusBadgeClass = (status: string) => {
		switch (status) {
			case "approved":
				return "badge-success";
			case "rejected":
				return "badge-danger";
			case "pending":
				return "badge-warning";
			default:
				return "badge-gray";
		}
	};

	const getStatusLabel = (status: string) => {
		switch (status) {
			case "approved":
				return "Disetujui";
			case "rejected":
				return "Ditolak";
			case "pending":
				return "Menunggu";
			default:
				return status;
		}
	};

	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString("id-ID", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const hasNextPage = pagination.offset + pagination.limit < pagination.total;
	const hasPrevPage = pagination.offset > 0;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
					Manajemen Komentar
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Total {pagination.total} komentar
				</p>
			</div>

			{/* Filters */}
			<div className="bg-white dark:bg-[#1e1e1e] rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Status Filter */}
					<div className="form-group">
						<label className="form-label">Status</label>
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
							className="form-input"
						>
							<option value="all">Semua Status</option>
							<option value="pending">Menunggu Persetujuan</option>
							<option value="approved">Disetujui</option>
							<option value="rejected">Ditolak</option>
						</select>
					</div>

					{/* Spam Filter */}
					<div className="form-group">
						<label className="form-label">Filter Spam</label>
						<select
							value={spamFilter}
							onChange={(e) => setSpamFilter(e.target.value as SpamFilter)}
							className="form-input"
						>
							<option value="all">Semua Komentar</option>
							<option value="spam">Terdeteksi Spam</option>
							<option value="legitimate">Komentar Sah</option>
						</select>
					</div>
				</div>
			</div>

			{/* Comments Table */}
			{loading ? (
				<div className="flex justify-center py-12">
					<div className="text-center">
						<div className="animate-spin mb-4">
							<Loader2 className="w-8 h-8 text-blue-600" />
						</div>
						<p className="text-gray-600 dark:text-gray-400">
							Memuat komentar...
						</p>
					</div>
				</div>
			) : comments.length === 0 ? (
				<div className="bg-white dark:bg-[#1e1e1e] rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
					<p className="text-gray-600 dark:text-gray-400">
						Tidak ada komentar yang sesuai dengan filter.
					</p>
				</div>
			) : (
				<div className="comments-table-wrapper">
					<table className="table-modern">
						<thead>
							<tr>
								<th>Nama</th>
								<th>Email</th>
								<th>Status</th>
								<th>Spam</th>
								<th>Waktu</th>
								<th className="text-right">Aksi</th>
							</tr>
						</thead>
						<tbody>
							{comments.map((comment) => (
								<tr key={comment.id}>
									<td className="font-medium text-gray-900 dark:text-white">
										{comment.name}
									</td>
									<td className="text-gray-700 dark:text-gray-300 text-xs">
										{comment.email}
									</td>
									<td>
										<span
											className={`badge ${getStatusBadgeClass(comment.status)}`}
										>
											{getStatusLabel(comment.status)}
										</span>
									</td>
									<td>
										{comment.isSpam ? (
											<span className="badge badge-spam">⚠️ Spam</span>
										) : (
											<span className="badge badge-success">✓ Valid</span>
										)}
									</td>
									<td className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
										{new Date(comment.createdAt).toLocaleDateString("id-ID", {
											year: "numeric",
											month: "short",
											day: "numeric",
											hour: "2-digit",
											minute: "2-digit",
										})}
									</td>
									<td className="flex justify-end">
										<div className="comments-table-actions">
											<button
												onClick={() => {
													setSelectedComment(comment);
													setShowDetailModal(true);
													fetchContentDetails(comment.contentId);
												}}
												className="btn btn-icon btn-icon-primary"
												title="Lihat detail"
											>
												<Eye className="w-4 h-4" />
											</button>

											{comment.status !== "approved" && (
												<button
													onClick={() => handleApprove(comment.id)}
													disabled={actionLoading === comment.id}
													className="btn btn-icon btn-icon-primary"
													title="Setujui komentar"
												>
													{actionLoading === comment.id ? (
														<Loader2 className="w-4 h-4 animate-spin" />
													) : (
														<Check className="w-4 h-4" />
													)}
												</button>
											)}

											{comment.status !== "rejected" && (
												<button
													onClick={() => handleReject(comment.id)}
													disabled={actionLoading === comment.id}
													className="btn btn-icon btn-icon-danger"
													title="Tolak komentar"
												>
													{actionLoading === comment.id ? (
														<Loader2 className="w-4 h-4 animate-spin" />
													) : (
														<X className="w-4 h-4" />
													)}
												</button>
											)}

											<button
												onClick={() => handleDelete(comment.id)}
												disabled={actionLoading === comment.id}
												className="btn btn-icon btn-icon-danger"
												title="Hapus komentar"
											>
												{actionLoading === comment.id ? (
													<Loader2 className="w-4 h-4 animate-spin" />
												) : (
													<Trash2 className="w-4 h-4" />
												)}
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{/* Pagination */}
			{(hasNextPage || hasPrevPage) && (
				<div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
					<button
						onClick={() => fetchComments(pagination.offset - pagination.limit)}
						disabled={!hasPrevPage}
						className="btn btn-solid"
					>
						← Sebelumnya
					</button>

					<span className="text-sm text-gray-600 dark:text-gray-400">
						{pagination.offset + 1} -{" "}
						{Math.min(pagination.offset + pagination.limit, pagination.total)}{" "}
						dari {pagination.total}
					</span>

					<button
						onClick={() => fetchComments(pagination.offset + pagination.limit)}
						disabled={!hasNextPage}
						className="btn btn-solid"
					>
						Selanjutnya →
					</button>
				</div>
			)}

			{/* Detail Modal */}
			{showDetailModal && selectedComment && (
				<div
					className="modal-overlay"
					onClick={() => setShowDetailModal(false)}
				>
					<div className="modal-content" onClick={(e) => e.stopPropagation()}>
						{/* Modal Header */}
						<div className="modal-header">
							<h2 className="modal-title">Detail Komentar</h2>
							<button
								onClick={() => setShowDetailModal(false)}
								className="modal-close-btn"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						{/* Modal Body */}
						<div className="modal-body space-y-4">
							<div>
								<label className="form-label">Post/Artikel</label>
								{contentLoading ? (
									<div className="flex items-center gap-2">
										<Loader2 className="w-4 h-4 animate-spin text-blue-600" />
										<span className="text-gray-600 dark:text-gray-400">
											Memuat...
										</span>
									</div>
								) : selectedContent ? (
									<a
										href={`/blog/${selectedContent.slug}`}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
									>
										{selectedContent.title}
									</a>
								) : (
									<p className="text-gray-500 dark:text-gray-400">
										Artikel tidak ditemukan
									</p>
								)}
							</div>

							<div>
								<label className="form-label">Nama</label>
								<p className="text-gray-900 dark:text-white">
									{selectedComment.name}
								</p>
							</div>

							<div>
								<label className="form-label">Email</label>
								<p className="text-gray-900 dark:text-white">
									{selectedComment.email}
								</p>
							</div>

							<div>
								<label className="form-label">Waktu</label>
								<p className="text-gray-900 dark:text-white">
									{formatDate(selectedComment.createdAt)}
								</p>
							</div>

							<div>
								<label className="form-label">Status</label>
								<span
									className={`badge ${getStatusBadgeClass(selectedComment.status)}`}
								>
									{getStatusLabel(selectedComment.status)}
								</span>
							</div>

							{selectedComment.isSpam && (
								<div className="alert-warning">
									<div className="text-sm font-medium">
										⚠️ Komentar ini terdeteksi sebagai spam oleh sistem otomatis
									</div>
								</div>
							)}

							<div>
								<label className="form-label">Isi Komentar</label>
								<div className="p-4 bg-gray-50 dark:bg-[#2d2d2d] rounded-lg border border-gray-200 dark:border-gray-600">
									<p className="text-gray-800 dark:text-gray-300 whitespace-pre-wrap">
										{selectedComment.content}
									</p>
								</div>
							</div>
						</div>

						{/* Modal Footer */}
						<div className="modal-footer">
							{selectedComment.status !== "approved" && (
								<button
									onClick={() => {
										handleApprove(selectedComment.id);
										setShowDetailModal(false);
									}}
									className="btn btn-solid bg-green-600 hover:bg-green-700"
								>
									<Check className="w-4 h-4" />
									Setujui
								</button>
							)}

							{selectedComment.status !== "rejected" && (
								<button
									onClick={() => {
										handleReject(selectedComment.id);
										setShowDetailModal(false);
									}}
									className="btn btn-danger"
								>
									<X className="w-4 h-4" />
									Tolak
								</button>
							)}

							<button
								onClick={() => setShowDetailModal(false)}
								className="btn btn-ghost"
							>
								Tutup
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
