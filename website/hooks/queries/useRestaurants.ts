"use client"

import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/api/query-keys"
import { restaurantsService } from "@/lib/api/services/restaurants.service"
import type { RestaurantFilters } from "@/types/api"

export function useRestaurants(filters: RestaurantFilters = {}) {
  return useQuery({
    queryKey: queryKeys.restaurants.list(filters),
    queryFn: () => restaurantsService.getRestaurants(filters),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })
}

export function useRestaurant(id: string) {
  return useQuery({
    queryKey: queryKeys.restaurants.detail(id),
    queryFn: () => restaurantsService.getRestaurantById(id),
    enabled: !!id,
    retry: 2,
  })
}

export function useRestaurantMenu(restaurantId: string) {
  return useQuery({
    queryKey: queryKeys.restaurants.menu(restaurantId),
    queryFn: () => restaurantsService.getMenu(restaurantId),
    enabled: !!restaurantId,
    retry: 2,
  })
}
