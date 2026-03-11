"use client";

import { useState, useEffect } from "react";
import {
	BarChart3,
	TrendingUp,
	Users,
	Eye,
	AlertCircle,
	Loader,
	Calendar,
} from "lucide-react";

interface OverviewData {
	period: {
		days: number;
		startDate: string;
		endDate: string;
	};
	summary: {
		totalViews: number;
		uniqueVisitors: number;
		viewsTrend: number;
		avgViewsPerVisitor: string;
	};
	topPages: Array<{
		pageSlug: string;
		pageTitle: string;
		views: number;
	}>;
}

interface VisitorsData {
	period: {
		days: number;
		startDate: string;
		endDate: string;
	};
	summary: {
		newVisitors: number;
		returningVisitors: number;
		avgPageViewsPerVisitor: string;
		totalVisitors: number;
	};
	topReferrers: Array<{
		refererDomain: string;
		count: number;
	}>;
}

export default function AnalyticsPage() {
	const [overview, setOverview] = useState<OverviewData | null>(null);
	const [visitors, setVisitors] = useState<VisitorsData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [days, setDays] = useState(30);

	// Fetch data
	useEffect(() => {
		const fetchAnalytics = async () => {
			try {
				setIsLoading(true);
				setError("");

				const [overviewRes, visitorsRes] = await Promise.all([
					fetch(`/api/app/analytics/overview?days=${days}`),
					fetch(`/api/app/analytics/visitors?days=${days}`),
				]);

				if (!overviewRes.ok || !visitorsRes.ok) {
					throw new Error("Failed to fetch analytics data");
				}

				const overviewData = await overviewRes.json();
				const visitorsData = await visitorsRes.json();

				setOverview(overviewData);
				setVisitors(visitorsData);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to load analytics",
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAnalytics();
	}, [days]);

	const formatNumber = (num: number | string) => {
		const n = typeof num === "string" ? parseInt(num) : num;
		return n.toLocaleString();
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<Loader className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
					<p className="text-gray-600 dark:text-gray-400">
						Loading analytics...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
						<BarChart3 size={32} />
						Analytics
					</h1>
					<p className="text-gray-600 dark:text-gray-400 mt-2">
						Track visitor activity and page performance
					</p>
				</div>

				{/* Period Selector */}
				<div className="flex items-center gap-2">
					<Calendar className="text-gray-600 dark:text-gray-400" size={20} />
					<select
						value={days}
						onChange={(e) => setDays(parseInt(e.target.value))}
						className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#225] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value={7}>Last 7 days</option>
						<option value={14}>Last 14 days</option>
						<option value={30}>Last 30 days</option>
						<option value={90}>Last 90 days</option>
					</select>
				</div>
			</div>

			{/* Error Message */}
			{error && (
				<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
					<AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
					<p className="text-red-800 dark:text-red-300">{error}</p>
				</div>
			)}

			{/* Overview Cards */}
			{overview && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{/* Total Page Views */}
					<div className="bg-white dark:bg-[#323232] rounded-lg border border-gray-200 dark:border-gray-700 p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Total Page Views
								</p>
								<p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
									{formatNumber(overview.summary.totalViews)}
								</p>
							</div>
							<Eye className="w-10 h-10 text-blue-500 opacity-20" />
						</div>
					</div>

					{/* Unique Visitors */}
					<div className="bg-white dark:bg-[#323232] rounded-lg border border-gray-200 dark:border-gray-700 p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Unique Visitors
								</p>
								<p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
									{formatNumber(overview.summary.uniqueVisitors)}
								</p>
							</div>
							<Users className="w-10 h-10 text-purple-500 opacity-20" />
						</div>
					</div>

					{/* Trend */}
					<div className="bg-white dark:bg-[#323232] rounded-lg border border-gray-200 dark:border-gray-700 p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Views Trend
								</p>
								<div className="flex items-baseline gap-2 mt-2">
									<p className="text-3xl font-bold text-gray-900 dark:text-white">
										{overview.summary.viewsTrend > 0 ? "+" : ""}
										{overview.summary.viewsTrend.toFixed(1)}%
									</p>
									<span
										className={`text-sm font-semibold ${
											overview.summary.viewsTrend >= 0
												? "text-green-600"
												: "text-red-600"
										}`}
									>
										vs last period
									</span>
								</div>
							</div>
							<TrendingUp className="w-10 h-10 text-green-500 opacity-20" />
						</div>
					</div>

					{/* Avg Views per Visitor */}
					<div className="bg-white dark:bg-[#323232] rounded-lg border border-gray-200 dark:border-gray-700 p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Avg Views/Visitor
								</p>
								<p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
									{overview.summary.avgViewsPerVisitor}
								</p>
							</div>
							<BarChart3 className="w-10 h-10 text-orange-500 opacity-20" />
						</div>
					</div>
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Top Pages */}
				{overview && (
					<div className="bg-white dark:bg-[#323232] rounded-lg border border-gray-200 dark:border-gray-700 p-6">
						<h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
							Top Pages
						</h2>

						{overview.topPages.length === 0 ? (
							<p className="text-gray-600 dark:text-gray-400 text-center py-8">
								No page views yet
							</p>
						) : (
							<div className="space-y-3">
								{overview.topPages.map((page, index) => (
									<div
										key={index}
										className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#393939] rounded-lg"
									>
										<div className="flex-1 min-w-0">
											<p className="font-semibold text-gray-900 dark:text-white truncate">
												{page.pageTitle || page.pageSlug}
											</p>
											<p className="text-sm text-gray-600 dark:text-gray-400 truncate">
												/{page.pageSlug}
											</p>
										</div>
										<div className="flex-shrink-0 ml-4">
											<p className="text-2xl font-bold text-blue-600">
												{formatNumber(page.views)}
											</p>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{/* Visitor Statistics */}
				{visitors && (
					<div className="bg-white dark:bg-[#323232] rounded-lg border border-gray-200 dark:border-gray-700 p-6">
						<h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
							Visitor Summary
						</h2>

						<div className="space-y-4">
							<div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-[#393939] rounded-lg">
								<p className="text-gray-600 dark:text-gray-400">
									Total Visitors
								</p>
								<p className="text-2xl font-bold text-blue-600">
									{formatNumber(visitors.summary.totalVisitors)}
								</p>
							</div>

							<div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-[#393939] rounded-lg">
								<p className="text-gray-600 dark:text-gray-400">New Visitors</p>
								<p className="text-2xl font-bold text-green-600">
									{formatNumber(visitors.summary.newVisitors)}
								</p>
							</div>

							<div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-[#393939] rounded-lg">
								<p className="text-gray-600 dark:text-gray-400">Returning</p>
								<p className="text-2xl font-bold text-purple-600">
									{formatNumber(visitors.summary.returningVisitors)}
								</p>
							</div>

							<div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-[#393939] rounded-lg">
								<p className="text-gray-600 dark:text-gray-400">
									Avg Pages/Visitor
								</p>
								<p className="text-2xl font-bold text-orange-600">
									{visitors.summary.avgPageViewsPerVisitor}
								</p>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Top Referrers */}
			{visitors && visitors.topReferrers.length > 0 && (
				<div className="bg-white dark:bg-[#323232] rounded-lg border border-gray-200 dark:border-gray-700 p-6">
					<h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
						Top Referrers
					</h2>

					<div className="space-y-2">
						{visitors.topReferrers.map((referrer, index) => (
							<div
								key={index}
								className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#393939] rounded-lg"
							>
								<p className="font-medium text-gray-900 dark:text-white">
									{referrer.refererDomain || "Direct"}
								</p>
								<p className="text-sm font-semibold text-blue-600">
									{formatNumber(referrer.count)} visitors
								</p>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Date Range Info */}
			{overview && (
				<div className="text-sm text-gray-600 dark:text-gray-400 text-center pb-6">
					<p>
						Showing data from {formatDate(overview.period.startDate)} to{" "}
						{formatDate(overview.period.endDate)}
					</p>
				</div>
			)}
		</div>
	);
}
