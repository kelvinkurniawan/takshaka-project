"use client";
import { apiFetch } from "@/lib/api-fetch";

import { useState, useEffect } from "react";
import { Loader2, Trash2, Eye, Mail } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ContactSubmission {
	id: number;
	fullName: string;
	email: string;
	phoneNumber?: string;
	country?: string;
	subject: string;
	message: string;
	status: "new" | "read" | "responded" | "spam";
	createdAt: string;
	updatedAt: string;
}

export default function ContactSubmissionsClient() {
	const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
	const [loading, setLoading] = useState(true);
	const [actionLoading, setActionLoading] = useState<number | null>(null);
	const [selectedSubmission, setSelectedSubmission] =
		useState<ContactSubmission | null>(null);
	const [showDetailModal, setShowDetailModal] = useState(false);
	const [statusFilter, setStatusFilter] = useState<string>("all");

	const fetchSubmissions = async () => {
		try {
			setLoading(true);
			const response = await apiFetch("/api/contact-submissions");
			if (response.ok) {
				const data: ContactSubmission[] = await response.json();
				// Filter by status if not "all"
				if (statusFilter !== "all") {
					const filtered = data.filter((s) => s.status === statusFilter);
					setSubmissions(filtered);
				} else {
					setSubmissions(data);
				}
			}
		} catch (error) {
			console.error("Failed to fetch submissions:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchSubmissions();
	}, [statusFilter]);

	const handleMarkAsRead = async (submissionId: number) => {
		try {
			setActionLoading(submissionId);
			const response = await apiFetch(`/api/contact-submissions/${submissionId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: "read" }),
			});

			if (response.ok) {
				setSubmissions(
					submissions.map((s) =>
						s.id === submissionId ? { ...s, status: "read" } : s,
					),
				);
			}
		} catch (error) {
			console.error("Failed to update status:", error);
		} finally {
			setActionLoading(null);
		}
	};

	const handleDelete = async (submissionId: number) => {
		if (!confirm("Are you sure you want to delete this submission?")) return;

		try {
			setActionLoading(submissionId);
			const response = await apiFetch(`/api/contact-submissions/${submissionId}`, {
				method: "DELETE",
			});

			if (response.ok) {
				setSubmissions(submissions.filter((s) => s.id !== submissionId));
			}
		} catch (error) {
			console.error("Failed to delete submission:", error);
		} finally {
			setActionLoading(null);
		}
	};

	const handleViewDetails = (submission: ContactSubmission) => {
		setSelectedSubmission(submission);
		setShowDetailModal(true);
		if (submission.status === "new") {
			handleMarkAsRead(submission.id);
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "new":
				return "bg-blue-100 text-blue-800";
			case "read":
				return "bg-yellow-100 text-yellow-800";
			case "responded":
				return "bg-green-100 text-green-800";
			case "spam":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
					Contact Submissions
				</h1>
				<p className="mt-2 text-gray-600 dark:text-gray-400">
					Manage messages from your contact form
				</p>
			</div>

			{/* Filters */}
			<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
				<div className="flex items-center gap-4">
					<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
						Status:
					</label>
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
						className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
					>
						<option value="all">All</option>
						<option value="new">New</option>
						<option value="read">Read</option>
						<option value="responded">Responded</option>
						<option value="spam">Spam</option>
					</select>
				</div>
			</div>

			{/* Table */}
			<div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
				{loading ? (
					<div className="flex items-center justify-center py-12">
						<Loader2 className="w-8 h-8 animate-spin text-gray-400" />
					</div>
				) : submissions.length === 0 ? (
					<div className="text-center py-12">
						<p className="text-gray-500 dark:text-gray-400">
							No submissions found
						</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
										From
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
										Subject
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
										Status
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
										Date
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200 dark:divide-gray-600">
								{submissions.map((submission) => (
									<tr
										key={submission.id}
										className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
									>
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<div>
													<p className="text-sm font-medium text-gray-900 dark:text-white">
														{submission.fullName}
													</p>
													<div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
														<Mail className="w-3 h-3" />
														{submission.email}
													</div>
												</div>
											</div>
										</td>
										<td className="px-6 py-4">
											<p className="text-sm text-gray-900 dark:text-white truncate max-w-xs">
												{submission.subject}
											</p>
										</td>
										<td className="px-6 py-4">
											<span
												className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
													submission.status,
												)}`}
											>
												{submission.status.charAt(0).toUpperCase() +
													submission.status.slice(1)}
											</span>
										</td>
										<td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
											{formatDistanceToNow(new Date(submission.createdAt), {
												addSuffix: true,
											})}
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center gap-2">
												<button
													onClick={() => handleViewDetails(submission)}
													className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition"
													title="View details"
												>
													<Eye className="w-4 h-4" />
												</button>
												<button
													onClick={() => handleDelete(submission.id)}
													disabled={actionLoading === submission.id}
													className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition disabled:opacity-50"
													title="Delete"
												>
													{actionLoading === submission.id ? (
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
			</div>

			{/* Detail Modal */}
			{showDetailModal && selectedSubmission && (
				<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
						<div className="p-6 space-y-4">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-bold text-gray-900 dark:text-white">
									Message Details
								</h2>
								<button
									onClick={() => setShowDetailModal(false)}
									className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
								>
									✕
								</button>
							</div>

							<div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200 dark:border-gray-600">
								<div>
									<p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
										Name
									</p>
									<p className="text-sm font-medium text-gray-900 dark:text-white">
										{selectedSubmission.fullName}
									</p>
								</div>
								<div>
									<p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
										Email
									</p>
									<a
										href={`mailto:${selectedSubmission.email}`}
										className="text-sm font-medium text-blue-600 hover:underline"
									>
										{selectedSubmission.email}
									</a>
								</div>
								{selectedSubmission.phoneNumber && (
									<div>
										<p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
											Phone
										</p>
										<p className="text-sm font-medium text-gray-900 dark:text-white">
											{selectedSubmission.phoneNumber}
										</p>
									</div>
								)}
								{selectedSubmission.country && (
									<div>
										<p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
											Country
										</p>
										<p className="text-sm font-medium text-gray-900 dark:text-white">
											{selectedSubmission.country}
										</p>
									</div>
								)}
							</div>

							<div>
								<p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">
									Subject
								</p>
								<p className="text-sm font-medium text-gray-900 dark:text-white">
									{selectedSubmission.subject}
								</p>
							</div>

							<div>
								<p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">
									Message
								</p>
								<p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
									{selectedSubmission.message}
								</p>
							</div>

							<div className="pt-4 border-t border-gray-200 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400">
								Received:{" "}
								{new Date(selectedSubmission.createdAt).toLocaleString()}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
