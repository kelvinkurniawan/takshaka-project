"use client";

import { useState, useEffect } from "react";
import { Bell, AlertCircle, Loader } from "lucide-react";

interface Notification {
	id: number;
	userId: number;
	action: string;
	entityType: string;
	entityId: number;
	entityName: string | null;
	createdAt: string;
	userName: string;
}

interface PaginationInfo {
	limit: number;
	offset: number;
	total: number;
}

export default function NotificationsPage() {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [pagination, setPagination] = useState<PaginationInfo | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [limit, setLimit] = useState(20);
	const [offset, setOffset] = useState(0);

	// Fetch notifications
	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				setIsLoading(true);
				const response = await fetch(
					`/api/app/notifications?limit=${limit}&offset=${offset}`,
				);

				if (!response.ok) {
					throw new Error("Failed to fetch notifications");
				}

				const data = await response.json();
				setNotifications(data.notifications);
				setPagination(data.pagination);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to load notifications",
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchNotifications();
	}, [limit, offset]);

	const getActionColor = (action: string): string => {
		switch (action) {
			case "create":
				return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
			case "update":
				return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
			case "delete":
				return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
			case "publish":
				return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400";
			case "schedule":
				return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400";
			default:
				return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400";
		}
	};

	const getActionLabel = (action: string): string => {
		const labels: Record<string, string> = {
			create: "Created",
			update: "Updated",
			delete: "Deleted",
			publish: "Published",
			schedule: "Scheduled",
		};
		return labels[action] || action;
	};

	const getEntityTypeLabel = (entityType: string): string => {
		const labels: Record<string, string> = {
			contents: "Content",
			pages: "Page",
			categories: "Category",
			users: "User",
			settings: "Setting",
			comments: "Comment",
			faqs: "FAQ",
			media_gallery: "Media",
			navigation: "Navigation",
		};
		return labels[entityType] || entityType;
	};

	const formatTime = (dateString: string): string => {
		const date = new Date(dateString);
		const now = new Date();
		const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

		if (secondsAgo < 60) return "just now";
		if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m ago`;
		if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}h ago`;
		if (secondsAgo < 604800) return `${Math.floor(secondsAgo / 86400)}d ago`;

		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const handlePreviousPage = () => {
		if (offset > 0) {
			setOffset(Math.max(0, offset - limit));
		}
	};

	const handleNextPage = () => {
		if (pagination && offset + limit < pagination.total) {
			setOffset(offset + limit);
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<Loader className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
					<p className="text-gray-600 dark:text-gray-400">
						Loading notifications...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
					<Bell size={32} />
					Notifications
				</h1>
				<p className="text-gray-600 dark:text-gray-400 mt-2">
					View recent activity and changes across the platform
				</p>
			</div>

			{/* Error Message */}
			{error && (
				<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
					<AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
					<p className="text-red-800 dark:text-red-300">{error}</p>
				</div>
			)}

			{/* Notifications List */}
			{notifications.length === 0 ? (
				<div className="bg-white dark:bg-[#323232] rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
					<Bell className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
					<p className="text-gray-600 dark:text-gray-400">
						No notifications yet. All activities will appear here.
					</p>
				</div>
			) : (
				<div className="bg-white dark:bg-[#323232] rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden">
					{notifications.map((notification) => (
						<div
							key={notification.id}
							className="p-4 hover:bg-gray-50 dark:hover:bg-[#393939] transition-colors"
						>
							<div className="flex items-start gap-4">
								{/* Action Badge */}
								<div
									className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 mt-1 ${getActionColor(notification.action)}`}
								>
									{getActionLabel(notification.action)}
								</div>

								{/* Content */}
								<div className="flex-1 min-w-0">
									<div className="flex items-baseline gap-2 flex-wrap">
										<span className="font-semibold text-gray-900 dark:text-white">
											{notification.userName}
										</span>
										<span className="text-gray-600 dark:text-gray-400">
											{notification.action} a
										</span>
										<span className="text-gray-900 dark:text-white font-medium">
											{getEntityTypeLabel(notification.entityType)}
										</span>
									</div>

									{notification.entityName && (
										<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
											<span className="font-medium text-gray-900 dark:text-white">
												"{notification.entityName}"
											</span>
										</p>
									)}

									<p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
										{formatTime(notification.createdAt)}
									</p>
								</div>

								{/* Entity Type Badge */}
								<div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded flex-shrink-0">
									{notification.entityType}
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Pagination */}
			{pagination && pagination.total > limit && (
				<div className="flex items-center justify-between">
					<p className="text-sm text-gray-600 dark:text-gray-400">
						Showing {offset + 1} to {Math.min(offset + limit, pagination.total)}{" "}
						of {pagination.total} notifications
					</p>

					<div className="flex gap-2">
						<button
							onClick={handlePreviousPage}
							disabled={offset === 0}
							className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#323232] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							Previous
						</button>

						<button
							onClick={handleNextPage}
							disabled={offset + limit >= pagination.total}
							className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#323232] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							Next
						</button>
					</div>
				</div>
			)}

			{/* Limit Selector */}
			<div className="flex items-center gap-2">
				<label className="text-sm text-gray-600 dark:text-gray-400">
					Items per page:
				</label>
				<select
					value={limit}
					onChange={(e) => {
						setLimit(parseInt(e.target.value));
						setOffset(0);
					}}
					className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#225] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="10">10</option>
					<option value="20">20</option>
					<option value="50">50</option>
					<option value="100">100</option>
				</select>
			</div>
		</div>
	);
}
