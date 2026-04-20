import { mockStores } from "../mock/stores";

/**
 * Mock API response for GET /stores/:id
 * Matches Backend 1.md endpoint structure exactly
 */
export function getMockStoreDetailResponse(id: string) {
	const store = mockStores.find((s) => s.id === id) || mockStores[0];

	return {
		success: true,
		data: {
			id: store.id,
			name: store.name,
			description: store.description,
			logo: store.logo,
			banner: store.banner,
			category: "Electronics", // Default category
			location: "Main Campus",
			phone: "+233XXXXXXXXX",
			isOpen: store.isOpen,
			openingTime: "08:00",
			closingTime: "20:00",
			rating: store.rating,
			totalReviews: store.reviewsCount,
			totalProducts: store.productsCount,
			totalSales: 1250,
			deliveryFee: 5,
			minOrder: 20,
			owner: {
				id: store.ownerId || "1",
				name: store.name.split(" ")[0] + " Owner",
				avatar: "👤",
			},
			memberSince: store.createdAt || "2024-01-15T00:00:00Z",
			subscriptionStatus: "active",
			subscriptionEnds: "2024-06-15T00:00:00Z",
		},
	};
}
