import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import { getFooterSections, getSocialMediaLinks } from "@/lib/page-helpers";
import { Footer } from "@/components/sections";

export const metadata = {
	title: "Takshaka CMS - Headless CMS Modern",
	description: "Platform CMS modern untuk mengelola konten digital Anda",
};

export default async function PublicLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	console.log("📄 [PublicLayout] Rendering public layout...");

	// Fetch social media links from database with caching
	console.log("📄 [PublicLayout] Calling getSocialMediaLinks...");
	const socialMediaLinks = await getSocialMediaLinks();
	console.log("📄 [PublicLayout] socialMediaLinks result:", socialMediaLinks);

	return (
		<>
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
				<PublicHeader />
				<main className="flex-1">{children}</main>

				{/* Footer */}
				<Footer
					sections={getFooterSections()}
					copyright="Copyright 2026. Takshaka Event & Experience"
					socialLinks={socialMediaLinks}
				/>
			</div>
		</>
	);
}
