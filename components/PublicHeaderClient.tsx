"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useLayoutEffect } from "react";
import { Sun, Moon, ChevronDown, Search, Users, Menu } from "lucide-react";

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
}: PublicHeaderClientProps) {
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [theme, setTheme] = useState<"light" | "dark">("light");
	const [searchOpen, setSearchOpen] = useState(false);

	useLayoutEffect(() => {
		const initialTheme = "light";
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setTheme(initialTheme);
		document.documentElement.classList.remove("dark");
		document.documentElement.style.colorScheme = "light";
	}, []);

	// Force light mode for public pages
	useEffect(() => {
		document.documentElement.classList.remove("dark");
		document.documentElement.style.colorScheme = "light";
	}, []);

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
			<nav className="mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16 text-sm">
					{/* Logo */}
					<Link href="/" className="flex items-center space-x-2">
						<Users size={18} />
						<span>CONTACT US | +62 361 123456</span>
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
											className="text-foreground hover:text-primary transition-colors uppercase tracking-wider text-sm font-medium"
											target={item.target}
										>
											{item.label}
										</Link>
									),
							)}
							<button
								onClick={() => setSearchOpen(!searchOpen)}
								className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
								title="Search"
								aria-label="Search"
							>
								<Search size={20} />
							</button>
						</div>
					)}

					{/* Mobile Menu Button */}
					<button
						className="md:hidden p-2"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					>
						<Menu size={24} />
					</button>
				</div>

				{/* Popup search form */}
				{searchOpen && (
					<div
						className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
						onClick={() => setSearchOpen(false)}
					>
						<div
							className="bg-white dark:bg-[#1a1a1a] p-8 rounded-lg shadow-2xl w-full max-w-2xl"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex items-center justify-between mb-8">
								<h2 className="text-3xl font-semibold text-foreground">
									<Search size={32} className="inline-block mr-2 mb-2" />
									Search
								</h2>
								<button
									onClick={() => setSearchOpen(false)}
									className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 text-3xl leading-none"
									aria-label="Close search"
								>
									&times;
								</button>
							</div>
							<input
								type="text"
								placeholder="Cari artikel, halaman, atau konten..."
								className="w-full p-4 border border-gray-300 dark:border-[#3a3a3a] rounded-md bg-white dark:bg-[#282828] text-foreground text-lg focus:outline-none focus:ring-2 focus:ring-primary"
								autoFocus
							/>
							<p className="mt-4 text-base text-gray-500 dark:text-gray-400">
								Tekan Enter untuk mencari atau ESC untuk menutup
							</p>
						</div>
					</div>
				)}
			</nav>
		</header>
	);
}
