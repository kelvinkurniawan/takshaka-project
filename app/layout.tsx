import type { Metadata } from "next";
import { PT_Serif } from "next/font/google";
import "./globals.css";
import AOSInit from "../components/AOSInit";
import { Footer } from "@/components/sections";
import { getFooterSections, getAppMetadata } from "@/lib/page-helpers";

const ptSerif = PT_Serif({
	variable: "--font-pt-serif",
	subsets: ["latin"],
	weight: ["400", "700"],
});

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
			<body className={`${ptSerif.variable} antialiased`}>
				{/* client-side initializer for AOS animations */}
				<AOSInit />
				{children}
			</body>
		</html>
	);
}
