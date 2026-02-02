"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { storesService } from "@/lib/api/services/stores.service"
import { queryKeys } from "@/lib/api/query-keys"
import { mockStores } from "@/data/stores/stores"
import type { StoreFilters, CreateStoreRequest, UpdateStoreRequest } from "@/types/api"

export function useStores(filters: StoreFilters = {}) {
  return useQuery({
    queryKey: queryKeys.stores.list(filters),
    queryFn: async () => {
      try {
        return await storesService.getStores(filters)
      } catch (error) {
        console.warn("Stores API failed, using mock data:", error)
        return {
          success: true,
          data: mockStores,
          meta: {
            page: 1,
            limit: 50,
            total: mockStores.length,
            totalPages: 1,
          },
        }
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  })
}

export function useStore(id: string) {
  return useQuery({
    queryKey: queryKeys.stores.detail(id),
    queryFn: async () => {
      try {
        return await storesService.getStoreById(id)
      } catch (error) {
        console.warn(`Store ${id} API failed, using mock data:`, error)
        const mockStore = mockStores.find(s => s.id === id)
        if (!mockStore) throw error
        return {
          success: true,
          data: mockStore,
        }
      }
    },
    enabled: !!id,
    retry: 1,
  })
}

export function useStoreProducts(storeId: string, filters = {}) {
  return useQuery({
    queryKey: queryKeys.stores.products(storeId, filters),
    queryFn: async () => {
      try {
        return await storesService.getStoreProducts(storeId, filters)
      } catch (error) {
        console.warn(`Store ${storeId} products API failed, using fallback:`, error)
        // Return empty products as fallback
        return {
          success: true,
          data: [],
          meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
        }
      }
    },
    enabled: !!storeId,
    retry: 1,
  })
}

export function useMyStore() {
  return useQuery({
    queryKey: queryKeys.stores.myStore(),
    queryFn: () => storesService.getMyStore(),
    // No fallback for authenticated user data
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
    mutationFn: ({ id, data }: { id: string; data: UpdateStoreRequest }) => storesService.updateStore(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stores.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.stores.lists() })
    },
  })
}