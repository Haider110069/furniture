"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product } from "./products"
import { cartLineId } from "./products"

export interface CartItem {
  lineId: string
  product: Product
  quantity: number
  selectedColor: string
}

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, quantity?: number, color?: string) => void
  removeItem: (lineId: string) => void
  updateQuantity: (lineId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, color = product.colors[0]) => {
        const lineId = cartLineId(product.id, color)
        set((state) => {
          const existingItem = state.items.find((item) => item.lineId === lineId)

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.lineId === lineId ? { ...item, quantity: item.quantity + quantity } : item
              ),
            }
          }

          return {
            items: [...state.items, { lineId, product, quantity, selectedColor: color }],
          }
        })
      },

      removeItem: (lineId) => {
        set((state) => ({
          items: state.items.filter((item) => item.lineId !== lineId),
        }))
      },

      updateQuantity: (lineId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(lineId)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.lineId === lineId ? { ...item, quantity } : item
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        )
      },
    }),
    { name: "furni-cart-v2" }
  )
)
