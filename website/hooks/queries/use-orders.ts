"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ordersApi, foodOrdersApi } from "@/lib/api/orders"
import type { CreateOrderRequest, CreateFoodOrderRequest, OrderFilters, RateFoodOrderRequest } from "@/lib/api/types"
import { cartKeys } from "./use-cart"

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters?: OrderFilters) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  seller: (filters?: OrderFilters) => [...orderKeys.all, "seller", filters] as const,
}

export const foodOrderKeys = {
  all: ["foodOrders"] as const,
  lists: () => [...foodOrderKeys.all, "list"] as const,
  list: (filters?: OrderFilters) => [...foodOrderKeys.lists(), filters] as const,
  details: () => [...foodOrderKeys.all, "detail"] as const,
  detail: (id: string) => [...foodOrderKeys.details(), id] as const,
  restaurant: (filters?: OrderFilters) => [...foodOrderKeys.all, "restaurant", filters] as const,
}

export function useMyOrders(filters?: OrderFilters) {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () => ordersApi.myOrders(filters),
  })
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => ordersApi.get(orderId),
    enabled: !!orderId,
  })
}

export function useSellerOrders(filters?: OrderFilters) {
  return useQuery({
    queryKey: orderKeys.seller(filters),
    queryFn: () => ordersApi.sellerOrders(filters),
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => ordersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
      queryClient.invalidateQueries({ queryKey: cartKeys.all })
    },
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, status, notes }: { orderId: string; status: string; notes?: string }) =>
      ordersApi.updateStatus(orderId, status, notes),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) })
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
    },
  })
}

export function useCancelOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason?: string }) =>
      ordersApi.cancel(orderId, reason),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) })
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
    },
  })
}

export function useConfirmOrderDelivery() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId: string) => ordersApi.confirmDelivery(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) })
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
    },
  })
}

export function useRateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, rating, review }: { orderId: string; rating: number; review?: string }) =>
      ordersApi.rate(orderId, rating, review),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) })
    },
  })
}

export function useMyFoodOrders(filters?: OrderFilters) {
  return useQuery({
    queryKey: foodOrderKeys.list(filters),
    queryFn: () => foodOrdersApi.myOrders(filters),
  })
}

export function useFoodOrder(orderId: string) {
  return useQuery({
    queryKey: foodOrderKeys.detail(orderId),
    queryFn: () => foodOrdersApi.get(orderId),
    enabled: !!orderId,
  })
}

export function useRestaurantOrders(filters?: OrderFilters) {
  return useQuery({
    queryKey: foodOrderKeys.restaurant(filters),
    queryFn: () => foodOrdersApi.restaurantOrders(filters),
  })
}

export function useCreateFoodOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateFoodOrderRequest) => foodOrdersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foodOrderKeys.all })
    },
  })
}

export function useUpdateFoodOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, status, estimatedDeliveryTime }: { orderId: string; status: string; estimatedDeliveryTime?: string }) =>
      foodOrdersApi.updateStatus(orderId, status, estimatedDeliveryTime),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: foodOrderKeys.detail(orderId) })
      queryClient.invalidateQueries({ queryKey: foodOrderKeys.lists() })
    },
  })
}

export function useConfirmFoodOrderDelivery() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId: string) => foodOrdersApi.confirmDelivery(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: foodOrderKeys.detail(orderId) })
      queryClient.invalidateQueries({ queryKey: foodOrderKeys.lists() })
    },
  })
}

export function useRateFoodOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: RateFoodOrderRequest }) =>
      foodOrdersApi.rate(orderId, data),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: foodOrderKeys.detail(orderId) })
    },
  })
}
