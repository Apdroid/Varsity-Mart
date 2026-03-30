"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { storesService } from "@/lib/api/services/stores.service"
import { queryKeys } from "@/lib/api/query-keys"
import type { StoreFilters, CreateStoreRequest, UpdateStoreRequest } from "@/types/api"

export function useStores(filters: StoreFilters = {}) {
  return useQuery({
    queryKey: queryKeys.stores.list(filters),
    queryFn: () => storesService.getStores(filters),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })
}

export function useStore(id: string) {
  return useQuery({
    queryKey: queryKeys.stores.detail(id),
    queryFn: () => storesService.getStoreById(id),
    enabled: !!id,
    retry: 2,
  })
}

export function useStoreProducts(storeId: string, filters = {}) {
  return useQuery({
    queryKey: queryKeys.stores.products(storeId, filters),
    queryFn: () => storesService.getStoreProducts(storeId, filters),
    enabled: !!storeId,
    retry: 2,
  })
}

export function useMyStore() {
  return useQuery({
    queryKey: queryKeys.stores.myStore(),
    queryFn: () => storesService.getMyStore(),
  })
}

export function useCreateStore() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateStoreRequest) => storesService.createStore(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stores.all })
    },
  })
}

export function useUpdateStore() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStoreRequest }) =>
      storesService.updateStore(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stores.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.stores.lists() })
    },
  })
}
