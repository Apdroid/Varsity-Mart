import { mockProducts } from "../mock/products";

/**
 * Mock API response for GET /products
 * Matches Backend 1.md endpoint structure exactly
 */
export const mockProductsListResponse = {
	success: true,
	data: {
		products: mockProducts.map((p) => ({
			id: p.id,
			title: p.title,
			description: p.description,
			price: p.price,
			originalPrice: p.compareAtPrice,
			images: p.images,
			category: p.category.name,
			condition: p.condition,
			location: "Main Campus",
			seller: {
				id: p.sellerId,
				name: p.store?.name || `${p.seller.firstName} ${p.seller.lastName}`,
				avatar: p.seller.avatar || "👤",
				rating: p.store?.rating || 4.5,
			},
			badges: p.tags?.length > 0 ? p.tags.slice(0, 2) : [],
			views: 0,
			likes: p.likesCount || 0,
			isNightShop: false,
			createdAt: p.createdAt || "2024-01-01T00:00:00Z",
		})),
		pagination: {
			currentPage: 1,
			totalPages: Math.ceil(mockProducts.length / 20),
			totalItems: mockProducts.length,
			itemsPerPage: 20,
		},
	},
};
