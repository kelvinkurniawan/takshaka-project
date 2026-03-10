import Link from "next/link";
import PublicHeader from "@/components/PublicHeader";
import { Footer } from "@/components/sections";
import { getFooterSections } from "@/lib/page-helpers";

export const metadata = {
	title: "Page Not Found",
	description: "The page you are looking for could not be found.",
};

export default function NotFound() {
	return (
		<>
			<PublicHeader />
			<div className="public-light flex flex-col min-h-screen bg-[#fff8f5] text-gray-900">
				<main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 md:py-24">
					<div className="w-full max-w-3xl text-center">
						{/* 404 Number */}
						<div className="mb-8">
							<h1 className="text-7xl sm:text-8xl md:text-9xl font-light text-gray-900 mb-4">
								404
							</h1>
							<div className="h-1 w-24 bg-gradient-to-r from-amber-600 to-amber-400 mx-auto mb-8"></div>
						</div>

						{/* Error Message */}
						<h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-wider mb-6">
							Page Not Found
						</h2>

						<p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
							We couldn't find the page you're looking for. It might have been
							moved, deleted, or the link might be incorrect. Please return to
							the homepage or use the navigation menu to explore our site.
						</p>

						{/* Search Suggestion */}
						<div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 mb-8">
							<p className="text-sm text-gray-500 mb-4 font-medium">
								Here are some helpful links instead:
							</p>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<Link
									href="/"
									className="text-center py-3 px-4 rounded-md hover:bg-amber-50 transition-colors text-gray-900 hover:text-amber-700 font-medium"
								>
									← Back to Home
								</Link>
								<Link
									href="/our-inspiration"
									className="text-center py-3 px-4 rounded-md hover:bg-amber-50 transition-colors text-gray-900 hover:text-amber-700 font-medium"
								>
									Our Inspiration →
								</Link>
							</div>
						</div>

						{/* CTA Buttons */}
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link
								href="/"
								className="inline-block bg-gray-900 text-white px-8 md:px-12 py-3 rounded-full font-semibold hover:bg-gray-800 transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm md:text-base"
							>
								GO HOME
							</Link>
							<Link
								href="/tentang"
								className="inline-block border-2 border-gray-900 text-gray-900 px-8 md:px-12 py-3 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition duration-300 text-sm md:text-base"
							>
								ABOUT US
							</Link>
						</div>

						{/* Decorative Element */}
						<div className="mt-16 pt-8 border-t border-gray-200">
							<p className="text-xs md:text-sm text-gray-400 mb-6">
								Need immediate help?
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-gray-600">
								<a
									href="mailto:contact@takshaka.com"
									className="hover:text-amber-600 transition-colors text-sm"
								>
									📧 Contact Us
								</a>
								<span className="hidden sm:inline text-gray-300">•</span>
								<a
									href="tel:+62361123456"
									className="hover:text-amber-600 transition-colors text-sm"
								>
									📞 +62 361 123456
								</a>
							</div>
						</div>
					</div>
				</main>

				{/* Footer */}
				<Footer
					sections={getFooterSections()}
					copyright="Copyright 2026. Takshaka Event & Experience"
				/>
			</div>
		</>
	);
}
