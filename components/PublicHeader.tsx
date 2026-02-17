"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          </div>
        )}
      </nav>
    </header>
  );
}
