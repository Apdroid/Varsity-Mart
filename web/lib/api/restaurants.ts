import { api, apiClientFormData } from "./client"
import type {
	ApiResponse,
	RestaurantListItem,
	RestaurantDetail,
	RestaurantFilters,
	RestaurantsListResponse,
	FeaturedResponse,
	MenuItem,
	MenuCategory,
	ReviewsResponse,
	CreateReviewRequest,
} from "./types"

function buildQueryString(params: object): string {
	const searchParams = new URLSearchParams()
	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== "") {
			searchParams.append(key, String(value))
		}
	})
	const query = searchParams.toString()
	return query ? `?${query}` : ""
}

interface MenuResponse {
	success: boolean
	data: {
		categories: MenuCategory[]
	}
}

interface CreateMenuItemRequest {
	name: string
	description: string
	price: number
	category: string
	isAvailable?: boolean
	preparationTime?: string
	spicyLevel?: number
	isVegetarian?: boolean
	tags?: string[]
}

export interface CreateRestaurantRequest {
	restaurantName: string
	description: string
	category: string
	openingTime: string
	closingTime: string
	deliveryFee: number
	minOrder: number
	campus?: string
	location?: string
	phone?: string
	deliveryTime?: string
	logo?: File
	banner?: File
}


interface RestaurantDashboard {
	todayOrders: number
	todayRevenue: number
	pendingOrders: number
	monthlyStats: {
		totalOrders: number
		totalRevenue: number
		averageOrderValue: number
	}
}

export const restaurantsApi = {
	list: (filters?: RestaurantFilters) =>
		api.get<RestaurantsListResponse>(`/restaurants/${buildQueryString(filters || {})}`),

	get: (id: string) =>
		api.get<ApiResponse<RestaurantDetail>>(`/restaurants/${id}/`),

	featured: (limit = 10) =>
		api.get<FeaturedResponse<RestaurantListItem>>(`/restaurants/featured/?limit=${limit}`),

	myRestaurant: () =>
		api.get<ApiResponse<RestaurantDetail>>("/restaurants/my-restaurant/"),

	dashboard: () =>
		api.get<ApiResponse<RestaurantDashboard>>("/restaurants/my-restaurant/dashboard/"),

	create: (data: CreateRestaurantRequest) => {
		const formData = new FormData()
		formData.append("restaurantName", data.restaurantName)
		formData.append("description", data.description)
		formData.append("category", data.category)
		formData.append("openingTime", data.openingTime)
		formData.append("closingTime", data.closingTime)
		formData.append("deliveryFee", String(data.deliveryFee))
		formData.append("minOrder", String(data.minOrder))
		if (data.location) formData.append("location", data.location)
		if (data.phone) formData.append("phone", data.phone)
		if (data.deliveryTime) formData.append("deliveryTime", data.deliveryTime)
		if (data.logo) formData.append("logo", data.logo)
		if (data.banner) formData.append("banner", data.banner)
		if (data.campus) formData.append("campus", data.campus)
		return apiClientFormData<ApiResponse<RestaurantDetail>>("/restaurants/", formData)
	},

	update: (id: string, data: Partial<CreateRestaurantRequest>) =>
		api.patch<ApiResponse<RestaurantDetail>>(`/restaurants/${id}/`, data),

	delete: (id: string) =>
		api.delete<ApiResponse<{ success: boolean }>>(`/restaurants/${id}/`),

	uploadLogo: (restaurantId: string, file: File) => {
		const formData = new FormData()
		formData.append("logo", file)
		return apiClientFormData<ApiResponse<{ logoUrl: string }>>(
			`/restaurants/${restaurantId}/logo/`,
			formData
		)
	},

	uploadBanner: (restaurantId: string, file: File) => {
		const formData = new FormData()
		formData.append("banner", file)
		return apiClientFormData<ApiResponse<{ bannerUrl: string }>>(
			`/restaurants/${restaurantId}/banner/`,
			formData
		)
	},

	menu: (restaurantId: string) =>
		api.get<MenuResponse>(`/restaurants/${restaurantId}/menu/`),

	createMenuItem: (restaurantId: string, data: CreateMenuItemRequest) =>
		api.post<ApiResponse<MenuItem>>(`/restaurants/${restaurantId}/menu/`, data),

	updateMenuItem: (restaurantId: string, itemId: string, data: Partial<CreateMenuItemRequest>) =>
		api.put<ApiResponse<MenuItem>>(`/restaurants/${restaurantId}/menu/${itemId}/`, data),

	deleteMenuItem: (restaurantId: string, itemId: string) =>
		api.delete<ApiResponse<{ success: boolean }>>(`/restaurants/${restaurantId}/menu/${itemId}/`),

	reviews: (restaurantId: string, page = 1, limit = 10) =>
		api.get<ReviewsResponse>(`/restaurants/${restaurantId}/reviews/?page=${page}&limit=${limit}`),

	createReview: (restaurantId: string, data: CreateReviewRequest) =>
		api.post<ApiResponse<{ reviewId: string }>>(`/restaurants/${restaurantId}/reviews/`, data),
}
