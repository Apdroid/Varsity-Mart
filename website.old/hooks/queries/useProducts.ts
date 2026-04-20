"use client"

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import { productsService } from "@/lib/api/services/products.service"
import { queryKeys } from "@/lib/api/query-keys"
import type { ProductFilters, CreateProductRequest, UpdateProductRequest } from "@/types/api"

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => productsService.getProducts(filters),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })
}

export function useInfiniteProducts(filters: ProductFilters = {}) {
  return useInfiniteQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: ({ pageParam = 1 }) =>
      productsService.getProducts({ ...filters, page: pageParam as number }),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.data.pagination
      if (currentPage < totalPages) return currentPage + 1
      return undefined
    },
    initialPageParam: 1,
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productsService.getProductById(id),
    enabled: !!id,
    retry: 2,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.products.categories(),
    queryFn: () => productsService.getCategories(),
    staleTime: 1000 * 60 * 60,
    retry: 2,
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
    queryFn: () => productsService.searchProducts(query, filters),
    enabled: !!query,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  })
}
