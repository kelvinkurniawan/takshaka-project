"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Faq {
	id: number;
	question: string;
	answer: string;
	category?: string;
}

interface FaqsClientProps {
	faqs: Record<string, Faq[]>;
	hasError: boolean;
}

export default function FaqsClient({ faqs, hasError }: FaqsClientProps) {
	const [expandedId, setExpandedId] = useState<number | null>(null);

	const toggleFaq = (id: number) => {
		setExpandedId(expandedId === id ? null : id);
	};

	const categories = Object.keys(faqs).sort();

	return (
		<>
			{/* Header Section with Background */}
			<section className="relative w-full h-96 flex items-center justify-center overflow-hidden">
				{/* Background Image */}
				<div className="absolute inset-0 z-0">
					<img
						src="/images/contact-us-header.png"
						alt="FAQs"
						className="w-full h-full object-cover"
					/>
					{/* Dark Overlay */}
					<div className="absolute inset-0 bg-black/50"></div>
				</div>

				{/* Header Content */}
				<div className="relative z-10 text-center">
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wider text-white">
						FREQUENTLY ASKED QUESTIONS
					</h1>
				</div>
			</section>

			{/* Introduction Section */}
			<section className="bg-[#fff8f5] py-16 md:py-24">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-2xl md:text-3xl font-light tracking-widest text-center mb-6 text-gray-800">
						We're Here to Help
					</h2>
					<p className="text-center text-gray-700 font-light leading-relaxed mb-8">
						Find answers to common questions about our premium experiences,
						services, and how we can create unforgettable moments for you.
					</p>
				</div>
			</section>

			{/* Error State */}
			{hasError && (
				<section className="bg-[#f5f0e6] py-16">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
							<p className="text-red-800">
								Failed to load FAQs. Please try again later.
							</p>
						</div>
					</div>
				</section>
			)}

			{/* FAQs Content Section */}
			{!hasError && (
				<section className="bg-[#f5f0e6] py-16 md:py-24">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
						{categories.length === 0 ? (
							<div className="text-center py-12">
								<p className="text-gray-700 text-lg">
									No FAQs available at the moment.
								</p>
							</div>
						) : (
							<div className="space-y-12">
								{categories.map((category) => (
									<div key={category}>
										{/* Category Title */}
										<h3 className="text-xl md:text-2xl font-light tracking-wide text-gray-800 mb-6 pb-3 border-b border-gray-300">
											{category}
										</h3>

										{/* FAQs List */}
										<div className="space-y-4">
											{faqs[category].map((faq) => (
												<button
													key={faq.id}
													onClick={() => toggleFaq(faq.id)}
													className="w-full bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-6 text-left transition-all duration-300"
												>
													{/* Question */}
													<div className="flex items-start justify-between gap-4">
														<h4 className="text-base md:text-lg font-light text-gray-800 flex-1">
															{faq.question}
														</h4>
														<ChevronDown
															className={`w-5 h-5 text-[#A27C34] flex-shrink-0 transition-transform duration-300 ${
																expandedId === faq.id ? "rotate-180" : ""
															}`}
														/>
													</div>

													{/* Answer - Expandable */}
													{expandedId === faq.id && (
														<div className="mt-4 pt-4 border-t border-gray-200">
															<p className="text-gray-700 font-light leading-relaxed whitespace-pre-wrap">
																{faq.answer}
															</p>
														</div>
													)}
												</button>
											))}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</section>
			)}

			{/* CTA Section */}
			{!hasError && categories.length > 0 && (
				<section className="bg-[#fff8f5] py-16 md:py-20">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
						<h3 className="text-xl md:text-2xl font-light tracking-wide text-gray-800 mb-4">
							Didn't find what you're looking for?
						</h3>
						<p className="text-gray-700 font-light mb-8">
							Contact us directly and our team will be happy to assist you.
						</p>
						<a
							href="/contact-us"
							className="inline-block px-8 py-3 bg-[#A27C34] text-white font-light tracking-wide hover:bg-[#8B6829] transition-colors duration-300"
						>
							Get in Touch
						</a>
					</div>
				</section>
			)}
		</>
	);
}
