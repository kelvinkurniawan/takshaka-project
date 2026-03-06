import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import { getFooterSections } from "@/lib/page-helpers";
import { Footer } from "@/components/sections";

export const metadata = {
	title: "NextCMS - Headless CMS Modern",
	description: "Platform CMS modern untuk mengelola konten digital Anda",
};

export default function PublicLayout({
	children,
}: {
	children: React.ReactNode;
}) {
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
			<div className="public-light flex flex-col min-h-screen bg-white text-gray-900">
				<PublicHeader />
				<main className="flex-1">{children}</main>

				{/* Footer */}
				<Footer
					sections={getFooterSections()}
					copyright="Copyright 2026. Takshaka Event & Experience"
				/>
			</div>
		</>
	);
}
