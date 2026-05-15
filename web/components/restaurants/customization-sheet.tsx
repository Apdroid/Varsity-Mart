"use client"

import * as React from "react"
import Image from "next/image"
import { Flame } from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NotesInput } from "./notes-input"
import { QuantityStepper } from "./quantity-stepper"
import { useCartStore } from "@/store/cart-store"
import type { MenuItem, RestaurantWithMenu } from "@/lib/api/types"

type Props = {
  item: MenuItem | null
  restaurant: RestaurantWithMenu
  open: boolean
  onClose: () => void
}

function formatGHS(n: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(n)
}

function CustomizationBody({
  item,
  restaurant,
  onClose,
}: {
  item: MenuItem
  restaurant: RestaurantWithMenu
  onClose: () => void
}) {
  const addLine = useCartStore((s) => s.addLine)
  const [notes, setNotes] = React.useState("")
  const [qty, setQty] = React.useState(1)

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
      notes,
      quantity: qty,
      unitPrice: item.price,
    })
    toast.success(`${item.name} added to cart`)
    onClose()
  }

  const showHalal = item.tags.includes("halal")

  const DietaryBadges = () => (
    <div className="flex flex-wrap gap-1.5">
      {item.isVegetarian && (
        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
          Vegetarian
        </span>
      )}
      {showHalal && (
        <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold text-sky-600">
          Halal
        </span>
      )}
    </div>
  )

  return (
    <div className="grid h-full min-h-0 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <aside className="hidden min-h-0 border-r border-border bg-card md:grid md:grid-rows-[minmax(13rem,38%)_1fr]">
        <div className="relative h-full w-full overflow-hidden">
          {item.image ? (
            <Image src={item.image} alt={item.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
              No image
            </div>
          )}
        </div>
        <div className="min-h-0 space-y-3 overflow-y-auto p-5">
          <DietaryBadges />
          <h2 className="text-xl font-bold leading-tight">{item.name}</h2>
          <p className="text-sm text-muted-foreground">{item.description}</p>
          {item.spicyLevel > 0 && (
            <div className="flex items-center gap-1">
              {Array.from({ length: item.spicyLevel }).map((_, i) => (
                <Flame key={i} className="h-4 w-4 text-orange-500" />
              ))}
              <span className="text-xs text-muted-foreground">
                {item.spicyLevel === 1 ? "Mild" : item.spicyLevel === 2 ? "Medium" : "Hot"}
              </span>
            </div>
          )}
          {item.preparationTime && (
            <p className="text-xs text-muted-foreground">Prep time: {item.preparationTime}</p>
          )}
          <div className="rounded-xl bg-background p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Total
            </p>
            <p className="mt-1 text-2xl font-extrabold text-vm-tangerine">
              {formatGHS(item.price * qty)}
            </p>
          </div>
        </div>
      </aside>

      <div className="flex min-h-0 flex-col">
        <div className="relative h-40 w-full shrink-0 overflow-hidden md:hidden">
          {item.image ? (
            <Image src={item.image} alt={item.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-5 px-5 py-4 md:space-y-6 md:px-6">
            <div className="md:hidden">
              <DietaryBadges />
              <h2 className="mt-1.5 text-lg font-bold leading-snug">{item.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              {item.spicyLevel > 0 && (
                <div className="mt-1 flex items-center gap-1">
                  {Array.from({ length: item.spicyLevel }).map((_, i) => (
                    <Flame key={i} className="h-3.5 w-3.5 text-orange-500" />
                  ))}
                </div>
              )}
            </div>
            <NotesInput value={notes} onChange={setNotes} />
          </div>
        </ScrollArea>

        <div className="shrink-0 border-t border-border bg-background px-5 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <QuantityStepper value={qty} onChange={setQty} />
            <button
              type="button"
              onClick={handleAdd}
              className="flex flex-1 items-center justify-between rounded-xl bg-vm-tangerine px-4 py-3 font-semibold text-white transition-opacity hover:opacity-90"
            >
              <span>Add to cart</span>
              <span>{formatGHS(item.price * qty)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CustomizationSheet({ item, restaurant, open, onClose }: Props) {
  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="flex h-[88vh] w-[96vw] max-w-none flex-col gap-0 overflow-hidden p-0 sm:h-[90vh] sm:max-h-[46rem] sm:w-[92vw] sm:max-w-5xl">
        <DialogTitle className="sr-only">{item.name}</DialogTitle>
        <CustomizationBody
          key={item.id}
          item={item}
          restaurant={restaurant}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}
