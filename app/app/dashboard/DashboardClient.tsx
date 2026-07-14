"use client";

import {
	LayoutDashboard,
	Database,
	Users,
	FileText,
	TrendingUp,
	LogIn,
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
	totals: {
		contents: number;
		users: number;
		categories: number;
	};
	today: {
		totalPageViews: number;
		uniqueVisitors: number;
		successfulLogins: number;
		hourlyBreakdown: Array<{ hour: number; visitors: number }>;
	};
	recentLogins: Array<{
		id: number;
		email: string;
		userName: string;
		time: Date;
	}>;
}

interface DashboardClientProps {
	stats: DashboardStats;
	hasError?: boolean;
}

export default function DashboardClient({
	stats,
	hasError,
}: DashboardClientProps) {
	// Feature flag
	const enableDashboardAnalytics =
		process.env.NEXT_PUBLIC_ENABLE_DASHBOARD_ANALYTICS === "true";

	// Find max value for scaling chart
	const maxHourlyVisitors = Math.max(
		1,
		...stats.today.hourlyBreakdown.map((h) => h.visitors),
	);

	return (
		<>
			{/* Welcome Card */}
			<div className="welcome-card">
				<div className="welcome-card-content">
					<div className="welcome-card-icon">
						<LayoutDashboard className="welcome-card-icon-svg" />
					</div>
					<div className="welcome-card-text">
						<h3 className="welcome-card-title">
							Selamat Datang di Takshaka CMS
						</h3>
						<p className="welcome-card-desc">
							Kelola konten Anda dengan mudah menggunakan headless CMS yang
							powerful
						</p>
					</div>
				</div>
			</div>

			{hasError ? (
				<div className="alert alert-error mt-4">
					Gagal memuat data dashboard.
				</div>
			) : null}

			{/* Stats Cards */}
			<div className="stats-grid">
				<div className="stat-card">
					<div className="stat-card-content">
						<div className="stat-card-text">
							<div className="stat-card-label">Total Content</div>
							<div className="stat-card-value">{stats.totals.contents}</div>
							<div className="text-muted text-sm mt-1">Articles published</div>
						</div>
						<div className="stat-card-icon-wrapper stat-card-icon-wrapper-blue">
							<Database className="stat-card-icon stat-card-icon-blue" />
						</div>
					</div>
				</div>

				<div className="stat-card">
					<div className="stat-card-content">
						<div className="stat-card-text">
							<div className="stat-card-label">Total Users</div>
							<div className="stat-card-value">{stats.totals.users}</div>
							<div className="text-muted text-sm mt-1">Registered users</div>
						</div>
						<div className="stat-card-icon-wrapper stat-card-icon-wrapper-indigo">
							<Users className="stat-card-icon stat-card-icon-indigo" />
						</div>
					</div>
				</div>

				<div className="stat-card">
					<div className="stat-card-content">
						<div className="stat-card-text">
							<div className="stat-card-label">Categories</div>
							<div className="stat-card-value">{stats.totals.categories}</div>
							<div className="text-muted text-sm mt-1">Content categories</div>
						</div>
						<div className="stat-card-icon-wrapper stat-card-icon-wrapper-purple">
							<FileText className="stat-card-icon stat-card-icon-purple" />
						</div>
					</div>
				</div>
			</div>

			{/* Today's Visitors Card */}
			{enableDashboardAnalytics && (
				<>
					<div className="stat-card mt-6">
						<div className="stat-card-content">
							<div className="w-full">
								<div className="flex items-center justify-between mb-4">
									<div>
										<div className="stat-card-label">Pengunjung Hari Ini</div>
										<div className="stat-card-value">
											{stats.today.uniqueVisitors}
										</div>
										<div className="text-muted text-sm mt-1">
											{stats.today.totalPageViews} page views
										</div>
									</div>
									<div className="stat-card-icon-wrapper stat-card-icon-wrapper-green">
										<TrendingUp className="stat-card-icon stat-card-icon-green" />
									</div>
								</div>

								{/* Hourly Breakdown Chart */}
								<div className="mt-6">
									<h4 className="text-sm font-semibold text-gray-700 dark:text-[#e5e5e5] mb-3">
										Breakdown Per Jam
									</h4>
									<div className="flex items-end justify-between gap-1">
										{stats.today.hourlyBreakdown.map((hour) => (
											<div
												key={hour.hour}
												className="flex-1 flex flex-col items-center gap-1"
											>
												<div
													className="w-full bg-[#171717] dark:bg-[#ededed] hover:opacity-70 rounded-t transition-opacity"
													style={{
														height: Math.max(
															4,
															(hour.visitors / maxHourlyVisitors) * 100,
														),
														minHeight: hour.visitors > 0 ? "4px" : "2px",
													}}
													title={`${hour.hour}:00 - ${hour.visitors} visitors`}
												/>
												<span className="text-xs text-gray-500 dark:text-[#929292]">
													{hour.hour}
												</span>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Recent Logins Card */}
					<div className="stat-card mt-6">
						<div className="stat-card-content">
							<div className="w-full">
								<div className="flex items-center justify-between mb-4">
									<div>
										<div className="stat-card-label">Login Hari Ini</div>
										<div className="stat-card-value">
											{stats.today.successfulLogins}
										</div>
										<div className="text-muted text-sm mt-1">
											Successful logins
										</div>
									</div>
									<div className="stat-card-icon-wrapper stat-card-icon-wrapper-orange">
										<LogIn className="stat-card-icon stat-card-icon-orange" />
									</div>
								</div>

								{/* Recent Login List */}
								{stats.recentLogins.length > 0 ? (
									<div className="mt-4 space-y-2">
										<h4 className="text-sm font-semibold text-gray-700 dark:text-[#e5e5e5]">
											Recent Logins
										</h4>
										<div className="space-y-2 max-h-48 overflow-y-auto">
											{stats.recentLogins.map((login) => (
												<div
													key={login.id}
													className="flex items-center justify-between p-2 bg-gray-50 dark:bg-[#323232] rounded text-sm"
												>
													<div className="flex-1">
														<div className="text-gray-900 dark:text-[#e5e5e5] font-medium truncate">
															{login.email}
														</div>
														<div className="text-xs text-gray-500 dark:text-[#929292]">
															{new Date(login.time).toLocaleTimeString("id-ID")}
														</div>
													</div>
												</div>
											))}
										</div>
										<Link
											href="/app/audit/login-logs"
											prefetch={false}
											className="inline-block mt-2 text-sm text-[#0072f5] hover:underline"
										>
											Lihat semua login →
										</Link>
									</div>
								) : (
									<div className="mt-4 p-4 text-center text-gray-500 dark:text-[#929292]">
										Belum ada login hari ini
									</div>
								)}
							</div>
						</div>
					</div>
				</>
			)}

			{/* Quick Actions (use existing feature styles from globals.css) */}
			<div className="features-grid mt-6">
				<a
					href="/app/content/create"
					className="feature-card flex items-center gap-4"
				>
					<FileText className="w-6 h-6 text-[#171717] dark:text-[#ededed]" />
					<div>
						<div className="feature-card-title">Create Content</div>
						<div className="text-muted text-sm">
							Buat artikel atau berita baru
						</div>
					</div>
				</a>

				<a
					href="/app/categories"
					className="feature-card flex items-center gap-4"
				>
					<Database className="w-6 h-6 text-[#171717] dark:text-[#ededed]" />
					<div>
						<div className="feature-card-title">Manage Categories</div>
						<div className="text-muted text-sm">Tambahkan / edit kategori</div>
					</div>
				</a>

				<a href="/app/users" className="feature-card flex items-center gap-4">
					<Users className="w-6 h-6 text-[#171717] dark:text-[#ededed]" />
					<div>
						<div className="feature-card-title">Manage Users</div>
						<div className="text-muted text-sm">Lihat dan kelola user</div>
					</div>
				</a>

				<a
					href="/app/audit/login-logs"
					className="feature-card flex items-center gap-4"
				>
					<LogIn className="w-6 h-6 text-[#171717] dark:text-[#ededed]" />
					<div>
						<div className="feature-card-title">Login Audit Log</div>
						<div className="text-muted text-sm">
							Lihat historis login semua user
						</div>
					</div>
				</a>
			</div>
		</>
	);
}
