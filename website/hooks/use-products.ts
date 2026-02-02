"use client"

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import { productsService } from "@/lib/api/services/products.service"
import { queryKeys } from "@/lib/api/query-keys"
import { mockProducts } from "@/data/products/products"
import type { ProductFilters, CreateProductRequest, UpdateProductRequest } from "@/types/api"

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: async () => {
      try {
        return await productsService.getProducts(filters)
      } catch (error) {
        // Fallback to mock data if API fails
        console.warn("Products API failed, using mock data:", error)
        return {
          success: true,
          data: mockProducts,
          meta: {
            page: 1,
            limit: 50,
            total: mockProducts.length,
            totalPages: 1,
          },
        }
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1, // Only retry once before falling back
  })
}

export function useInfiniteProducts(filters: ProductFilters = {}) {
  return useInfiniteQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: async ({ pageParam = 1 }) => {
      try {
        return await productsService.getProducts({ ...filters, page: pageParam })
      } catch (error) {
        // Fallback to mock data for infinite queries
        console.warn("Infinite products API failed, using mock data:", error)
        const startIndex = (pageParam - 1) * (filters.limit || 20)
        const endIndex = startIndex + (filters.limit || 20)
        const paginatedMockData = mockProducts.slice(startIndex, endIndex)
        
        return {
          success: true,
          data: paginatedMockData,
          meta: {
            page: pageParam,
            limit: filters.limit || 20,
            total: mockProducts.length,
            totalPages: Math.ceil(mockProducts.length / (filters.limit || 20)),
          },
        }
      }
    },
    getNextPageParam: (lastPage) => {
      const page = 'meta' in lastPage ? lastPage.meta.page : lastPage.page
      const totalPages = 'meta' in lastPage ? lastPage.meta.totalPages : lastPage.totalPages
      if (page < totalPages) {
        return page + 1
      }
      return undefined
    },
    initialPageParam: 1,
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: async () => {
      try {
        return await productsService.getProductById(id)
      } catch (error) {
        // Fallback to mock data for single product
        console.warn(`Product ${id} API failed, using mock data:`, error)
        const mockProduct = mockProducts.find(p => p.id === id)
        if (!mockProduct) throw error
        return {
          success: true,
          data: mockProduct,
        }
      }
    },
    enabled: !!id,
    retry: 1,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.products.categories(),
    queryFn: async () => {
      try {
        return await productsService.getCategories()
      } catch (error) {
        // Fallback categories
        console.warn("Categories API failed, using fallback:", error)
        return {
          success: true,
          data: [
            { id: "1", name: "Electronics", slug: "electronics" },
            { id: "2", name: "Books", slug: "books" },
            { id: "3", name: "Fashion", slug: "fashion" },
            { id: "4", name: "Home & Garden", slug: "home-garden" },
            { id: "5", name: "Sports", slug: "sports" },
          ],
        }
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
  })
}

export function useMyProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: queryKeys.products.myProducts(),
    queryFn: () => productsService.getMyProducts(filters),
    // No fallback for authenticated user data - should show error if API fails
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProductRequest) => productsService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) => productsService.updateProduct(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => productsService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
    },
  })
}

export function useLikeProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => productsService.likeProduct(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id) })
    },
  })
}

export function useSearchProducts(query: string, filters: ProductFilters = {}) {
  return useQuery({
    queryKey: queryKeys.products.search(query, filters),
    queryFn: async () => {
      try {
        return await productsService.searchProducts(query, filters)
      } catch (error) {
        // Fallback to mock search
        console.warn("Search API failed, using mock data:", error)
        const filtered = mockProducts.filter(
          (product) =>
            product.title.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            product.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
        )
        return {
          success: true,
          data: filtered,
          meta: {
            page: 1,
            limit: 50,
            total: filtered.length,
            totalPages: 1,
          },
        }
      }
    },
    enabled: !!query,
    staleTime: 1000 * 60 * 2, // 2 minutes for search
    retry: 1,
  })
}
