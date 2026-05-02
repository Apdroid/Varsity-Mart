import apiClient, { type ApiResponse } from "../client"
import { ENDPOINTS } from "../endpoints"
import type { RestaurantFilters, CreateFoodOrderRequest, PaginatedResponse } from "@/types/api"
import type { Restaurant, MenuItem, FoodOrder } from "@/types/models"

export const restaurantsService = {
  async getRestaurants(filters: RestaurantFilters = {}): Promise<PaginatedResponse<Restaurant>> {
    const response = await apiClient.get(ENDPOINTS.RESTAURANTS.LIST, { params: filters })
    return response.data
  },

  async getRestaurantById(id: string): Promise<ApiResponse<Restaurant>> {
    const response = await apiClient.get(ENDPOINTS.RESTAURANTS.DETAIL(id))
    return response.data
  },

  async getMenu(restaurantId: string): Promise<ApiResponse<{ categories: { id: string; name: string; items: MenuItem[] }[] }>> {
    const response = await apiClient.get(ENDPOINTS.RESTAURANTS.MENU(restaurantId))
    return response.data
  },

  async createFoodOrder(data: CreateFoodOrderRequest): Promise<ApiResponse<FoodOrder>> {
    const response = await apiClient.post(ENDPOINTS.FOOD_ORDERS.CREATE, data)
    return response.data
  },

  async getFoodOrderById(id: string): Promise<ApiResponse<FoodOrder>> {
    const response = await apiClient.get(ENDPOINTS.FOOD_ORDERS.DETAIL(id))
    return response.data
  },

  async getFoodOrders(): Promise<PaginatedResponse<FoodOrder>> {
    const response = await apiClient.get(ENDPOINTS.FOOD_ORDERS.LIST)
    return response.data
  },

  async cancelFoodOrder(id: string): Promise<ApiResponse<FoodOrder>> {
    const response = await apiClient.post(ENDPOINTS.FOOD_ORDERS.CANCEL(id))
    return response.data
  },
}
