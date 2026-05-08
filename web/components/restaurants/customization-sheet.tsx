"use client"

import * as React from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { OptionGroup } from "./option-group"
import { SidesSelector } from "./sides-selector"
import { ModifierPill } from "./modifier-pill"
import { NotesInput } from "./notes-input"
import { QuantityStepper } from "./quantity-stepper"
import { BundleSuggestions } from "./bundle-suggestions"
import { useCartStore } from "@/store/cart-store"
import type { MenuItem, MenuItemOption, RestaurantWithMenu } from "@/data/restaurant"

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

function DietaryBadge({ tag }: { tag: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    vegetarian: { label: "Vegetarian", cls: "bg-emerald-500/10 text-emerald-600" },
    vegan: { label: "Vegan", cls: "bg-green-500/10 text-green-600" },
    halal: { label: "Halal", cls: "bg-sky-500/10 text-sky-600" },
  }
  const entry = map[tag]
  if (!entry) return null
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${entry.cls}`}>
      {entry.label}
    </span>
  )
}

export function CustomizationSheet({ item, restaurant, open, onClose }: Props) {
  const addLine = useCartStore((s) => s.addLine)

  const [selectedSize, setSelectedSize] = React.useState<MenuItemOption | null>(null)
  const [selectedProtein, setSelectedProtein] = React.useState<MenuItemOption | null>(null)
  const [selectedSides, setSelectedSides] = React.useState<MenuItemOption[]>([])
  const [selectedModifiers, setSelectedModifiers] = React.useState<string[]>([])
  const [notes, setNotes] = React.useState("")
  const [qty, setQty] = React.useState(1)

  React.useEffect(() => {
    if (!open || !item) return
    setSelectedSize(item.sizeOptions?.[0] ?? null)
    setSelectedProtein(item.proteinOptions?.[0] ?? null)
    setSelectedSides([])
    setSelectedModifiers([])
    setNotes("")
    setQty(1)
  }, [open, item?.id])

  if (!item) return null

  const unitPrice =
    item.basePrice +
    (selectedSize?.priceMod ?? 0) +
    (selectedProtein?.priceMod ?? 0) +
    selectedSides.reduce((s, o) => s + o.priceMod, 0)

  const toggleModifier = (mod: string) =>
    setSelectedModifiers((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    )

  const canAdd = !item.sizeOptions || selectedSize !== null

  const handleAdd = () => {
    if (!canAdd) return
    addLine({
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      itemId: item.id,
      itemName: item.name,
      itemImage: item.image,
      selectedSize,
      selectedProtein,
      selectedSides,
      selectedModifiers,
      notes,
      quantity: qty,
      unitPrice,
    })
    toast.success(`${item.name} added to order`)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogTitle className="sr-only">{item.name}</DialogTitle>

        {/* Hero image */}
        <div className="relative h-44 w-full shrink-0 overflow-hidden">
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
        </div>

        {/* Scrollable body */}
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="space-y-5 px-5 py-4">
            {/* Item header */}
            <div>
              <div className="flex flex-wrap gap-1.5">
                {item.dietaryTags?.map((t) => <DietaryBadge key={t} tag={t} />)}
              </div>
              <h2 className="mt-1.5 text-lg font-bold leading-snug">{item.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              {item.allergens && item.allergens.length > 0 && (
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Contains: {item.allergens.join(", ")}
                </p>
              )}
            </div>

            {/* Notes — prominent, not buried */}
            <NotesInput value={notes} onChange={setNotes} />

            <Separator />

            {/* Size */}
            {item.sizeOptions && (
              <>
                <OptionGroup
                  label="Size"
                  required
                  options={item.sizeOptions}
                  selected={selectedSize}
                  onChange={setSelectedSize}
                />
                <Separator />
              </>
            )}

            {/* Protein */}
            {item.proteinOptions && (
              <>
                <OptionGroup
                  label="Protein"
                  options={item.proteinOptions}
                  selected={selectedProtein}
                  onChange={setSelectedProtein}
                />
                <Separator />
              </>
            )}

            {/* Sides / Add-ons */}
            {item.sides && (
              <>
                <SidesSelector
                  config={item.sides}
                  selected={selectedSides}
                  onChange={setSelectedSides}
                />
                <Separator />
              </>
            )}

            {/* Modifiers */}
            {item.modifiers && item.modifiers.length > 0 && (
              <>
                <div>
                  <p className="mb-2.5 text-sm font-semibold">Preferences</p>
                  <div className="flex flex-wrap gap-2">
                    {item.modifiers.slice(0, 8).map((mod) => (
                      <ModifierPill
                        key={mod}
                        label={mod}
                        active={selectedModifiers.includes(mod)}
                        onToggle={() => toggleModifier(mod)}
                      />
                    ))}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Bundle suggestions */}
            {item.bundleSuggestionIds && item.bundleSuggestionIds.length > 0 && (
              <BundleSuggestions
                restaurant={restaurant}
                suggestionIds={item.bundleSuggestionIds}
              />
            )}
          </div>
        </ScrollArea>

        {/* Sticky footer */}
        <div className="shrink-0 border-t border-border bg-background px-5 py-4">
          <div className="flex items-center gap-3">
            <QuantityStepper value={qty} onChange={setQty} />
            <button
              type="button"
              disabled={!canAdd}
              onClick={handleAdd}
              className="flex flex-1 items-center justify-between rounded-xl bg-vm-tangerine px-4 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <span>Add to order</span>
              <span>{formatGHS(unitPrice * qty)}</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
