import { mockRestaurants } from "../mock/restaurants";

/**
 * Mock API response for GET /restaurants
 * Matches Backend 1.md endpoint structure exactly
 */
export const mockRestaurantsListResponse = {
	success: true,
	data: {
		restaurants: mockRestaurants.map((r) => ({
			id: r.id,
			name: r.name,
			logo: r.logo,
			banner: r.banner,
			category: r.cuisine?.[0] || "General",
			rating: r.rating,
			totalReviews: r.reviewsCount,
			deliveryTime: r.deliveryTime,
			deliveryFee: r.deliveryFee,
			minOrder: r.minOrder,
			isOpen: r.isOpen,
			badge: r.tags?.includes("Popular") ? "Popular" : undefined,
		})),
		pagination: {
			currentPage: 1,
			totalPages: Math.ceil(mockRestaurants.length / 20),
			totalItems: mockRestaurants.length,
			itemsPerPage: 20,
		},
	},
};
