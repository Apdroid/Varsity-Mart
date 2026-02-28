"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import apiClient from "@/lib/api/client"
import { ENDPOINTS } from "@/lib/api/endpoints"
import type { Product } from "@/types/models"
import { useCartStore, type CartItem } from "@/lib/stores/cart-store"

// Cart query keys
const cartKeys = {
  all: ["cart"] as const,
  detail: () => [...cartKeys.all, "detail"] as const,
}

/**
 * Server-synced cart hook.
 * Falls back to Zustand localStorage cart when offline or API unavailable.
 * Uses optimistic updates for instant UX.
 */
export function useCart() {
  const localCart = useCartStore()
  const queryClient = useQueryClient()

  // Try fetching server cart; fall back to local
  const { data: serverCart, isLoading } = useQuery({
    queryKey: cartKeys.detail(),
    queryFn: async () => {
      try {
        const response = await apiClient.get("/cart/")
        return response.data as { success: boolean; data: { items: CartItem[]; totalItems: number; subtotal: number } }
      } catch {
        // API not available – use local cart
        return null
      }
    },
    staleTime: 1000 * 60,
    retry: false,
  })

  const isServerCart = !!serverCart?.data
  const items = isServerCart ? serverCart.data.items : localCart.items
  const totalItems = isServerCart ? serverCart.data.totalItems : localCart.totalItems
  const subtotal = isServerCart ? serverCart.data.subtotal : localCart.subtotal

  const addItemMutation = useMutation({
    mutationFn: async ({ product, quantity = 1 }: { product: Product; quantity?: number }) => {
      // Always update local store for instant feedback
      localCart.addItem(product, quantity)
      try {
        const response = await apiClient.post("/cart/items/", {
          productId: product.id,
          quantity,
        })
        return response.data
      } catch {
        // Local-only is fine
        return null
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all })
    },
  })

  const removeItemMutation = useMutation({
    mutationFn: async (productId: string) => {
      localCart.removeItem(productId)
      try {
        await apiClient.delete(`/cart/items/${productId}/`)
      } catch {
        // Local-only is fine
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all })
    },
  })

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      localCart.updateQuantity(productId, quantity)
      try {
        await apiClient.patch(`/cart/items/${productId}/`, { quantity })
      } catch {
        // Local-only is fine
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all })
    },
  })

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      localCart.clearCart()
      try {
        await apiClient.delete("/cart/")
      } catch {
        // Local-only is fine
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all })
    },
  })

  const isInCart = (productId: string) => items.some((item) => item.product.id === productId)
  const getQuantity = (productId: string) => items.find((i) => i.product.id === productId)?.quantity ?? 0
  const getItem = (productId: string) => items.find((i) => i.product.id === productId)

  return {
    items,
    totalItems,
    subtotal,
    isLoading,
    addItem: (product: Product, quantity?: number) => addItemMutation.mutate({ product, quantity }),
    removeItem: (productId: string) => removeItemMutation.mutate(productId),
    updateQuantity: (productId: string, quantity: number) =>
      updateQuantityMutation.mutate({ productId, quantity }),
    clearCart: () => clearCartMutation.mutate(),
    isInCart,
    getQuantity,
    getItem,
  }
}

export type { CartItem }
