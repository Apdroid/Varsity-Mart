import { mockMenu } from "../mock/restaurant-menu";

/**
 * Mock API response for GET /restaurants/:id/menu
 * Matches Backend 1.md endpoint structure exactly
 */
export function getMockRestaurantMenuResponse(restaurantId: string) {
	const categories = mockMenu.map((section) => ({
		id: section.category.toLowerCase().replace(/\s+/g, "-"),
		name: section.category,
		items: section.items
			.filter((item) => item.restaurantId === restaurantId)
			.map((item) => ({
				id: item.id,
				name: item.name,
				description: item.description,
				price: item.price,
				image: item.image || "",
				isAvailable: item.isAvailable,
				preparationTime: item.preparationTime || "15 mins",
				spicyLevel: 0,
				isVegetarian: false,
				tags: [],
			})),
	}));

	return {
		success: true,
		data: {
			categories,
		},
	};
}
