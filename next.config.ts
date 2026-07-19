import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
	// Support larger file uploads (100MB)
	onDemandEntries: {
		maxInactiveAge: 60 * 1000,
		pagesBufferLength: 5,
	},
	webpack: (config, { isServer }) => {
		// Exclude Node.js modules from client-side bundle
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				dgram: false,
				fs: false,
				path: false,
				crypto: false,
				stream: false,
				util: false,
				buffer: false,
				net: false,
				tls: false,
				http: false,
				https: false,
				events: false,
				process: false,
				os: false,
				querystring: false,
				"pg/lib/client": false,
				pg: false,
				"pg/lib/connection-parameters": false,
				"native-dns": false,
				"native-dns-cache": false,
			};
		}
		return config;
	},
};

export default nextConfig;
