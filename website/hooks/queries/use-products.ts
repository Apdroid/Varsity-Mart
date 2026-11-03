"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { productsApi } from "@/lib/api/products"
import { useCampusScope, scopeFilters, withScopeLoading } from "@/hooks/use-campus-scope"
import type { CreateProductRequest, ProductFilters, CreateReviewRequest } from "@/lib/api/types"

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  myProducts: (filters?: ProductFilters) => [...productKeys.all, "my", filters] as const,
  featured: (limit?: number, campus?: string) =>
    [...productKeys.all, "featured", limit ?? null, campus ?? null] as const,
  reviews: (productId: string, page?: number) => [...productKeys.all, productId, "reviews", page] as const,
}

export function useProducts(filters?: ProductFilters) {
  const { campus, ready } = useCampusScope()
  const scoped = scopeFilters(filters, campus)
  const query = useQuery({
    queryKey: productKeys.list(scoped),
    queryFn: async () => {
      const response = await productsApi.list(scoped)
      return {
        products: response.data.products,
        pagination: response.data.pagination,
      }
    },
    enabled: ready,
  })
  return withScopeLoading(query, ready)
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const response = await productsApi.get(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useMyProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: productKeys.myProducts(filters),
    queryFn: async () => {
      const response = await productsApi.myProducts(filters)
      return {
        products: response.data.products,
        pagination: response.data.pagination,
      }
    },
  })
}

export function useFeaturedProducts(limit = 12) {
  const { campus, ready } = useCampusScope()
  const query = useQuery({
    queryKey: productKeys.featured(limit, campus),
    queryFn: async () => {
      const response = await productsApi.featured(limit, campus)
      return response.data
    },
    enabled: ready,
  })
  return withScopeLoading(query, ready)
}

export function useProductReviews(productId: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: productKeys.reviews(productId, page),
    queryFn: async () => {
      const response = await productsApi.reviews(productId, page, limit)
      return {
        reviews: response.data.reviews,
        pagination: response.data.pagination,
        averageRating: response.data.averageRating,
        totalReviews: response.data.totalReviews,
        ratingDistribution: response.data.ratingDistribution,
      }
    },
    enabled: !!productId,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProductRequest) => productsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
    },
  })
}

export function useUploadProductImages() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, files }: { productId: string; files: File[] }) =>
      productsApi.uploadImages(productId, files),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateProductRequest> }) =>
      productsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
    },
  })
}

export function useLikeProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => productsApi.like(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) })
    },
  })
}

export function useUnlikeProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => productsApi.unlike(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) })
    },
  })
}

export function useCreateProductReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: CreateReviewRequest }) =>
      productsApi.createReview(productId, data),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.reviews(productId) })
      queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) })
    },
  })
}
