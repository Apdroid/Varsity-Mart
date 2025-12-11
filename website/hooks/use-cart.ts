"use client"

import { useCartStore, type CartItem } from "@/lib/stores/cart.store"

export function useCart() {
  const { items, addItem, removeItem, updateQuantity, clearCart, getTotal, getItemCount } = useCartStore()

  const isInCart = (productId: string) => items.some((item) => item.productId === productId)

  const getQuantity = (productId: string) => {
    const item = items.find((i) => i.productId === productId)
    return item?.quantity ?? 0
  }

  const getItem = (productId: string) => items.find((i) => i.productId === productId)

  return {
    items,
    totalItems: getItemCount(),
    subtotal: getTotal(),
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getQuantity,
    getItem,
  }
}

export type { CartItem }
