import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import { getFooterSections, getSocialMediaLinks } from "@/lib/page-helpers";
import { Footer } from "@/components/sections";
import { RecaptchaProvider } from "@/lib/RecaptchaProvider";
import RouteProgress from "@/components/RouteProgress";

export const metadata = {
	title: "Takshaka CMS - Headless CMS Modern",
	description: "Platform CMS modern untuk mengelola konten digital Anda",
};

export default async function PublicLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Fetch social media links from database with caching
	const socialMediaLinks = await getSocialMediaLinks();

	return (
		<RecaptchaProvider>
			<style>{`
        .public-light {
          color-scheme: light;
        }
        .public-light,
        .public-light * {
          --tw-bg-opacity: 1;
        }
      `}</style>
			<div className="public-light flex flex-col min-h-screen bg-[#fff8f5] text-gray-900">
				<RouteProgress />
				<PublicHeader />
				<main className="flex-1">{children}</main>

				{/* Footer */}
				<Footer
					sections={getFooterSections()}
					copyright="Copyright 2026. Takshaka Event & Experience"
					socialLinks={socialMediaLinks}
				/>
			</div>
		</RecaptchaProvider>
	);
}
