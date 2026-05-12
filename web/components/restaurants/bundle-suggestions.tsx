"use client"

import { Plus } from "lucide-react"
import { toast } from "sonner"
import { useCartStore } from "@/store/cart-store"
import type { MenuItem, RestaurantWithMenu } from "@/lib/api/types"

type Props = {
  restaurant: RestaurantWithMenu
  suggestionIds: string[]
}

function formatGHS(n: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(n)
}

export function BundleSuggestions({ restaurant, suggestionIds }: Props) {
  const addLine = useCartStore((s) => s.addLine)

  const items = suggestionIds
    .map((id) => restaurant.menu.items.find((i) => i.id === id))
    .filter((i): i is MenuItem => !!i)
    .slice(0, 3)

  if (items.length === 0) return null

  const handleAdd = (item: MenuItem) => {
    addLine({
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      itemId: item.id,
      itemName: item.name,
      itemImage: item.image,
      selectedSize: null,
      selectedProtein: null,
      selectedSides: [],
      selectedModifiers: [],
      notes: "",
      quantity: 1,
      unitPrice: item.basePrice,
    })
    toast.success(`${item.name} added`)
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Frequently ordered with this
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex min-w-[130px] shrink-0 flex-col gap-2 rounded-xl border border-border bg-card p-2"
          >
            <img
              src={item.image}
              alt={item.name}
              className="aspect-square w-full rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="line-clamp-1 text-xs font-semibold leading-snug">{item.name}</p>
              <p className="mt-0.5 text-xs font-bold text-vm-tangerine">{formatGHS(item.basePrice)}</p>
            </div>
            <button
              type="button"
              onClick={() => handleAdd(item)}
              className="flex w-full items-center justify-center gap-1 rounded-full bg-vm-tangerine/10 py-1 text-xs font-semibold text-vm-tangerine transition-colors hover:bg-vm-tangerine/20"
            >
              <Plus className="h-3 w-3" />
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
