import { mockProducts } from "../mock/products";

/**
 * Mock API response for GET /products/:id
 * Matches Backend 1.md endpoint structure exactly
 */
export function getMockProductDetailResponse(id: string) {
	const product = mockProducts.find((p) => p.id === id) || mockProducts[0];

	return {
		success: true,
		data: {
			id: product.id,
			title: product.title,
			description: product.description,
			price: product.price,
			originalPrice: product.compareAtPrice,
			images: product.images,
			category: product.category.name,
			condition: product.condition,
			location: "Main Campus",
			seller: {
				id: product.sellerId,
				name: product.store?.name || `${product.seller.firstName} ${product.seller.lastName}`,
				avatar: product.seller.avatar || product.store?.logo || "👤",
				rating: product.store?.rating || 4.5,
				totalSales: product.store?.productsCount || 0,
				responseRate: "98%",
				responseTime: "1 hour",
			},
			stock: product.quantity,
			badges: product.tags?.length > 0 ? product.tags.slice(0, 2) : [],
			views: 245,
			likes: product.likesCount || 0,
			isLiked: product.isLiked || false,
			isNightShop: false,
			deliveryOptions: ["campus_delivery", "meetup"],
			specifications: [],
			createdAt: product.createdAt || "2024-01-01T00:00:00Z",
			updatedAt: product.updatedAt || "2024-01-01T00:00:00Z",
		},
	};
}
