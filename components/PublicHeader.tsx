"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function PublicHeader() {
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [theme, setTheme] = useState<"light" | "dark">("light");

	useEffect(() => {
		const savedTheme =
			typeof window !== "undefined" ? localStorage.getItem("theme") : null;
		const prefersDark =
			typeof window !== "undefined" &&
			window.matchMedia &&
			window.matchMedia("(prefers-color-scheme: dark)").matches;
		const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
		setTheme(initialTheme as "light" | "dark");

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

	return (
		<header className="sticky top-0 z-50 border-b bg-white shadow-sm">
			<nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link href="/" className="flex items-center space-x-2">
						<span className="text-2xl font-bold text-primary">NextCMS</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-8">
						<Link
							href="/"
							className={`transition-colors ${
								pathname === "/"
									? "text-primary font-semibold"
									: "text-foreground hover:text-primary"
							}`}
						>
							Beranda
						</Link>
						<Link
							href="/blog"
							className={`transition-colors ${
								pathname === "/blog"
									? "text-primary font-semibold"
									: "text-foreground hover:text-primary"
							}`}
						>
							Blog
						</Link>
						<Link
							href="/tentang"
							className={`transition-colors ${
								pathname === "/tentang"
									? "text-primary font-semibold"
									: "text-foreground hover:text-primary"
							}`}
						>
							Tentang Kami
						</Link>
						<Link
							href="/hubungi"
							className={`transition-colors ${
								pathname === "/hubungi"
									? "text-primary font-semibold"
									: "text-foreground hover:text-primary"
							}`}
						>
							Hubungi
						</Link>

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
				{mobileMenuOpen && (
					<div className="md:hidden pb-4 space-y-2">
						<Link
							href="/"
							className="block py-2 text-foreground hover:text-primary"
							onClick={() => setMobileMenuOpen(false)}
						>
							Beranda
						</Link>
						<Link
							href="/blog"
							className="block py-2 text-foreground hover:text-primary"
							onClick={() => setMobileMenuOpen(false)}
						>
							Blog
						</Link>
						<Link
							href="/tentang"
							className="block py-2 text-foreground hover:text-primary"
							onClick={() => setMobileMenuOpen(false)}
						>
							Tentang Kami
						</Link>
						<Link
							href="/hubungi"
							className="block py-2 text-foreground hover:text-primary"
							onClick={() => setMobileMenuOpen(false)}
						>
							Hubungi
						</Link>

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
