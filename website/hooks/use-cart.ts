"use client"

import { useCartStore, type CartItem } from "@/lib/stores/cart-store"

export function useCart() {
  const { items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal, getItem } = useCartStore()

  const isInCart = (productId: string) => items.some((item) => item.product.id === productId)

  const getQuantity = (productId: string) => {
    const item = items.find((i) => i.product.id === productId)
    return item?.quantity ?? 0
  }

  const getItemByProductId = (productId: string) => items.find((i) => i.product.id === productId)

  return {
    items,
    totalItems,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getQuantity,
    getItem: getItemByProductId,
  }
}

export type { CartItem }
