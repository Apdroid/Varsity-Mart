import { mockProducts } from "../mock/products";

/**
 * Mock API response for GET /stores/:id/products
 * Matches Backend 1.md endpoint structure exactly
 */
export function getMockStoreProductsResponse(storeId: string) {
	const storeProducts = mockProducts.filter((p) => p.storeId === storeId);

	return {
		success: true,
		data: {
			products: storeProducts.map((p) => ({
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
				totalPages: Math.ceil(storeProducts.length / 20),
				totalItems: storeProducts.length,
				itemsPerPage: 20,
			},
		},
	};
}
