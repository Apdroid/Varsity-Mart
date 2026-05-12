import { api, apiClientFormData } from "./client"
import type {
  ApiResponse,
  RestaurantListItem,
  RestaurantDetail,
  RestaurantFilters,
  RestaurantsListResponse,
  FeaturedResponse,
  MenuItem,
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

interface MenuItemsResponse {
  success: boolean
  data: {
    items: MenuItem[]
    categories: string[]
    pagination?: {
      currentPage: number
      totalPages: number
      totalItems: number
    }
  }
}

interface CreateRestaurantRequest {
  name: string
  description: string
  category: string
  location: string
  phone?: string
  deliveryFee?: number
  minOrder?: number
  deliveryTime?: string
  openingTime?: string
  closingTime?: string
}

interface CreateMenuItemRequest {
  name: string
  description: string
  basePrice: number
  category: string
  sizeOptions?: { name: string; priceMod: number }[]
  proteinOptions?: { name: string; priceMod: number }[]
  sides?: { options: { name: string; priceMod: number }[]; max: number }
  modifiers?: string[]
  allowsNotes?: boolean
  isQuickAdd?: boolean
  dietaryTags?: string[]
  allergens?: string[]
  bundleSuggestionIds?: string[]
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

  create: (data: CreateRestaurantRequest) =>
    api.post<ApiResponse<RestaurantDetail>>("/restaurants/", data),

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

  menuItems: (restaurantId: string, page = 1, limit = 50) =>
    api.get<MenuItemsResponse>(`/menu-items/?restaurant=${restaurantId}&page=${page}&limit=${limit}`),

  getMenuItem: (itemId: string) =>
    api.get<ApiResponse<MenuItem>>(`/menu-items/${itemId}/`),

  createMenuItem: (restaurantId: string, data: CreateMenuItemRequest) =>
    api.post<ApiResponse<MenuItem>>(`/menu-items/`, { ...data, restaurant: restaurantId }),

  updateMenuItem: (itemId: string, data: Partial<CreateMenuItemRequest>) =>
    api.patch<ApiResponse<MenuItem>>(`/menu-items/${itemId}/`, data),

  deleteMenuItem: (itemId: string) =>
    api.delete<ApiResponse<{ success: boolean }>>(`/menu-items/${itemId}/`),

  toggleMenuItemAvailability: (itemId: string) =>
    api.post<ApiResponse<{ isAvailable: boolean }>>(`/menu-items/${itemId}/toggle-availability/`),

  uploadMenuItemImage: (itemId: string, file: File) => {
    const formData = new FormData()
    formData.append("image", file)
    return apiClientFormData<ApiResponse<{ imageUrl: string }>>(
      `/menu-items/${itemId}/image/`,
      formData
    )
  },

  reviews: (restaurantId: string, page = 1, limit = 10) =>
    api.get<ReviewsResponse>(`/restaurants/${restaurantId}/reviews/?page=${page}&limit=${limit}`),

  createReview: (restaurantId: string, data: CreateReviewRequest) =>
    api.post<ApiResponse<{ reviewId: string }>>(`/restaurants/${restaurantId}/reviews/`, data),
}
