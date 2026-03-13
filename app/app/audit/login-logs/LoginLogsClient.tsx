"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
	Shield,
	CheckCircle,
	XCircle,
	ChevronLeft,
	ChevronRight,
	Filter,
	X,
} from "lucide-react";

interface LoginLog {
	id: number;
	userId: number | null;
	userName: string | null;
	email: string;
	success: boolean;
	failureReason: string | null;
	ipAddress: string;
	createdAt: Date;
}

interface LoginLogsClientProps {
	logs: LoginLog[];
	pagination: {
		page: number;
		pageSize: number;
		total: number;
		hasMore: boolean;
	};
	filters: {
		success?: string;
		userId?: string;
	};
}

export default function LoginLogsClient({
	logs,
	pagination,
	filters,
}: LoginLogsClientProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [filterOpen, setFilterOpen] = useState(false);
	const [selectedSuccess, setSelectedSuccess] = useState<string | null>(
		filters.success || null,
	);

	const getFailureReasonLabel = (reason: string | null) => {
		if (!reason) return null;
		const labels: Record<string, string> = {
			user_not_found: "User Not Found",
			invalid_password: "Invalid Password",
			captcha_failed: "CAPTCHA Failed",
		};
		return labels[reason] || reason;
	};

	const applyFilters = (success: string | null) => {
		const params = new URLSearchParams();
		if (success !== null) {
			params.set("success", success);
		}
		if (filters.userId) {
			params.set("userId", filters.userId);
		}
		params.set("page", "1");
		router.push(`?${params.toString()}`);
		setFilterOpen(false);
	};

	const clearFilters = () => {
		router.push("?page=1");
		setSelectedSuccess(null);
	};

	const goToPage = (page: number) => {
		const params = new URLSearchParams(searchParams);
		params.set("page", String(page));
		router.push(`?${params.toString()}`);
	};

	const hasFilters = selectedSuccess !== null || filters.userId;

	return (
		<div>
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
						Login Audit Log
					</h1>
					<p className="text-gray-600 dark:text-[#929292]">
						Track all user login attempts and monitor security
					</p>
				</div>
				<div className="hidden sm:block">
					<Shield className="w-12 h-12 text-blue-600 dark:text-blue-400" />
				</div>
			</div>

			{/* Stats Bar */}
			<div className="grid grid-cols-3 gap-4 mb-6">
				<div className="bg-white dark:bg-[#2a2a2a] rounded-lg p-4 border border-gray-200 dark:border-[#3a3a3a]">
					<div className="text-sm text-gray-600 dark:text-[#929292]">
						Total Attempts
					</div>
					<div className="text-2xl font-bold text-gray-900 dark:text-white">
						{pagination.total}
					</div>
				</div>
				<div className="bg-white dark:bg-[#2a2a2a] rounded-lg p-4 border border-gray-200 dark:border-[#3a3a3a]">
					<div className="text-sm text-gray-600 dark:text-[#929292]">
						Successful
					</div>
					<div className="text-2xl font-bold text-green-600 dark:text-green-400">
						{logs.filter((l) => l.success).length} /
						<span className="text-sm font-normal text-gray-600 dark:text-[#929292]">
							{" "}
							{pagination.pageSize}
						</span>
					</div>
				</div>
				<div className="bg-white dark:bg-[#2a2a2a] rounded-lg p-4 border border-gray-200 dark:border-[#3a3a3a]">
					<div className="text-sm text-gray-600 dark:text-[#929292]">
						Failed
					</div>
					<div className="text-2xl font-bold text-red-600 dark:text-red-400">
						{logs.filter((l) => !l.success).length} /
						<span className="text-sm font-normal text-gray-600 dark:text-[#929292]">
							{" "}
							{pagination.pageSize}
						</span>
					</div>
				</div>
			</div>

			{/* Filters */}
			<div className="mb-6 flex gap-2">
				<div className="relative">
					<button
						onClick={() => setFilterOpen(!filterOpen)}
						className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-[#3a3a3a] rounded-lg text-gray-700 dark:text-[#e5e5e5] hover:bg-gray-50 dark:hover:bg-[#323232] transition-colors"
					>
						<Filter size={18} />
						<span>Filter</span>
					</button>

					{filterOpen && (
						<div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-[#3a3a3a] rounded-lg shadow-lg z-10">
							<div className="p-4 space-y-3">
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-[#e5e5e5] mb-2">
										Status
									</label>
									<div className="space-y-2">
										<label className="flex items-center gap-2 cursor-pointer">
											<input
												type="radio"
												name="success"
												value=""
												checked={selectedSuccess === null}
												onChange={() => setSelectedSuccess(null)}
												className="w-4 h-4"
											/>
											<span className="text-sm text-gray-600 dark:text-[#929292]">
												All
											</span>
										</label>
										<label className="flex items-center gap-2 cursor-pointer">
											<input
												type="radio"
												name="success"
												value="true"
												checked={selectedSuccess === "true"}
												onChange={() => setSelectedSuccess("true")}
												className="w-4 h-4"
											/>
											<span className="text-sm text-gray-600 dark:text-[#929292]">
												Successful
											</span>
										</label>
										<label className="flex items-center gap-2 cursor-pointer">
											<input
												type="radio"
												name="success"
												value="false"
												checked={selectedSuccess === "false"}
												onChange={() => setSelectedSuccess("false")}
												className="w-4 h-4"
											/>
											<span className="text-sm text-gray-600 dark:text-[#929292]">
												Failed
											</span>
										</label>
									</div>
								</div>
								<button
									onClick={() => applyFilters(selectedSuccess)}
									className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
								>
									Apply Filter
								</button>
							</div>
						</div>
					)}
				</div>

				{hasFilters && (
					<button
						onClick={clearFilters}
						className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-[#3a3a3a] border border-gray-300 dark:border-[#4a4a4a] rounded-lg text-gray-700 dark:text-[#e5e5e5] hover:bg-gray-300 dark:hover:bg-[#424242] transition-colors"
					>
						<X size={18} />
						<span>Clear Filters</span>
					</button>
				)}
			</div>

			{/* Table */}
			<div className="bg-white dark:bg-[#2a2a2a] rounded-lg border border-gray-200 dark:border-[#3a3a3a] overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50 dark:bg-[#323232] border-b border-gray-200 dark:border-[#3a3a3a]">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-[#929292] uppercase tracking-wider">
									Status
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-[#929292] uppercase tracking-wider">
									Email
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-[#929292] uppercase tracking-wider">
									User
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-[#929292] uppercase tracking-wider">
									IP Address
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-[#929292] uppercase tracking-wider">
									Time
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 dark:divide-[#3a3a3a]">
							{logs.length > 0 ? (
								logs.map((log) => (
									<tr
										key={log.id}
										className="hover:bg-gray-50 dark:hover:bg-[#323232] transition-colors"
									>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center gap-2">
												{log.success ? (
													<>
														<CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
														<span className="text-sm font-medium text-green-600 dark:text-green-400">
															Success
														</span>
													</>
												) : (
													<>
														<XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
														<span className="text-sm font-medium text-red-600 dark:text-red-400">
															Failed
														</span>
													</>
												)}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className="text-sm text-gray-900 dark:text-[#e5e5e5]">
												{log.email}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className="text-sm text-gray-600 dark:text-[#929292]">
												{log.userName || "-"}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className="text-sm text-gray-600 dark:text-[#929292] font-mono">
												{log.ipAddress}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-600 dark:text-[#929292]">
												{new Date(log.createdAt).toLocaleDateString("id-ID")}
											</div>
											<div className="text-xs text-gray-500 dark:text-[#828282]">
												{new Date(log.createdAt).toLocaleTimeString("id-ID")}
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={5} className="px-6 py-8 text-center">
										<p className="text-gray-600 dark:text-[#929292]">
											No login logs found
										</p>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				{pagination.total > pagination.pageSize && (
					<div className="border-t border-gray-200 dark:border-[#3a3a3a] px-6 py-4 flex items-center justify-between">
						<div className="text-sm text-gray-600 dark:text-[#929292]">
							Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
							{Math.min(
								pagination.page * pagination.pageSize,
								pagination.total,
							)}{" "}
							of {pagination.total} logs
						</div>
						<div className="flex items-center gap-2">
							<button
								onClick={() => goToPage(Math.max(1, pagination.page - 1))}
								disabled={pagination.page === 1}
								className="p-2 text-gray-600 dark:text-[#929292] hover:bg-gray-100 dark:hover:bg-[#323232] disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
							>
								<ChevronLeft size={20} />
							</button>
							<span className="text-sm font-medium text-gray-700 dark:text-[#e5e5e5]">
								Page {pagination.page}
							</span>
							<button
								onClick={() => goToPage(pagination.page + 1)}
								disabled={!pagination.hasMore}
								className="p-2 text-gray-600 dark:text-[#929292] hover:bg-gray-100 dark:hover:bg-[#323232] disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
							>
								<ChevronRight size={20} />
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Back Link */}
			<div className="mt-6">
				<Link
					href="/app/dashboard"
					className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
				>
					← Back to Dashboard
				</Link>
			</div>
		</div>
	);
}
