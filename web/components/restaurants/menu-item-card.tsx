"use client"

import { Plus } from "lucide-react"
import { toast } from "sonner"
import { useCartStore } from "@/store/cart-store"
import type { MenuItem, RestaurantWithMenu } from "@/data/restaurant"
import { cn } from "@/lib/utils"

type Props = {
  item: MenuItem
  restaurant: RestaurantWithMenu
  onCustomize: (item: MenuItem) => void
}

function formatGHS(n: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(n)
}

const dietaryColors: Record<string, string> = {
  vegetarian: "bg-emerald-500/10 text-emerald-600",
  vegan: "bg-green-500/10 text-green-600",
  halal: "bg-sky-500/10 text-sky-600",
}

export function MenuItemCard({ item, restaurant, onCustomize }: Props) {
  const addLine = useCartStore((s) => s.addLine)

  const handleAdd = () => {
    if (!item.isQuickAdd) {
      onCustomize(item)
      return
    }
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
    <div className="group flex gap-3 rounded-xl border border-border bg-card p-3 transition-shadow hover:shadow-sm">
      {/* Image */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted md:h-24 md:w-24">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          {/* Dietary tags */}
          {item.dietaryTags && item.dietaryTags.length > 0 && (
            <div className="mb-1 flex flex-wrap gap-1">
              {item.dietaryTags.map((tag) => (
                <span
                  key={tag}
                  className={cn("rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase", dietaryColors[tag])}
                >
                  {tag === "vegetarian" ? "Veg" : tag === "vegan" ? "Vegan" : "Halal"}
                </span>
              ))}
            </div>
          )}
          <p className="text-sm font-semibold leading-snug">{item.name}</p>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
          {item.allergens && item.allergens.length > 0 && (
            <p className="mt-0.5 text-[10px] text-muted-foreground/70">
              Contains: {item.allergens.join(", ")}
            </p>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-extrabold text-vm-tangerine">{formatGHS(item.basePrice)}</span>
          <button
            type="button"
            onClick={handleAdd}
            className={cn(
              "flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-all active:scale-95",
              item.isQuickAdd
                ? "bg-vm-tangerine text-white hover:bg-vm-tangerine/90"
                : "border border-vm-tangerine text-vm-tangerine hover:bg-vm-tangerine/10"
            )}
          >
            <Plus className="h-3.5 w-3.5" />
            {item.isQuickAdd ? "Add" : "Customise"}
          </button>
        </div>
      </div>
    </div>
  )
}
