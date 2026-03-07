"use client";

import { LayoutDashboard, Database, Users, FileText } from "lucide-react";

interface Totals {
	contents: number;
	users: number;
	categories: number;
}

export default function DashboardClient({
	totals,
	hasError,
}: {
	totals: Totals;
	hasError?: boolean;
}) {
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
							<div className="stat-card-value">{totals.contents}</div>
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
							<div className="stat-card-value">{totals.users}</div>
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
							<div className="stat-card-value">{totals.categories}</div>
							<div className="text-muted text-sm mt-1">Content categories</div>
						</div>
						<div className="stat-card-icon-wrapper stat-card-icon-wrapper-purple">
							<FileText className="stat-card-icon stat-card-icon-purple" />
						</div>
					</div>
				</div>
			</div>

			{/* Quick Actions (use existing feature styles from globals.css) */}
			<div className="features-grid mt-6">
				<a
					href="/app/content/create"
					className="feature-card flex items-center gap-4"
				>
					<FileText className="w-6 h-6 text-blue-600" />
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
					<Database className="w-6 h-6 text-indigo-600" />
					<div>
						<div className="feature-card-title">Manage Categories</div>
						<div className="text-muted text-sm">Tambahkan / edit kategori</div>
					</div>
				</a>

				<a href="/app/users" className="feature-card flex items-center gap-4">
					<Users className="w-6 h-6 text-purple-600" />
					<div>
						<div className="feature-card-title">Manage Users</div>
						<div className="text-muted text-sm">Lihat dan kelola user</div>
					</div>
				</a>
			</div>
		</>
	);
}
