import { ContactUsForm } from "@/components/public/ContactUsForm";
import Image from "next/image";

export const metadata = {
	title: "Contact Us - Takshaka",
	description:
		"Get in touch with Takshaka. We're here to help with your inquiries and premium experiences.",
};

export default function ContactUsPage() {
	return (
		<>
			{/* Header Section with Background */}
			<section className="relative w-full h-96 flex items-center justify-center overflow-hidden">
				{/* Background Image */}
				<div className="absolute inset-0 z-0">
					<img
						src="/images/contact-us-header.png"
						alt="Contact Us"
						className="w-full h-full object-cover"
					/>
					{/* Dark Overlay */}
					<div className="absolute inset-0 bg-black/50"></div>
				</div>

				{/* Header Content */}
				<div className="relative z-10 text-center">
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wider text-white">
						CONTACT US
					</h1>
				</div>
			</section>

			{/* Contact Information Section */}
			<section className="bg-[#fff8f5] py-16 md:py-24">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
						{/* Email */}
						<div className="text-center">
							<div className="mb-2 flex justify-center">
								<svg
									className="w-8 h-8 text-[#A27C34]"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<a
								href="mailto:experience@takshaka.id"
								className="text-gray-800 hover:text-gray-600 transition font-light"
							>
								experience@takshaka.id
							</a>
						</div>

						{/* Phone */}
						<div className="text-center">
							<div className="mb-2 flex justify-center">
								<svg
									className="w-8 h-8 text-[#A27C34]"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
									/>
								</svg>
							</div>
							<a
								href="tel:+6236195820300"
								className="text-gray-800 hover:text-gray-600 transition font-light"
							>
								62 361 9582030
							</a>
						</div>

						{/* Address */}
						<div className="text-center">
							<div className="mb-2 flex justify-center">
								<svg
									className="w-8 h-8 text-[#A27C34]"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
							</div>
							<p className="text-gray-800 font-light leading-relaxed max-w-xs mx-auto">
								Puri Candra Asri B 62, Batubalan,
								<br />
								Gianyar, Bali 80582, Indonesia
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Form Section */}
			<section className="bg-[#f5f0e6] py-16 md:py-24">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-2xl md:text-4xl font-light tracking-widest text-center mb-12 md:mb-16">
						LET'S CONNECT
					</h2>

					<ContactUsForm />
				</div>
			</section>
		</>
	);
}
