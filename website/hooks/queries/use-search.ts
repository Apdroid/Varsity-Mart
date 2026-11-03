"use client"

import { useQuery, keepPreviousData } from "@tanstack/react-query"
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
        products: response.results.products,
        stores: response.results.stores,
        food: response.results.food,
        totals: response.totals,
        pagination: response.pagination,
        facets: response.facets,
      }
    },
    enabled: enabled && !!filters.query,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
  })
}
