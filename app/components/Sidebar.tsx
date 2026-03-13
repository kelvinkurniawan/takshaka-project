"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	LogOut,
	Home,
	FolderOpen,
	Users,
	FileText,
	Settings,
	Menu,
	X,
	Sun,
	Moon,
	Plus,
	Image,
	File,
	Navigation,
	Brush,
	MessageSquare,
	Layers,
	HelpCircle,
	BarChart3,
} from "lucide-react";

type Theme = "light" | "dark";

interface UserData {
	id: number;
	name: string;
	email: string;
	role?: string;
}

interface SidebarProps {
	user: UserData;
	sidebarOpen: boolean;
	setSidebarOpen: (open: boolean) => void;
	onLogout: () => void;
	isLoggingOut: boolean;
	theme: Theme;
	onToggleTheme: () => void;
}

export default function Sidebar({
	user,
	sidebarOpen,
	setSidebarOpen,
	onLogout,
	isLoggingOut,
	theme,
	onToggleTheme,
}: SidebarProps) {
	const pathname = usePathname();

	// Get initials for avatar
	const getInitials = (name?: string | null) => {
		if (!name) return "U";
		return name
			.split(" ")
			.map((part) => part[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const navGroups = [
		{
			title: "Dashboard",
			items: [{ icon: Home, label: "Dashboard", href: "/app/dashboard" }],
		},
		{
			title: "Analytics",
			items: [{ icon: BarChart3, label: "Analytics", href: "/app/analytics" }],
		},
		{
			title: "Content Management",
			items: [
				{ icon: Plus, label: "New Content", href: "/app/content/create" },
				{ icon: FileText, label: "All Content", href: "/app/content" },
				{ icon: FolderOpen, label: "Categories", href: "/app/categories" },
				{ icon: Image, label: "Media Library", href: "/app/media" },
				{ icon: File, label: "Pages", href: "/app/pages" },
				{
					icon: Layers,
					label: "Section Management",
					href: "/app/page-sections",
				},
				{ icon: MessageSquare, label: "Comments", href: "/app/comments" },
				{ icon: HelpCircle, label: "FAQ Management", href: "/app/faq" },
				{
					icon: MessageSquare,
					label: "Contact Submissions",
					href: "/app/contact-submissions",
				},
			],
		},
		{
			title: "Gallery & Portfolio",
			items: [
				{
					icon: Image,
					label: "Gallery of Works",
					href: "/app/gallery-of-works",
				},
			],
		},
		{
			title: "User Management",
			items: [{ icon: Users, label: "Users", href: "/app/users" }],
		},
		{
			title: "Audit & Logs",
			items: [
				{
					icon: BarChart3,
					label: "Login Audit Log",
					href: "/app/audit/login-logs",
				},
			],
		},
		{
			title: "Appearance",
			items: [
				{
					icon: Navigation,
					label: "Navigation",
					href: "/app/appearance/navigation",
				},
				{ icon: Brush, label: "Theme", href: "/app/appearance/theme" },
			],
		},
		{
			title: "Settings",
			items: [{ icon: Settings, label: "Settings", href: "/app/settings" }],
		},
	];

	const isActive = (href: string) => pathname === href;

	return (
		<div
			className={`sidebar ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
		>
			{/* Logo */}
			<div className="sidebar-logo">
				<div className="sidebar-logo-content">
					<img
						src="/images/logo_colored.png"
						alt="Takshaka Logo"
						className="w-auto h-12"
					/>
				</div>
			</div>

			{/* Navigation */}
			<nav className="sidebar-nav">
				{navGroups.map((group) => (
					<div key={group.title} className="sidebar-nav-group">
						{sidebarOpen && (
							<h3 className="sidebar-group-title">{group.title}</h3>
						)}
						{group.items.map((item) => (
							<Link
								key={item.label}
								href={item.href}
								className={`sidebar-nav-item group ${
									isActive(item.href)
										? "text-gray-900 dark:text-white bg-gray-200 dark:bg-[#323232]"
										: ""
								}`}
							>
								<item.icon className="sidebar-nav-icon group-hover:text-blue-400" />
								{sidebarOpen && (
									<span className="sidebar-nav-label">{item.label}</span>
								)}
							</Link>
						))}
					</div>
				))}
			</nav>

			{/* User Menu */}
			<div className="sidebar-user">
				<Link
					href="/app/profile"
					className="sidebar-user-profile hover:bg-gray-100 dark:hover:bg-[#323232] rounded-md transition-colors"
				>
					<div className="sidebar-user-avatar">
						<span className="sidebar-user-avatar-text">
							{getInitials(user.name)}
						</span>
					</div>
					{sidebarOpen && (
						<div className="sidebar-user-info">
							<p className="sidebar-user-name">{user.name}</p>
							<p className="sidebar-user-email">{user.email}</p>
						</div>
					)}
				</Link>
				<button
					onClick={onLogout}
					disabled={isLoggingOut}
					className="sidebar-logout-btn"
				>
					<LogOut className="sidebar-logout-icon" />
					{sidebarOpen && <span className="sidebar-logout-text">Logout</span>}
				</button>
			</div>

			{/* Theme Toggle & Sidebar Toggle */}
			<div className="sidebar-footer">
				<button
					onClick={onToggleTheme}
					className="sidebar-theme-btn"
					title={theme === "light" ? "Dark mode" : "Light mode"}
				>
					{theme === "light" ? (
						<Moon className="sidebar-theme-icon" />
					) : (
						<Sun className="sidebar-theme-icon" />
					)}
					{sidebarOpen && (
						<span className="sidebar-theme-text">
							{theme === "light" ? "Dark" : "Light"}
						</span>
					)}
				</button>
				<button
					onClick={() => setSidebarOpen(!sidebarOpen)}
					className="sidebar-toggle-btn"
				>
					{sidebarOpen ? (
						<X className="sidebar-toggle-icon" />
					) : (
						<Menu className="sidebar-toggle-icon" />
					)}
				</button>
			</div>
		</div>
	);
}
