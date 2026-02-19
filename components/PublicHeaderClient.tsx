"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useLayoutEffect } from "react";
import { Sun, Moon, ChevronDown } from "lucide-react";

interface NavigationItem {
	id: number;
	label: string;
	url: string;
	parentId: number | null;
	order: number;
	icon: string | null;
	target: string;
	isActive: boolean;
	children?: NavigationItem[];
}

interface PublicHeaderClientProps {
	navigationItems: NavigationItem[];
	isNavEnabled: boolean;
	logo?: string;
}

export default function PublicHeaderClient({
	navigationItems,
	isNavEnabled,
	logo,
}: PublicHeaderClientProps) {
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [theme, setTheme] = useState<"light" | "dark">("light");

	useLayoutEffect(() => {
		const savedTheme =
			typeof window !== "undefined" ? localStorage.getItem("theme") : null;
		const prefersDark =
			typeof window !== "undefined" &&
			window.matchMedia &&
			window.matchMedia("(prefers-color-scheme: dark)").matches;
		const initialTheme =
			(savedTheme as "light" | "dark" | null) ||
			(prefersDark ? "dark" : "light");
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setTheme(initialTheme);

		// Ensure document class matches (RootLayout script sets this early on first paint)
		if (initialTheme === "dark") {
			document.documentElement.classList.add("dark");
			document.documentElement.style.colorScheme = "dark";
		} else {
			document.documentElement.classList.remove("dark");
			document.documentElement.style.colorScheme = "light";
		}
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		try {
			if (newTheme === "dark") {
				document.documentElement.classList.add("dark");
				document.documentElement.style.colorScheme = "dark";
			} else {
				document.documentElement.classList.remove("dark");
				document.documentElement.style.colorScheme = "light";
			}
			localStorage.setItem("theme", newTheme);
		} catch (e) {
			console.error(e);
		}
	};

	const isActive = (href: string) => {
		if (href === "/") {
			return pathname === "/";
		}
		return pathname.startsWith(href);
	};

	const renderNavItems = (items: NavigationItem[], isMobile = false) => {
		if (!isNavEnabled || items.length === 0) {
			return null;
		}

		// Filter for parent items only (where parentId is null)
		const parentItems = items.filter((item) => item.parentId === null);

		if (parentItems.length === 0) {
			return null;
		}

		return parentItems.map((item) => {
			const hasChildren = item.children && item.children.length > 0;

			if (isMobile) {
				return (
					<div key={item.id}>
						<Link
							href={item.url}
							className={`block py-2 transition-colors ${
								isActive(item.url)
									? "text-primary font-semibold"
									: "text-foreground hover:text-primary"
							}`}
							onClick={() => setMobileMenuOpen(false)}
							target={item.target}
						>
							{item.label}
						</Link>
						{hasChildren && (
							<div className="ml-4 space-y-2">
								{item.children
									?.filter((child) => child.isActive)
									.map((child) => (
										<Link
											key={child.id}
											href={child.url}
											className={`block py-2 text-sm transition-colors ${
												isActive(child.url)
													? "text-primary font-semibold"
													: "text-foreground hover:text-primary"
											}`}
											onClick={() => setMobileMenuOpen(false)}
											target={child.target}
										>
											{child.label}
										</Link>
									))}
							</div>
						)}
					</div>
				);
			}

			// Desktop view
			return (
				<div key={item.id} className="relative group">
					<Link
						href={item.url}
						className={`flex items-center gap-1 transition-colors ${
							isActive(item.url)
								? "text-primary font-semibold"
								: "text-foreground hover:text-primary"
						}`}
						target={item.target}
					>
						{item.label}
						{hasChildren && <ChevronDown size={16} />}
					</Link>

					{/* Desktop Dropdown */}
					{hasChildren && (
						<div className="absolute left-0 mt-0 w-48 bg-white dark:bg-[#282828] border border-gray-200 dark:border-[#3a3a3a] rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
							{item.children
								?.filter((child) => child.isActive)
								.map((child) => (
									<Link
										key={child.id}
										href={child.url}
										className={`block px-4 py-2 first:rounded-t-md last:rounded-b-md hover:bg-gray-100 dark:hover:bg-[#3a3a3a] transition-colors text-sm ${
											isActive(child.url)
												? "text-primary font-semibold"
												: "text-foreground"
										}`}
										target={child.target}
									>
										{child.label}
									</Link>
								))}
						</div>
					)}
				</div>
			);
		});
	};

	return (
		<header className="sticky top-0 z-50 border-b bg-white dark:bg-[#1a1a1a] shadow-sm dark:border-[#3a3a3a]">
			<nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link href="/" className="flex items-center space-x-2">
						{logo ? (
							<img src={logo} alt="Site Logo" className="h-10 w-auto" />
						) : (
							<span className="text-2xl font-bold text-primary">NextCMS</span>
						)}
					</Link>

					{/* Desktop Navigation */}
					{isNavEnabled && navigationItems && navigationItems.length > 0 && (
						<div className="hidden md:flex items-center space-x-8">
							{navigationItems.map(
								(item) =>
									item.parentId === null &&
									item.isActive && (
										<Link
											key={item.id}
											href={item.url}
											className="text-foreground hover:text-primary transition-colors"
											target={item.target}
										>
											{item.label}
										</Link>
									),
							)}

							<button
								onClick={toggleTheme}
								className="p-2 text-gray-600 dark:text-[#929292] hover:text-gray-900 dark:hover:text-[#e5e5e5] hover:bg-gray-100 dark:hover:bg-[#323232] rounded-md transition-colors"
								title={
									theme === "light"
										? "Switch to dark mode"
										: "Switch to light mode"
								}
								aria-label="Toggle theme"
							>
								{theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
							</button>
						</div>
					)}

					{/* Fallback: Show when nav disabled or no items */}
					{(!isNavEnabled ||
						!navigationItems ||
						navigationItems.length === 0) && (
						<div className="hidden md:flex items-center space-x-4">
							<button
								onClick={toggleTheme}
								className="p-2 text-gray-600 dark:text-[#929292] hover:text-gray-900 dark:hover:text-[#e5e5e5] hover:bg-gray-100 dark:hover:bg-[#323232] rounded-md transition-colors"
								title={
									theme === "light"
										? "Switch to dark mode"
										: "Switch to light mode"
								}
								aria-label="Toggle theme"
							>
								{theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
							</button>
						</div>
					)}

					{/* Mobile Menu Button */}
					<button
						className="md:hidden p-2"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					>
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
				</div>

				{/* Mobile Navigation */}
				{isNavEnabled && mobileMenuOpen && (
					<div className="md:hidden pb-4 space-y-2">
						{renderNavItems(navigationItems, true)}

						<button
							className="w-full text-left py-2 text-foreground hover:text-primary"
							onClick={() => {
								toggleTheme();
								setMobileMenuOpen(false);
							}}
						>
							{theme === "light" ? "Dark mode" : "Light mode"}
						</button>
					</div>
				)}
			</nav>
		</header>
	);
}
