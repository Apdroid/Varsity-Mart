"use client"

import { useQuery } from "@tanstack/react-query"
import { mockRestaurants } from "@/data/food/restaurants"
import { mockMenu } from "@/data/food/restaurant-detail"
import { queryKeys } from "@/lib/api/query-keys"
import { restaurantsService } from "@/lib/api/services/restaurants.service"
import type { RestaurantFilters } from "@/types/api"

export function useRestaurants(filters: RestaurantFilters = {}) {
  return useQuery({
    queryKey: queryKeys.restaurants.list(filters),
    queryFn: async () => {
      try {
        return await restaurantsService.getRestaurants(filters)
      } catch (error) {
        console.warn("Restaurants API failed, using mock data:", error)
        return {
          success: true,
          data: mockRestaurants,
          meta: { page: 1, limit: 50, total: mockRestaurants.length, totalPages: 1 },
        }
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })
}

export function useRestaurant(id: string) {
  return useQuery({
    queryKey: queryKeys.restaurants.detail(id),
    queryFn: async () => {
      try {
        return await restaurantsService.getRestaurantById(id)
      } catch (error) {
        console.warn(`Restaurant ${id} API failed, using mock data:`, error)
        const restaurant = mockRestaurants.find((r) => r.id === id)
        if (!restaurant) throw error
        return { success: true, data: restaurant }
      }
    },
    enabled: !!id,
    retry: 1,
  })
}

export function useRestaurantMenu(restaurantId: string) {
  return useQuery({
    queryKey: queryKeys.restaurants.menu(restaurantId),
    queryFn: async () => {
      try {
        return await restaurantsService.getMenu(restaurantId)
      } catch (error) {
        console.warn(`Restaurant ${restaurantId} menu API failed, using fallback:`, error)
        return { success: true, data: mockMenu }
      }
    },
    enabled: !!restaurantId,
    retry: 1,
  })
}
