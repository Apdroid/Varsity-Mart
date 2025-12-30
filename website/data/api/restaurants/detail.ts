import { mockRestaurants } from "../mock/restaurants";

/**
 * Mock API response for GET /restaurants/:id
 * Matches Backend 1.md endpoint structure exactly
 */
export function getMockRestaurantDetailResponse(id: string) {
	const restaurant = mockRestaurants.find((r) => r.id === id) || mockRestaurants[0];

	return {
		success: true,
		data: {
			id: restaurant.id,
			name: restaurant.name,
			description: restaurant.description,
			logo: restaurant.logo,
			banner: restaurant.banner,
			category: restaurant.cuisine?.[0] || "General",
			location: restaurant.location?.street || "University Campus",
			phone: "+233XXXXXXXXX",
			rating: restaurant.rating,
			totalReviews: restaurant.reviewsCount,
			deliveryTime: restaurant.deliveryTime,
			deliveryFee: restaurant.deliveryFee,
			minOrder: restaurant.minOrder,
			isOpen: restaurant.isOpen,
			openingTime: "08:00",
			closingTime: "22:00",
			owner: {
				id: restaurant.ownerId || "1",
				name: restaurant.name.split(" ")[0] + " Owner",
				avatar: "👤",
			},
			memberSince: restaurant.createdAt || "2024-01-15T00:00:00Z",
		},
	};
}
