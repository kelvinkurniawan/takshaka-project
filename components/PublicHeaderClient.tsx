"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useLayoutEffect } from "react";
import {
	Sun,
	Moon,
	ChevronDown,
	Search,
	Users,
	Menu,
	X,
	Phone,
} from "lucide-react";

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
	desktopNavigationItems: NavigationItem[];
	mobileNavigationItems: NavigationItem[];
	isNavEnabled: boolean;
	logo?: string;
	contactPhone?: string;
}

export default function PublicHeaderClient({
	desktopNavigationItems,
	mobileNavigationItems,
	isNavEnabled,
	contactPhone,
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

	return (
		<header className="sticky top-0 z-50  bg-[#E6E6E6] shadow-sm font-work-sans-400">
			<nav className="mx-auto px-0 sm:px-6 lg:px-8">
				<div className="items-center justify-between h-12 text-sm px-4 sm:px-0 hidden md:flex">
					{/* Logo */}
					<Link
						href="/"
						prefetch={false}
						className="flex items-center space-x-2 uppercase tracking-widest"
					>
						<Users size={18} />
						<span className="text-xs">
							CONTACT US | {contactPhone || "+62 361 123456"}
						</span>
					</Link>
					{/* Desktop Navigation */}
					{isNavEnabled &&
						desktopNavigationItems &&
						desktopNavigationItems.length > 0 && (
							<div className="hidden md:flex items-center space-x-8">
								{desktopNavigationItems.map(
									(item) =>
										item.parentId === null &&
										item.isActive && (
											<Link
												key={item.id}
												href={item.url}
												prefetch={false}
												className="text-foreground hover:text-primary transition-colors uppercase tracking-wider text-xs"
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
				</div>

				<div className="items-center justify-between h-12 text-sm px-4 sm:px-0 flex md:hidden ">
					{/* Logo */}
					<Link
						href="/"
						prefetch={false}
						className="flex items-center space-x-2 uppercase tracking-widest justify-between"
					>
						<img src="images/logo-mob.png" alt="Logo" className="h-6 w-auto" />
					</Link>
					{/* Desktop Navigation */}

					<div className="uppercase tracking-widest flex items-center space-x-2 text-[10px]">
						Let's Connected
						<div className="border rounded-full border-black text-black w-6 h-6 flex items-center justify-center ms-2">
							<Phone size={10} className="inline-block " />
						</div>
					</div>
				</div>

				<div className="md:hidden flex justify-between bg-black px-4 py-4">
					<button
						onClick={() => {
							setSearchOpen(true);
							setMobileMenuOpen(false);
						}}
						className="text-white"
						aria-label="Search"
					>
						<Search size={14} />
					</button>

					{/* Mobile Menu Button */}
					<button
						className="md:hidden text-white transition-transform duration-300 ease-in-out"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						aria-label="Toggle menu"
						style={{
							transform: mobileMenuOpen ? "rotate(90deg)" : "rotate(0deg)",
						}}
					>
						{mobileMenuOpen ? <X size={14} /> : <Menu size={14} />}
					</button>
				</div>

				{/* Mobile Menu - Use mobile navigation items */}
				{mobileMenuOpen && (
					<div className="md:hidden h-full fixed top-[94px] left-0 bg-[#E6E6E6] backdrop-blur-sm w-full z-40 animate-in fade-in slide-in-from-top-2 duration-300 ease-out max-h-[calc(100vh-4rem)] overflow-y-auto">
						<div className="py-2">
							{mobileNavigationItems.map((item, idx) =>
								item.parentId === null && item.isActive ? (
									<div
										key={item.id}
										className="animate-in fade-in slide-in-from-top-2 duration-300 ease-out px-4 border-b border-gray-400 py-2"
										style={{ animationDelay: `${idx * 50}ms` }}
									>
										<Link
											href={item.url}
											prefetch={false}
											className={`text-xs transition-colors font-minionpro-400 uppercase tracking-wider ${
												isActive(item.url) ? "text-gray-700" : "text-dark"
											}`}
											onClick={() => setMobileMenuOpen(false)}
											target={item.target}
										>
											{item.label}
										</Link>
										{item.children && item.children.length > 0 && (
											<div className="ml-0 space-y-0">
												{item.children
													.filter((child) => child.isActive)
													.map((child) => (
														<Link
															key={child.id}
															prefetch={false}
															href={child.url}
															className={`block py-2 px-4 ml-4 text-sm transition-colors  border-gray-300 pl-3 ${
																isActive(child.url)
																	? "text-primary font-semibold"
																	: "text-gray-600 hover:text-primary"
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
								) : null,
							)}
						</div>
					</div>
				)}

				{/* Popup search form */}
				{searchOpen && (
					<div
						className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
						onClick={() => setSearchOpen(false)}
					>
						<div
							className="bg-white dark:bg-[#1a1a1a] p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-2xl"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex items-center justify-between mb-6 md:mb-8">
								<h2 className="text-xl md:text-3xl font-semibold text-foreground">
									<Search
										size={24}
										className="inline-block mr-2 mb-1 md:mb-2 md:size-8"
									/>
									Search
								</h2>
								<button
									onClick={() => setSearchOpen(false)}
									className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 text-2xl md:text-3xl leading-none"
									aria-label="Close search"
								>
									&times;
								</button>
							</div>
							<input
								type="text"
								placeholder="Cari artikel, halaman, atau konten..."
								className="w-full p-3 md:p-4 border border-gray-300 dark:border-[#3a3a3a] rounded-md bg-white dark:bg-[#282828] text-foreground text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-primary"
								autoFocus
							/>
							<p className="mt-3 md:mt-4 text-sm md:text-base text-gray-500 dark:text-gray-400">
								Tekan Enter untuk mencari atau ESC untuk menutup
							</p>
						</div>
					</div>
				)}
			</nav>
		</header>
	);
}
