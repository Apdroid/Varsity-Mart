import type { NextConfig } from "next";
const hostnames = ["images.unsplash.com"];
const nextConfig: NextConfig = {
	images: {
		remotePatterns: hostnames.map((hostname) => ({
			protocol: "https",
			hostname,
		})),
	},
	/* config options here */
};

export default nextConfig;
