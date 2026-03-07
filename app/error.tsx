"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Users } from "lucide-react";

interface ErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
	useEffect(() => {
		// Log error details for monitoring
		console.error("Application Error:", error);
	}, [error]);

	return (
		<>
			{/* Simple Header */}
			<header className="sticky top-0 z-50 border-b bg-white shadow-sm">
				<nav className="mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16 text-sm">
						<Link
							href="/"
							className="flex items-center space-x-2 hover:opacity-80 transition"
						>
							<Users size={18} />
							<span className="text-sm font-medium">
								CONTACT US | +62 361 123456
							</span>
						</Link>
						<Link
							href="/"
							className="text-foreground hover:text-primary transition-colors uppercase tracking-wider text-sm font-medium hidden sm:block"
						>
							Home
						</Link>
					</div>
				</nav>
			</header>

			<div className="public-light flex flex-col min-h-screen bg-[#fff8f5] text-gray-900">
				<main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 md:py-24">
					<div className="w-full max-w-3xl text-center">
						{/* Error Icon */}
						<div className="mb-8">
							<div className="text-6xl sm:text-7xl md:text-8xl mb-4 inline-block">
								⚠️
							</div>
							<div className="h-1 w-24 bg-gradient-to-r from-red-600 to-red-400 mx-auto mb-8"></div>
						</div>

						{/* Error Message */}
						<h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-wider mb-6 text-gray-900">
							Oops! Something Went Wrong
						</h2>

						<p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed max-w-2xl mx-auto">
							We encountered an unexpected error while processing your request.
							Our team has been notified and is working to fix the issue.
						</p>

						{/* Error Details (Development Only) */}
						{process.env.NODE_ENV === "development" && error.message && (
							<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-left">
								<p className="text-sm font-semibold text-red-900 mb-2">
									Error Details:
								</p>
								<p className="text-xs text-red-800 font-mono break-words">
									{error.message}
								</p>
								{error.digest && (
									<p className="text-xs text-red-700 mt-2">
										<span className="font-semibold">Error ID:</span>{" "}
										{error.digest}
									</p>
								)}
							</div>
						)}

						{/* Info Box */}
						<div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 mb-8">
							<h3 className="text-lg font-medium text-gray-900 mb-4">
								What You Can Do:
							</h3>
							<ul className="text-left space-y-3 text-gray-600">
								<li className="flex items-start">
									<span className="mr-3 text-amber-600 font-bold">✓</span>
									<span>Try refreshing the page after a few moments</span>
								</li>
								<li className="flex items-start">
									<span className="mr-3 text-amber-600 font-bold">✓</span>
									<span>Clear your browser cache and cookies</span>
								</li>
								<li className="flex items-start">
									<span className="mr-3 text-amber-600 font-bold">✓</span>
									<span>Contact our support team if the issue persists</span>
								</li>
								<li className="flex items-start">
									<span className="mr-3 text-amber-600 font-bold">✓</span>
									<span>Return to the homepage to continue browsing</span>
								</li>
							</ul>
						</div>

						{/* Action Buttons */}
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<button
								onClick={reset}
								className="inline-block bg-amber-600 text-white px-8 md:px-12 py-3 rounded-full font-semibold hover:bg-amber-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm md:text-base"
							>
								TRY AGAIN
							</button>
							<Link
								href="/"
								className="inline-block border-2 border-gray-900 text-gray-900 px-8 md:px-12 py-3 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition duration-300 text-sm md:text-base"
							>
								GO HOME
							</Link>
						</div>

						{/* Support Links */}
						<div className="mt-16 pt-8 border-t border-gray-200">
							<p className="text-xs md:text-sm text-gray-400 mb-6">
								Need assistance?
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-gray-600">
								<a
									href="mailto:support@takshaka.com"
									className="hover:text-amber-600 transition-colors text-sm"
								>
									📧 Email Support
								</a>
								<span className="hidden sm:inline text-gray-300">•</span>
								<a
									href="tel:+62361123456"
									className="hover:text-amber-600 transition-colors text-sm"
								>
									📞 +62 361 123456
								</a>
								<span className="hidden sm:inline text-gray-300">•</span>
								<Link
									href="/hubungi"
									className="hover:text-amber-600 transition-colors text-sm"
								>
									💬 Contact Form
								</Link>
							</div>
						</div>
					</div>
				</main>

				{/* Simple Footer for Error Page */}
				<footer className="border-t border-gray-200 bg-white">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
						<p className="text-center text-sm text-gray-500">
							Copyright © 2026. Takshaka Event & Experience. All rights
							reserved.
						</p>
					</div>
				</footer>
			</div>
		</>
	);
}
