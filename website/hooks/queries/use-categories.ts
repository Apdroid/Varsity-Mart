"use client"

import { useQuery } from "@tanstack/react-query"
import { categoriesApi } from "@/lib/api/categories"

export const categoryKeys = {
	productCategories: () => ["productCategories"] as const,
	storeCategories: () => ["storeCategories"] as const,
	restaurantCategories: () => ["restaurantCategories"] as const,
}

export function useProductCategories() {
	return useQuery({
		queryKey: categoryKeys.productCategories(),
		queryFn: async () => {
			const response = await categoriesApi.productCategories()
			return response.data.categories
		},
		staleTime: 5 * 60 * 1000,
	})
}

export function useStoreCategories() {
	return useQuery({
		queryKey: categoryKeys.storeCategories(),
		queryFn: async () => {
			const response = await categoriesApi.storeCategories()
			return response.results
		},
		staleTime: 5 * 60 * 1000,
	})
}

export function useStoreCategory(id: string) {
	return useQuery({
		queryKey: [...categoryKeys.storeCategories(), id],
		queryFn: async () => {
			const response = await categoriesApi.storeCategory(id)
			return response
		},
		staleTime: 5 * 60 * 1000,
	})
}

export function useRestaurantCategories() {
	return useQuery({
		queryKey: categoryKeys.restaurantCategories(),
		queryFn: async () => {
			const response = await categoriesApi.restaurantCategories()
			return response.data.categories
		},
		staleTime: 5 * 60 * 1000,
	})
}
