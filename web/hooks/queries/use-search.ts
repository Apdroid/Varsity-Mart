"use client"

import { useQuery } from "@tanstack/react-query"
import { searchApi } from "@/lib/api/search"
import type { SearchFilters } from "@/lib/api/types"

export const searchKeys = {
  all: ["search"] as const,
  search: (filters: SearchFilters) => [...searchKeys.all, filters] as const,
}

export function useSearch(filters: SearchFilters, enabled = true) {
  return useQuery({
    queryKey: searchKeys.search(filters),
    queryFn: async () => {
      const response = await searchApi.search(filters)
      return {
        products: response.data.products,
        stores: response.data.stores,
        restaurants: response.data.restaurants,
        totals: response.data.totals,
        pagination: response.data.pagination,
      }
    },
    enabled: enabled && !!filters.query,
  })
}
