"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import { Bell, User, LogOut, Sun, Moon } from "lucide-react";

type Theme = "light" | "dark";

interface UserData {
	id: number;
	name: string;
	email: string;
	role?: string;
}

interface AppLayoutClientProps {
	children: React.ReactNode;
	user: UserData;
}

export default function AppLayoutClient({
	children,
	user,
}: AppLayoutClientProps) {
	const router = useRouter();
	const pathname = usePathname();
	const [isPending, startTransition] = useTransition();
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [theme, setTheme] = useState<Theme>("light");
	const [isThemeLoaded, setIsThemeLoaded] = useState(false);

	// Top progress bar state
	const [progress, setProgress] = useState<number>(0);
	const [progressVisible, setProgressVisible] = useState<boolean>(false);

	// Use refs to track pathname and timers
	const previousPathnameRef = useRef<string>("");
	const timersRef = useRef<NodeJS.Timeout[]>([]);
	const isFirstRenderRef = useRef(true);

	// Apply theme to document
	const applyTheme = (newTheme: Theme) => {
		const root = document.documentElement;
		if (newTheme === "dark") {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}
		localStorage.setItem("theme", newTheme);
	};

	// Load theme preference from localStorage on mount ONLY
	useEffect(() => {
		const savedTheme = localStorage.getItem("theme") as Theme | null;
		const prefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)",
		).matches;
		const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

		setTheme(initialTheme);
		applyTheme(initialTheme);
		setIsThemeLoaded(true);
	}, []);

	// Show progress bar when pathname changes
	useEffect(() => {
		// On first render, just initialize the ref
		if (isFirstRenderRef.current) {
			previousPathnameRef.current = pathname;
			isFirstRenderRef.current = false;
			return;
		}

		// Clear any existing timers
		timersRef.current.forEach((timer) => clearTimeout(timer));
		timersRef.current = [];

		// Route changed - show progress bar immediately
		setProgressVisible(true);
		setProgress(30);

		// Animation timeline
		const timer1 = setTimeout(() => setProgress(80), 150);
		timersRef.current.push(timer1);

		const timer2 = setTimeout(() => {
			setProgress(100);
		}, 400);
		timersRef.current.push(timer2);

		const timer3 = setTimeout(() => {
			setProgressVisible(false);
			setProgress(0);
		}, 600);
		timersRef.current.push(timer3);

		// Update ref
		previousPathnameRef.current = pathname;
	}, [pathname]);

	// Cleanup timers on unmount
	useEffect(() => {
		return () => {
			timersRef.current.forEach((timer) => clearTimeout(timer));
		};
	}, []);

	// Toggle theme
	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		applyTheme(newTheme);
	};

	const handleLogout = async () => {
		setIsLoggingOut(true);
		try {
			const response = await fetch("/api/auth/logout", {
				method: "POST",
			});

			if (response.ok) {
				// Redirect to login page in transition
				startTransition(() => {
					router.push("/secure-access");
				});
			}
		} catch (err) {
			console.error("Logout error:", err);
		} finally {
			setIsLoggingOut(false);
		}
	};

	if (!isThemeLoaded) {
		return null;
	}

	return (
		<div className="dashboard-container">
			{/* top page transition loader */}
			<div
				className={`top-progress ${progressVisible ? "visible" : ""}`}
				aria-hidden
			>
				<div className="top-progress-bar" style={{ width: `${progress}%` }} />
			</div>

			{/* Sidebar Component */}
			<Sidebar
				user={user}
				sidebarOpen={sidebarOpen}
				setSidebarOpen={setSidebarOpen}
				onLogout={handleLogout}
				isLoggingOut={isLoggingOut}
				theme={theme}
				onToggleTheme={toggleTheme}
			/>

			{/* Main Content */}
			<div className="dashboard-content">
				{/* Top Header */}
				<header className="dashboard-header">
					<div className="flex-1 max-w-md">
						<div className="relative">
							<input
								type="text"
								placeholder="search anything"
								className="w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-[#525252] rounded-md bg-white dark:bg-[#323232] text-gray-900 dark:text-[#e5e5e5] placeholder-gray-500 dark:placeholder-[#828282] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
					</div>

					<div className="flex items-center space-x-3">
						<button
							onClick={toggleTheme}
							className="p-2 text-gray-600 dark:text-[#929292] hover:text-gray-900 dark:hover:text-[#e5e5e5] hover:bg-gray-100 dark:hover:bg-[#323232] rounded-md transition-colors"
							title={
								theme === "light"
									? "Switch to dark mode"
									: "Switch to light mode"
							}
						>
							{theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
						</button>
						<button
							onClick={() => router.push("/app/notifications")}
							className="p-2 text-gray-600 dark:text-[#929292] hover:text-gray-900 dark:hover:text-[#e5e5e5] hover:bg-gray-100 dark:hover:bg-[#323232] rounded-md transition-colors"
							title="View notifications"
						>
							<Bell size={20} />
						</button>
						<button
							onClick={() => router.push("/app/profile")}
							className="p-2 text-gray-600 dark:text-[#929292] hover:text-gray-900 dark:hover:text-[#e5e5e5] hover:bg-gray-100 dark:hover:bg-[#323232] rounded-md transition-colors"
							title="View profile"
						>
							<User size={20} />
						</button>
						<button
							onClick={handleLogout}
							disabled={isLoggingOut}
							className="p-2 text-gray-600 dark:text-[#929292] hover:text-gray-900 dark:hover:text-[#e5e5e5] hover:bg-gray-100 dark:hover:bg-[#323232] rounded-md transition-colors disabled:opacity-50"
						>
							<LogOut size={20} />
						</button>
					</div>
				</header>

				{/* Main Area */}
				<main className="dashboard-main">
					<div className="dashboard-content-wrapper">{children}</div>
				</main>
			</div>
		</div>
	);
}
