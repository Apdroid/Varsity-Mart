import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product } from "@/types/models"

export interface CartItem {
  product: Product
  quantity: number
}

interface CartState {
  items: CartItem[]
  totalItems: number
  subtotal: number

  // Actions
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getItem: (productId: string) => CartItem | undefined
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      subtotal: 0,

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.product.id === product.id)

          let newItems: CartItem[]
          if (existingItem) {
            newItems = state.items.map((item) =>
              item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
            )
          } else {
            newItems = [...state.items, { product, quantity }]
          }

          const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
          const subtotal = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

          return { items: newItems, totalItems, subtotal }
        }),

      removeItem: (productId) =>
        set((state) => {
          const newItems = state.items.filter((item) => item.product.id !== productId)
          const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
          const subtotal = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

          return { items: newItems, totalItems, subtotal }
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return get().removeItem(productId), state
          }

          const newItems = state.items.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
          const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
          const subtotal = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

          return { items: newItems, totalItems, subtotal }
        }),

      clearCart: () => set({ items: [], totalItems: 0, subtotal: 0 }),

      getItem: (productId) => get().items.find((item) => item.product.id === productId),
    }),
    {
      name: "cart-storage",
    },
  ),
)
