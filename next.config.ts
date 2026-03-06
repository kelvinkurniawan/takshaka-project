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
		],
	},
};

export default nextConfig;
