"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Filter, Calendar } from "lucide-react";
import type { Metadata } from "next";

interface AuditLog {
	id: number;
	userId: number;
	userName: string;
	action: string;
	entityType: string;
	entityName: string;
	entityId: number;
	changes: Record<string, any> | null;
	oldValues: Record<string, any> | null;
	newValues: Record<string, any> | null;
	createdAt: Date;
}

interface ContentAuditLogsClientProps {
	logs: AuditLog[];
	pagination: {
		page: number;
		pageSize: number;
		total: number;
		hasMore: boolean;
	};
	error?: string;
}

const ACTION_COLORS: Record<string, string> = {
	create:
		"bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200",
	update: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200",
	delete: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200",
	publish:
		"bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200",
	schedule:
		"bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200",
};

export default function ContentAuditLogsClient({
	logs,
	pagination,
	error,
}: ContentAuditLogsClientProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [filterAction, setFilterAction] = useState(
		searchParams.get("action") || "",
	);
	const [filterEntity, setFilterEntity] = useState(
		searchParams.get("entityType") || "",
	);
	const [expandedId, setExpandedId] = useState<number | null>(null);

	const uniqueActions = useMemo(
		() => [...new Set(logs.map((log) => log.action))],
		[logs],
	);

	const uniqueEntities = useMemo(
		() => [...new Set(logs.map((log) => log.entityType))],
		[logs],
	);

	const handleFilterChange = () => {
		const params = new URLSearchParams();
		if (filterAction) params.append("action", filterAction);
		if (filterEntity) params.append("entityType", filterEntity);
		router.push(`/app/audit/content-logs?${params.toString()}`);
	};

	const handlePageChange = (newPage: number) => {
		const params = new URLSearchParams(searchParams);
		params.set("page", newPage.toString());
		router.push(`/app/audit/content-logs?${params.toString()}`);
	};

	const getActionColor = (action: string) => {
		return ACTION_COLORS[action] || ACTION_COLORS.update;
	};

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleString("id-ID", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
	};

	if (error) {
		return (
			<div className="p-6 text-center">
				<p className="text-red-600 dark:text-red-400">{error}</p>
			</div>
		);
	}

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
					Content Audit Logs
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Track all changes made to content and entities in the system
				</p>
			</div>

			{/* Filters */}
			<div className="bg-white dark:bg-[#323232] rounded-lg border border-gray-200 dark:border-[#424242] p-4 space-y-4">
				<div className="flex items-center gap-2 mb-4">
					<Filter size={20} className="text-gray-600 dark:text-gray-400" />
					<h3 className="font-semibold text-gray-900 dark:text-white">
						Filters
					</h3>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
							Action
						</label>
						<select
							value={filterAction}
							onChange={(e) => setFilterAction(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 dark:border-[#424242] rounded-lg bg-white dark:bg-[#222222] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">All Actions</option>
							{uniqueActions.map((action) => (
								<option key={action} value={action}>
									{action.charAt(0).toUpperCase() + action.slice(1)}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
							Entity Type
						</label>
						<select
							value={filterEntity}
							onChange={(e) => setFilterEntity(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 dark:border-[#424242] rounded-lg bg-white dark:bg-[#222222] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">All Types</option>
							{uniqueEntities.map((entity) => (
								<option key={entity} value={entity}>
									{entity.charAt(0).toUpperCase() + entity.slice(1)}
								</option>
							))}
						</select>
					</div>
				</div>

				<button
					onClick={handleFilterChange}
					className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
				>
					Apply Filters
				</button>
			</div>

			{/* Logs Table */}
			<div className="bg-white dark:bg-[#323232] rounded-lg border border-gray-200 dark:border-[#424242] overflow-hidden">
				{logs.length === 0 ? (
					<div className="p-8 text-center text-gray-500 dark:text-gray-400">
						No audit logs found
					</div>
				) : (
					<div className="space-y-0">
						{logs.map((log) => (
							<div
								key={log.id}
								className="border-b border-gray-200 dark:border-[#424242] last:border-b-0"
							>
								<button
									onClick={() =>
										setExpandedId(expandedId === log.id ? null : log.id)
									}
									className="w-full p-4 hover:bg-gray-50 dark:hover:bg-[#3a3a3a] transition-colors text-left"
								>
									<div className="flex items-center justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-3 mb-2">
												<span
													className={`px-3 py-1 rounded-full text-sm font-semibold ${getActionColor(log.action)}`}
												>
													{log.action.toUpperCase()}
												</span>
												<span className="text-sm font-medium text-gray-900 dark:text-white">
													{log.entityName}
												</span>
											</div>
											<div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
												<span>{log.userName}</span>
												<span>
													{log.entityType.charAt(0).toUpperCase() +
														log.entityType.slice(1)}
												</span>
												<div className="flex items-center gap-1">
													<Calendar size={14} />
													{formatDate(log.createdAt)}
												</div>
											</div>
										</div>
										<div className="text-right">
											<span className="text-xs text-gray-500 dark:text-gray-500">
												Log #{log.id}
											</span>
										</div>
									</div>
								</button>

								{/* Expandable Details */}
								{expandedId === log.id && (
									<div className="bg-gray-50 dark:bg-[#2a2a2a] p-4 border-t border-gray-200 dark:border-[#424242]">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											{log.oldValues && (
												<div>
													<h4 className="font-semibold text-gray-900 dark:text-white mb-2">
														Previous Values
													</h4>
													<pre className="bg-white dark:bg-[#222222] p-2 rounded text-xs overflow-x-auto text-gray-900 dark:text-gray-300 border border-gray-200 dark:border-[#424242]">
														{JSON.stringify(log.oldValues, null, 2)}
													</pre>
												</div>
											)}
											{log.newValues && (
												<div>
													<h4 className="font-semibold text-gray-900 dark:text-white mb-2">
														New Values
													</h4>
													<pre className="bg-white dark:bg-[#222222] p-2 rounded text-xs overflow-x-auto text-gray-900 dark:text-gray-300 border border-gray-200 dark:border-[#424242]">
														{JSON.stringify(log.newValues, null, 2)}
													</pre>
												</div>
											)}
										</div>
										{log.changes && (
											<div className="mt-4">
												<h4 className="font-semibold text-gray-900 dark:text-white mb-2">
													Changes
												</h4>
												<pre className="bg-white dark:bg-[#222222] p-2 rounded text-xs overflow-x-auto text-gray-900 dark:text-gray-300 border border-gray-200 dark:border-[#424242]">
													{JSON.stringify(log.changes, null, 2)}
												</pre>
											</div>
										)}
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>

			{/* Pagination */}
			{pagination.total > 0 && (
				<div className="flex items-center justify-between p-4 bg-white dark:bg-[#323232] rounded-lg border border-gray-200 dark:border-[#424242]">
					<div className="text-sm text-gray-600 dark:text-gray-400">
						Showing{" "}
						{Math.min(
							(pagination.page - 1) * pagination.pageSize + 1,
							pagination.total,
						)}{" "}
						to{" "}
						{Math.min(pagination.page * pagination.pageSize, pagination.total)}{" "}
						of {pagination.total} logs
					</div>

					<div className="flex gap-2">
						<button
							onClick={() => handlePageChange(pagination.page - 1)}
							disabled={pagination.page === 1}
							className="p-2 hover:bg-gray-100 dark:hover:bg-[#424242] rounded disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<ChevronLeft size={20} />
						</button>

						<div className="flex items-center gap-1">
							{Array.from(
								{
									length: Math.ceil(pagination.total / pagination.pageSize),
								},
								(_, i) => i + 1,
							)
								.slice(
									Math.max(0, pagination.page - 2),
									Math.min(
										Math.ceil(pagination.total / pagination.pageSize),
										pagination.page + 1,
									),
								)
								.map((p) => (
									<button
										key={p}
										onClick={() => handlePageChange(p)}
										className={`px-3 py-1 rounded ${
											p === pagination.page
												? "bg-blue-600 text-white"
												: "hover:bg-gray-100 dark:hover:bg-[#424242] text-gray-900 dark:text-white"
										}`}
									>
										{p}
									</button>
								))}
						</div>

						<button
							onClick={() => handlePageChange(pagination.page + 1)}
							disabled={!pagination.hasMore}
							className="p-2 hover:bg-gray-100 dark:hover:bg-[#424242] rounded disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<ChevronRight size={20} />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
