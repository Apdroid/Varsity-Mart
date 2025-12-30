import { mockStores } from "../mock/stores";

/**
 * Mock API response for GET /stores
 * Matches Backend 1.md endpoint structure exactly
 */
export const mockStoresListResponse = {
	success: true,
	data: {
		stores: mockStores.map((s) => ({
			id: s.id,
			name: s.name,
			logo: s.logo,
			category: "Electronics", // Default category
			rating: s.rating,
			totalReviews: s.reviewsCount,
			totalProducts: s.productsCount,
			isOpen: s.isOpen,
		})),
		pagination: {
			currentPage: 1,
			totalPages: Math.ceil(mockStores.length / 20),
			totalItems: mockStores.length,
			itemsPerPage: 20,
		},
	},
};
