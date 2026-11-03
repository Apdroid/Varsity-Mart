"use client"

import { keepPreviousData, useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { storesApi } from "@/lib/api/stores"
import { useCampusScope, scopeFilters, withScopeLoading } from "@/hooks/use-campus-scope"
import type { CreateStoreRequest, StoreFilters, CreateReviewRequest } from "@/lib/api/types"

export const storeKeys = {
  all: ["stores"] as const,
  lists: () => [...storeKeys.all, "list"] as const,
  list: (filters: StoreFilters) => [...storeKeys.lists(), filters] as const,
  details: () => [...storeKeys.all, "detail"] as const,
  detail: (id: string) => [...storeKeys.details(), id] as const,
  featured: (limit?: number, campus?: string) =>
    [...storeKeys.all, "featured", limit ?? null, campus ?? null] as const,
  myStore: () => [...storeKeys.all, "my"] as const,
  products: (storeId: string, page?: number) => [...storeKeys.all, storeId, "products", page] as const,
  reviews: (storeId: string, page?: number) => [...storeKeys.all, storeId, "reviews", page] as const,
}

export function useStores(filters?: StoreFilters) {
  const { campus, ready } = useCampusScope()
  const scoped = scopeFilters(filters, campus)
  const query = useQuery({
    queryKey: storeKeys.list(scoped),
    queryFn: async () => {
      const response = await storesApi.list(scoped)
      return {
        stores: response.data.stores,
        pagination: response.data.pagination,
      }
    },
    staleTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
    enabled: ready,
  })
  return withScopeLoading(query, ready)
}

export function useStore(id: string) {
  return useQuery({
    queryKey: storeKeys.detail(id),
    queryFn: async () => {
      const response = await storesApi.get(id)
      return response.data
    },
    enabled: !!id,
    staleTime: 15 * 60 * 1000,
  })
}

export function useFeaturedStores(limit = 10) {
  const { campus, ready } = useCampusScope()
  const query = useQuery({
    queryKey: storeKeys.featured(limit, campus),
    queryFn: async () => {
      const response = await storesApi.featured(limit, campus)
      return response.data
    },
    staleTime: 10 * 60 * 1000,
    enabled: ready,
  })
  return withScopeLoading(query, ready)
}

export function useMyStore() {
  return useQuery({
    queryKey: storeKeys.myStore(),
    queryFn: async () => {
      const response = await storesApi.myStore()
      return response.data
    },
    retry: false,
  })
}

export function useStoreProducts(storeId: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: storeKeys.products(storeId, page),
    queryFn: async () => {
      const response = await storesApi.products(storeId, page, limit)
      return {
        products: response.data.products,
        pagination: response.data.pagination,
      }
    },
    enabled: !!storeId,
    staleTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
  })
}

export function useStoreReviews(storeId: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: storeKeys.reviews(storeId, page),
    queryFn: async () => {
      const response = await storesApi.reviews(storeId, page, limit)
      return {
        reviews: response.data.reviews,
        pagination: response.data.pagination,
        averageRating: response.data.averageRating,
        totalReviews: response.data.totalReviews,
        ratingDistribution: response.data.ratingDistribution,
      }
    },
    enabled: !!storeId,
    staleTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
  })
}

export function useCreateStore() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateStoreRequest) => storesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeKeys.all })
    },
  })
}

export function useUpdateStore() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateStoreRequest> }) =>
      storesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: storeKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: storeKeys.myStore() })
    },
  })
}

export function useDeleteStore() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => storesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeKeys.all })
    },
  })
}

export function useUploadStoreLogo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ storeId, file }: { storeId: string; file: File }) =>
      storesApi.uploadLogo(storeId, file),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({ queryKey: storeKeys.detail(storeId) })
      queryClient.invalidateQueries({ queryKey: storeKeys.myStore() })
    },
  })
}

export function useUploadStoreBanner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ storeId, file }: { storeId: string; file: File }) =>
      storesApi.uploadBanner(storeId, file),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({ queryKey: storeKeys.detail(storeId) })
      queryClient.invalidateQueries({ queryKey: storeKeys.myStore() })
    },
  })
}

export function useMigrateProducts() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ storeId, productIds }: { storeId: string; productIds: string[] }) =>
      storesApi.migrateProducts(storeId, productIds),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({ queryKey: storeKeys.products(storeId) })
    },
  })
}

export function useRenewStoreSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (storeId: string) => storesApi.renewSubscription(storeId),
    onSuccess: (_, storeId) => {
      queryClient.invalidateQueries({ queryKey: storeKeys.detail(storeId) })
      queryClient.invalidateQueries({ queryKey: storeKeys.myStore() })
    },
  })
}

export function useCreateStoreReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ storeId, data }: { storeId: string; data: CreateReviewRequest }) =>
      storesApi.createReview(storeId, data),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({ queryKey: storeKeys.reviews(storeId) })
      queryClient.invalidateQueries({ queryKey: storeKeys.detail(storeId) })
    },
  })
}
