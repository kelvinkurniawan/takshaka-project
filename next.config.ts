import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	eslint: {
		// Disable ESLint during build - let it run separately if needed
		ignoreDuringBuilds: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
			// R2 domain - can be configured via R2_PUBLIC_URL env var
			{
				protocol: "https",
				hostname: process.env.R2_PUBLIC_URL
					? new URL(process.env.R2_PUBLIC_URL).hostname
					: "pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev",
			},
		],
		// Disable optimization for R2 to avoid timeout issues
		unoptimized: process.env.NODE_ENV === "production",
	},
};

export default nextConfig;
