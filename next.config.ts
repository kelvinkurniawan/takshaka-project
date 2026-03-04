import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	eslint: {
		// Disable ESLint during build - let it run separately if needed
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
