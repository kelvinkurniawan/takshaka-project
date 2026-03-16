import type { Metadata } from "next";
import "./globals.css";
import AOSInit from "../components/AOSInit";
import { Footer } from "@/components/sections";
import { getFooterSections, getAppMetadata } from "@/lib/page-helpers";
import { RecaptchaProvider } from "@/lib/RecaptchaProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export async function generateMetadata(): Promise<Metadata> {
	const { name, description } = await getAppMetadata();

	return {
		title: {
			default: name,
			template: `%s | ${name}`,
		},
		description: description,
	};
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `(function(){try{const theme=localStorage.getItem('theme');const prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;const isDark = theme==='dark'||(!theme&&prefersDark); if(isDark){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}else{document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light';}}catch(e){} })()`,
					}}
				/>
			</head>
			<body className="antialiased">
				<RecaptchaProvider>
					{/* client-side initializer for AOS animations */}
					<AOSInit />
					{children}
				</RecaptchaProvider>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
