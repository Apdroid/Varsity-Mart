"use client"

import Image from "next/image"
import { Plus, Flame, Clock } from "lucide-react"
import { toast } from "sonner"
import { useCartStore } from "@/store/cart-store"
import type { MenuItem, RestaurantWithMenu } from "@/lib/api/types"

type Props = {
  item: MenuItem
  restaurant: RestaurantWithMenu
}

function formatGHS(n: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(n)
}

export function MenuItemCard({ item, restaurant }: Props) {
  const addLine = useCartStore((s) => s.addLine)

  const handleAdd = () => {
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
      unitPrice: item.price,
    })
    toast.success(`${item.name} added to cart`)
  }

  const showHalal = item.tags.includes("halal")

  return (
    <div className="group flex gap-3 rounded-xl border border-border bg-card p-3 transition-shadow hover:shadow-sm">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted md:h-24 md:w-24">
        <Image
          src={item.image}
          alt={item.name}
          width={96}
          height={96}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          {(item.isVegetarian || showHalal) && (
            <div className="mb-1 flex flex-wrap gap-1">
              {item.isVegetarian && (
                <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-600">
                  Veg
                </span>
              )}
              {showHalal && (
                <span className="rounded-full bg-sky-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-sky-600">
                  Halal
                </span>
              )}
            </div>
          )}
          <p className="text-sm font-semibold leading-snug">{item.name}</p>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
          <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
            {item.preparationTime && (
              <span className="flex items-center gap-0.5">
                <Clock className="h-3 w-3" />
                {item.preparationTime}
              </span>
            )}
            {item.spicyLevel > 0 && (
              <span className="flex items-center gap-0.5 text-orange-500">
                {Array.from({ length: item.spicyLevel }).map((_, i) => (
                  <Flame key={i} className="h-3 w-3" />
                ))}
              </span>
            )}
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-extrabold text-vm-tangerine">{formatGHS(item.price)}</span>
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-1 rounded-full bg-vm-tangerine px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-vm-tangerine/90 active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
