/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		const backendUrl = process.env.API_BASE_URL
		if (!backendUrl) {
			throw new Error("Backend URL Not Set");
		}
		return [
			{
				source: '/api/:path*/',
				destination: `${backendUrl}/:path*/`,
			},
			{
				source: '/api/:path*',
				destination: `${backendUrl}/:path*/`,
			},
		];
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'https://lh3.googleusercontent.com',
				port: '',
				pathname: '/**',
			},
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
