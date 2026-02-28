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
        console.warn("Products API failed, using mock data:", error)
        return {
          success: true,
          data: mockProducts,
          meta: { page: 1, limit: 50, total: mockProducts.length, totalPages: 1 },
        }
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })
}

export function useInfiniteProducts(filters: ProductFilters = {}) {
  return useInfiniteQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: async ({ pageParam = 1 }) => {
      try {
        return await productsService.getProducts({ ...filters, page: pageParam })
      } catch (error) {
        console.warn("Infinite products API failed, using mock data:", error)
        return {
          success: true,
          data: mockProducts,
          meta: { page: 1, limit: 50, total: mockProducts.length, totalPages: 1 },
        }
      }
    },
    getNextPageParam: (lastPage) => {
      const meta = "meta" in lastPage ? (lastPage.meta as any) : lastPage
      if (meta.page < meta.totalPages) return meta.page + 1
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
        console.warn(`Product ${id} API failed, using mock data:`, error)
        const product = mockProducts.find((p) => p.id === id)
        if (!product) throw error
        return { success: true, data: product }
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
    staleTime: 1000 * 60 * 60,
    retry: 1,
  })
}

export function useMyProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: queryKeys.products.myProducts(),
    queryFn: () => productsService.getMyProducts(filters),
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
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) =>
      productsService.updateProduct(id, data),
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
          meta: { page: 1, limit: 50, total: filtered.length, totalPages: 1 },
        }
      }
    },
    enabled: !!query,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  })
}
