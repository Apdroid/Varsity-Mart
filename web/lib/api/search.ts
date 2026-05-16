import { api } from "./client"
import type {
  SearchFilters,
  Product,
  StoreListItem,
  FoodSearchItem,
  Pagination,
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

interface SearchFacets {
  categories: { id: string; name: string; count: number }[]
  priceRange: { min: number; max: number }
  conditions: { value: string; count: number }[]
}

interface SearchResponse {
  totals: {
    products: number
    stores: number
    food: number
    all: number
  }
  results: {
    products: Product[]
    stores: StoreListItem[]
    food: FoodSearchItem[]
  }
  pagination: Pagination
  facets?: SearchFacets
  query: string
  type: string
  meta?: {
    took_ms: number
    from_cache: boolean
  }
}

export const searchApi = {
  search: (filters: SearchFilters) => {
    const params = {
      query: filters.query,
      type: filters.type,
      category: filters.category,
      min_price: filters.minPrice,
      max_price: filters.maxPrice,
      condition: filters.condition,
      sort_by: filters.sortBy,
      page: filters.page,
      limit: filters.limit,
    }
    return api.get<SearchResponse>(`/search/${buildQueryString(params)}`)
  },
}
