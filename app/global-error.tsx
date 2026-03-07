"use client";

import Link from "next/link";
import { useEffect } from "react";

interface GlobalErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
	useEffect(() => {
		// Log to external error reporting service if available
		console.error("Global Error:", error);
	}, [error]);

	return (
		<html>
			<body>
				<div className="flex flex-col min-h-screen bg-[#fff8f5] text-gray-900">
					<main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 md:py-24">
						<div className="w-full max-w-3xl text-center">
							{/* Error Icon */}
							<div className="mb-8">
								<div className="text-6xl sm:text-7xl md:text-8xl mb-4 inline-block">
									⚠️
								</div>
								<div className="h-1 w-24 bg-gradient-to-r from-red-600 to-red-400 mx-auto mb-8"></div>
							</div>

							{/* Error Title */}
							<h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-wider mb-6 text-gray-900">
								Critical System Error
							</h1>

							<p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed max-w-2xl mx-auto">
								We're experiencing technical difficulties. Our team has been
								notified and is working hard to restore service. We apologize
								for the inconvenience.
							</p>

							{/* Error Details (Development Only) */}
							{process.env.NODE_ENV === "development" && error?.message && (
								<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-left">
									<p className="text-sm font-semibold text-red-900 mb-2">
										System Error Details:
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

							{/* Status Info */}
							<div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 mb-8">
								<h3 className="text-lg font-medium text-gray-900 mb-4">
									System Status:
								</h3>
								<p className="text-gray-600 text-sm mb-4">
									If this problem persists, please check back shortly. You can
									also:
								</p>
								<ul className="text-left space-y-2 text-gray-600 text-sm">
									<li className="flex items-start">
										<span className="mr-3 text-amber-600">•</span>
										<span>Refresh your browser</span>
									</li>
									<li className="flex items-start">
										<span className="mr-3 text-amber-600">•</span>
										<span>Clear your browser cache</span>
									</li>
									<li className="flex items-start">
										<span className="mr-3 text-amber-600">•</span>
										<span>Try again in a few moments</span>
									</li>
								</ul>
							</div>

							{/* Action Buttons */}
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<button
									onClick={reset}
									className="inline-block bg-amber-600 text-white px-8 md:px-12 py-3 rounded-full font-semibold hover:bg-amber-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm md:text-base"
								>
									RELOAD PAGE
								</button>
								<Link
									href="/"
									className="inline-block border-2 border-gray-900 text-gray-900 px-8 md:px-12 py-3 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition duration-300 text-sm md:text-base"
								>
									GO HOME
								</Link>
							</div>

							{/* Contact Info */}
							<div className="mt-12 pt-8 border-t border-gray-200">
								<p className="text-xs md:text-sm text-gray-500 mb-4">
									If you continue to experience issues:
								</p>
								<div className="text-sm text-gray-600">
									<p className="mb-1">
										📧{" "}
										<a
											href="mailto:support@takshaka.com"
											className="hover:text-amber-600 transition-colors"
										>
											support@takshaka.com
										</a>
									</p>
									<p>
										📞{" "}
										<a
											href="tel:+62361123456"
											className="hover:text-amber-600 transition-colors"
										>
											+62 361 123456
										</a>
									</p>
								</div>
							</div>
						</div>
					</main>

					{/* Footer */}
					<footer className="border-t border-gray-200 bg-white">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
							<p className="text-center text-sm text-gray-500">
								Copyright © 2026. Takshaka Event & Experience
							</p>
						</div>
					</footer>
				</div>
			</body>
		</html>
	);
}
