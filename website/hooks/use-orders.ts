"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ordersService } from "@/lib/api/services/orders.service"
import { queryKeys } from "@/lib/api/query-keys"
import type { OrderFilters, CreateOrderRequest } from "@/types/api"
import { mockOrders } from "@/data/account/orders"

export function useOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: queryKeys.orders.list(filters),
    queryFn: async () => {
      try {
        return await ordersService.getOrders(filters)
      } catch (error) {
        console.warn("Orders API failed, using mock data:", error)
        return {
          success: true,
          data: mockOrders,
          meta: {
            page: 1,
            limit: 50,
            total: mockOrders.length,
            totalPages: 1,
          },
        }
      }
    },
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: async () => {
      try {
        return await ordersService.getOrderById(id)
      } catch (error) {
        console.warn(`Order ${id} API failed, using mock data:`, error)
        const order = mockOrders.find((o) => o.id === id)
        if (!order) throw error
        return {
          success: true,
          data: order,
        }
      }
    },
    enabled: !!id,
  })
}

export function useMyOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: queryKeys.orders.myOrders(),
    queryFn: async () => {
      try {
        return await ordersService.getMyOrders(filters)
      } catch (error) {
        console.warn("My orders API failed, using mock data:", error)
        return {
          success: true,
          data: mockOrders,
          meta: {
            page: 1,
            limit: 50,
            total: mockOrders.length,
            totalPages: 1,
          },
        }
      }
    },
  })
}

export function useSellerOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: queryKeys.orders.sellerOrders(),
    queryFn: async () => {
      try {
        return await ordersService.getSellerOrders(filters)
      } catch (error) {
        console.warn("Seller orders API failed, using mock data:", error)
        return {
          success: true,
          data: mockOrders,
          meta: {
            page: 1,
            limit: 50,
            total: mockOrders.length,
            totalPages: 1,
          },
        }
      }
    },
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => ordersService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
    },
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) =>
      ordersService.updateOrderStatus(id, { status, notes }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() })
    },
  })
}

export function useCancelOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => ordersService.cancelOrder(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() })
    },
  })
}

export function useConfirmDelivery() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => ordersService.confirmDelivery(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() })
    },
  })
}

export function useRateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, rating, review }: { id: string; rating: number; review?: string }) =>
      ordersService.rateOrder(id, rating, review),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) })
    },
  })
}
