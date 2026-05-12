"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { cartApi } from "@/lib/api/cart"
import type { AddToCartRequest, UpdateCartItemRequest } from "@/lib/api/types"

export const cartKeys = {
  all: ["cart"] as const,
  cart: () => [...cartKeys.all, "items"] as const,
}

type AnyRecord = Record<string, unknown>

function asRecord(value: unknown): AnyRecord {
  return typeof value === "object" && value !== null ? (value as AnyRecord) : {}
}

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : fallback
  }
  return fallback
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback
}

export type NormalizedCartItem = {
  id: string
  productId: string
  name: string
  slug: string
  image: string
  inStock: boolean
  quantity: number
  unitPrice: number
  subtotal: number
}

export type NormalizedCart = {
  items: NormalizedCartItem[]
  total: number
  itemCount: number
}

export function normalizeCartData(rawCart: unknown): NormalizedCart {
  const cart = asRecord(rawCart)
  const rawItems = Array.isArray(cart.items) ? cart.items : []

  const items = rawItems
    .map((item): NormalizedCartItem | null => {
      const cartItem = asRecord(item)
      const product = asRecord(cartItem.product)

      const quantity = asNumber(cartItem.quantity, 0)
      const unitPrice = asNumber(cartItem.unitPrice ?? cartItem.unit_price ?? product.price, 0)
      const subtotal = asNumber(cartItem.subtotal ?? cartItem.sub_total, unitPrice * quantity)

      return {
        id: asString(cartItem.id),
        productId: asString(product.id),
        name: asString(product.name ?? product.title, "Product"),
        slug: asString(product.slug),
        image: asString(product.image ?? product.thumbnail_url ?? product.optimized_url),
        inStock: typeof product.inStock === "boolean"
          ? product.inStock
          : typeof product.in_stock === "boolean"
            ? product.in_stock
            : true,
        quantity,
        unitPrice,
        subtotal,
      }
    })
    .filter((item): item is NormalizedCartItem => !!item && item.id.length > 0)

  const derivedTotal = items.reduce((sum, item) => sum + item.subtotal, 0)
  const derivedItemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    items,
    total: asNumber(cart.total, derivedTotal),
    itemCount: asNumber(cart.itemCount ?? cart.item_count, derivedItemCount),
  }
}

export function useCart(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: cartKeys.cart(),
    queryFn: () => cartApi.get(),
    enabled: options?.enabled ?? true,
  })
}

export function useAddToCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AddToCartRequest) => cartApi.add(data),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: cartKeys.cart() })
      const previousCart = queryClient.getQueryData(cartKeys.cart())
      return { previousCart }
    },
    onError: (_, __, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.cart(), context.previousCart)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart() })
    },
  })
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: string; data: UpdateCartItemRequest }) =>
      cartApi.update(itemId, data),
    onMutate: async ({ itemId, data }) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.cart() })
      const previousCart = queryClient.getQueryData<{ data: unknown }>(cartKeys.cart())
      
      if (previousCart?.data) {
        const normalized = normalizeCartData(previousCart.data)
        const updatedItems = normalized.items.map((item) =>
          item.id === itemId
            ? { ...item, quantity: data.quantity, subtotal: item.unitPrice * data.quantity }
            : item
        )
        const newTotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0)
        const newCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        
        queryClient.setQueryData(cartKeys.cart(), {
          ...previousCart,
          data: {
            items: updatedItems,
            total: newTotal,
            itemCount: newCount,
          },
        })
      }
      
      return { previousCart }
    },
    onError: (_, __, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.cart(), context.previousCart)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart() })
    },
  })
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: string) => cartApi.remove(itemId),
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.cart() })
      const previousCart = queryClient.getQueryData<{ data: unknown }>(cartKeys.cart())
      
      if (previousCart?.data) {
        const normalized = normalizeCartData(previousCart.data)
        const updatedItems = normalized.items.filter((item) => item.id !== itemId)
        const newTotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0)
        const newCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        
        queryClient.setQueryData(cartKeys.cart(), {
          ...previousCart,
          data: {
            items: updatedItems,
            total: newTotal,
            itemCount: newCount,
          },
        })
      }
      
      return { previousCart }
    },
    onError: (_, __, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.cart(), context.previousCart)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart() })
    },
  })
}

export function useClearCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => cartApi.clear(),
    onSuccess: () => {
      queryClient.setQueryData(cartKeys.cart(), {
        success: true,
        data: { items: [], total: 0, itemCount: 0 },
      })
    },
  })
}
