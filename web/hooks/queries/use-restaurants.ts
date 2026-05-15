"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { restaurantsApi } from "@/lib/api/restaurants"
import type { RestaurantFilters, CreateReviewRequest } from "@/lib/api/types"

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
  price: number
  category: string
  isAvailable?: boolean
  preparationTime?: string
  spicyLevel?: number
  isVegetarian?: boolean
  tags?: string[]
}

export const restaurantKeys = {
  all: ["restaurants"] as const,
  lists: () => [...restaurantKeys.all, "list"] as const,
  list: (filters: RestaurantFilters) => [...restaurantKeys.lists(), filters] as const,
  details: () => [...restaurantKeys.all, "detail"] as const,
  detail: (id: string) => [...restaurantKeys.details(), id] as const,
  featured: () => [...restaurantKeys.all, "featured"] as const,
  myRestaurant: () => [...restaurantKeys.all, "my"] as const,
  dashboard: () => [...restaurantKeys.all, "dashboard"] as const,
  menuItems: (restaurantId: string, page?: number) => [...restaurantKeys.all, restaurantId, "menu", page] as const,
  menuItem: (itemId: string) => [...restaurantKeys.all, "menuItem", itemId] as const,
  reviews: (restaurantId: string, page?: number) => [...restaurantKeys.all, restaurantId, "reviews", page] as const,
}

export function useRestaurants(filters?: RestaurantFilters) {
  return useQuery({
    queryKey: restaurantKeys.list(filters || {}),
    queryFn: async () => {
      const response = await restaurantsApi.list(filters)
      return {
        restaurants: response.data.restaurants,
        pagination: response.data.pagination,
      }
    },
  })
}

export function useRestaurant(id: string) {
  return useQuery({
    queryKey: restaurantKeys.detail(id),
    queryFn: async () => {
      const response = await restaurantsApi.get(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useFeaturedRestaurants(limit = 10) {
  return useQuery({
    queryKey: restaurantKeys.featured(),
    queryFn: async () => {
      const response = await restaurantsApi.featured(limit)
      return response.data
    },
  })
}

export function useMyRestaurant() {
  return useQuery({
    queryKey: restaurantKeys.myRestaurant(),
    queryFn: async () => {
      const response = await restaurantsApi.myRestaurant()
      return response.data
    },
    retry: false,
  })
}

export function useRestaurantDashboard() {
  return useQuery({
    queryKey: restaurantKeys.dashboard(),
    queryFn: async () => {
      const response = await restaurantsApi.dashboard()
      return response.data
    },
  })
}

export function useMenuItems(restaurantId: string) {
  return useQuery({
    queryKey: restaurantKeys.menuItems(restaurantId),
    queryFn: async () => {
      const response = await restaurantsApi.menu(restaurantId)
      return response.data.categories
    },
    enabled: !!restaurantId,
  })
}

export function useRestaurantReviews(restaurantId: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: restaurantKeys.reviews(restaurantId, page),
    queryFn: async () => {
      const response = await restaurantsApi.reviews(restaurantId, page, limit)
      return {
        reviews: response.data.reviews,
        pagination: response.data.pagination,
        averageRating: response.data.averageRating,
        totalReviews: response.data.totalReviews,
        ratingDistribution: response.data.ratingDistribution,
      }
    },
    enabled: !!restaurantId,
  })
}

export function useCreateRestaurant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateRestaurantRequest) => restaurantsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.all })
    },
  })
}

export function useUpdateRestaurant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateRestaurantRequest> }) =>
      restaurantsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: restaurantKeys.myRestaurant() })
    },
  })
}

export function useDeleteRestaurant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => restaurantsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.all })
    },
  })
}

export function useUploadRestaurantLogo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ restaurantId, file }: { restaurantId: string; file: File }) =>
      restaurantsApi.uploadLogo(restaurantId, file),
    onSuccess: (_, { restaurantId }) => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.detail(restaurantId) })
      queryClient.invalidateQueries({ queryKey: restaurantKeys.myRestaurant() })
    },
  })
}

export function useUploadRestaurantBanner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ restaurantId, file }: { restaurantId: string; file: File }) =>
      restaurantsApi.uploadBanner(restaurantId, file),
    onSuccess: (_, { restaurantId }) => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.detail(restaurantId) })
      queryClient.invalidateQueries({ queryKey: restaurantKeys.myRestaurant() })
    },
  })
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ restaurantId, data }: { restaurantId: string; data: CreateMenuItemRequest }) =>
      restaurantsApi.createMenuItem(restaurantId, data),
    onSuccess: (_, { restaurantId }) => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.menuItems(restaurantId) })
    },
  })
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ restaurantId, itemId, data }: { restaurantId: string; itemId: string; data: Partial<CreateMenuItemRequest> }) =>
      restaurantsApi.updateMenuItem(restaurantId, itemId, data),
    onSuccess: (_, { restaurantId }) => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.menuItems(restaurantId) })
    },
  })
}

export function useDeleteMenuItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ restaurantId, itemId }: { restaurantId: string; itemId: string }) =>
      restaurantsApi.deleteMenuItem(restaurantId, itemId),
    onSuccess: (_, { restaurantId }) => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.menuItems(restaurantId) })
    },
  })
}

export function useCreateRestaurantReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ restaurantId, data }: { restaurantId: string; data: CreateReviewRequest }) =>
      restaurantsApi.createReview(restaurantId, data),
    onSuccess: (_, { restaurantId }) => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.reviews(restaurantId) })
      queryClient.invalidateQueries({ queryKey: restaurantKeys.detail(restaurantId) })
    },
  })
}
