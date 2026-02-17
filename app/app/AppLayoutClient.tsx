"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import { Bell, User, LogOut, Sun, Moon } from "lucide-react";

type Theme = "light" | "dark";

interface AppLayoutClientProps {
  children: React.ReactNode;
}

export default function AppLayoutClient({ children }: AppLayoutClientProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<Theme>("light");
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  // Load theme preference from localStorage on mount
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
        // Redirect to login page
        router.push("/secure-access");
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
      {/* Sidebar Component */}
      <Sidebar
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
            <button className="p-2 text-gray-600 dark:text-[#929292] hover:text-gray-900 dark:hover:text-[#e5e5e5] hover:bg-gray-100 dark:hover:bg-[#323232] rounded-md transition-colors">
              <Bell size={20} />
            </button>
            <button className="p-2 text-gray-600 dark:text-[#929292] hover:text-gray-900 dark:hover:text-[#e5e5e5] hover:bg-gray-100 dark:hover:bg-[#323232] rounded-md transition-colors">
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
