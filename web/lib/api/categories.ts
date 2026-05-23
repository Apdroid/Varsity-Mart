import { api } from "./client"
import type {
	CategoriesResponse,
	DRFPaginatedList,
	ProductCategory,
	StoreCategory,
	RestaurantCategory,
} from "./types"

export const categoriesApi = {
	productCategories: () =>
		api.get<CategoriesResponse<ProductCategory>>("/product-categories/"),

	storeCategories: () =>
		api.get<DRFPaginatedList<StoreCategory>>("/store-categories/"),

	storeCategory: (id: string) =>
		api.get<StoreCategory>(`/store-categories/${id}`),

	restaurantCategories: () =>
		api.get<CategoriesResponse<RestaurantCategory>>("/restaurant-categories/"),
}
