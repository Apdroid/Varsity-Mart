/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		return [
			{
				source: "/api/v1/:path*",
				destination: "https://api.varsitymart.org/v1/:path*/",
			},
		]
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'picsum.photos',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'api.varsitymart.org',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'placehold.net',
				port: '',
				pathname: '/**',
			},
		],
	}
}

export default nextConfig
