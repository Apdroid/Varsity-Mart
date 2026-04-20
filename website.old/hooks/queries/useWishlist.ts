"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import apiClient from "@/lib/api/client"
import { ENDPOINTS } from "@/lib/api/endpoints"
import { queryKeys } from "@/lib/api/query-keys"
import type { Product } from "@/types/models"

// Wishlist query keys (extend the factory)
const wishlistKeys = {
  all: ["wishlist"] as const,
  list: () => [...wishlistKeys.all, "list"] as const,
}

export function useWishlist() {
  return useQuery({
    queryKey: wishlistKeys.list(),
    queryFn: async () => {
      // If backend has a wishlist endpoint, use it; otherwise use liked products
      try {
        const response = await apiClient.get("/wishlist/")
        return response.data as { success: boolean; data: Product[] }
      } catch {
        // Fallback: use liked products from products endpoint
        const response = await apiClient.get(ENDPOINTS.PRODUCTS.LIST, {
          params: { liked: true },
        })
        return response.data as { success: boolean; data: Product[] }
      }
    },
    staleTime: 1000 * 60 * 2,
  })
}

export function useAddToWishlist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await apiClient.post(ENDPOINTS.PRODUCTS.LIKE(productId))
      return response.data
    },
    onMutate: async (productId) => {
      // Optimistic update: toggle isLiked in product detail cache
      await queryClient.cancelQueries({ queryKey: queryKeys.products.detail(productId) })
      const previous = queryClient.getQueryData(queryKeys.products.detail(productId))
      queryClient.setQueryData(queryKeys.products.detail(productId), (old: any) => {
        if (!old?.data) return old
        return { ...old, data: { ...old.data, isLiked: true, likesCount: old.data.likesCount + 1 } }
      })
      return { previous }
    },
    onError: (_, productId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.products.detail(productId), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
    },
  })
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await apiClient.post(ENDPOINTS.PRODUCTS.LIKE(productId))
      return response.data
    },
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.products.detail(productId) })
      const previous = queryClient.getQueryData(queryKeys.products.detail(productId))
      queryClient.setQueryData(queryKeys.products.detail(productId), (old: any) => {
        if (!old?.data) return old
        return { ...old, data: { ...old.data, isLiked: false, likesCount: Math.max(0, old.data.likesCount - 1) } }
      })
      return { previous }
    },
    onError: (_, productId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.products.detail(productId), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
    },
  })
}
