/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		// Both icon packages are imported from their barrel file in ~115 places.
		optimizePackageImports: ["lucide-react", "@phosphor-icons/react"],
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
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
			{
				protocol: 'https',
				hostname: 'ui-avatars.com',
				port: '',
				pathname: '/**',
			},
		],
	}
}

export default nextConfig
