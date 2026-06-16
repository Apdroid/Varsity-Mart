"use client"

import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useCartStore } from "@/store/cart-store"
import type { CartLine as CartLineType } from "@/store/cart-store"
import { cn } from "@/lib/utils"
import { qtyButtonClass } from "@/components/restaurants/quantity-stepper"

type Props = {
  line: CartLineType
}

function formatGHS(n: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(n)
}

function CustomizationSummary({ line }: { line: CartLineType }) {
  const parts: string[] = []
  if (line.selectedSize) parts.push(line.selectedSize.name)
  if (line.selectedProtein) parts.push(line.selectedProtein.name)
  if (line.selectedSides.length > 0) parts.push(line.selectedSides.map((s) => s.name).join(", "))
  if (line.selectedModifiers.length > 0) parts.push(line.selectedModifiers.join(", "))
  if (parts.length === 0) return null
  return (
    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
      {parts.join(" · ")}
    </p>
  )
}

export function CartLine({ line }: Props) {
  const { updateQty, removeLine } = useCartStore()

  return (
    <div className="flex gap-3 py-3">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
        {line.itemImage ? (
          <Image
            src={line.itemImage}
            alt={line.itemName}
            width={56}
            height={56}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{line.itemName}</p>
            <CustomizationSummary line={line} />
            {line.notes && (
              <p className="mt-0.5 text-xs italic text-muted-foreground line-clamp-1">
                "{line.notes}"
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => removeLine(line.lineId)}
            className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-bold">{formatGHS(line.lineTotal)}</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => updateQty(line.lineId, -1)}
              disabled={line.quantity <= 1}
              className={cn(qtyButtonClass(line.quantity > 1), "h-6 w-6")}
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-4 text-center text-sm font-semibold tabular-nums">{line.quantity}</span>
            <button
              type="button"
              onClick={() => updateQty(line.lineId, 1)}
              className={cn(qtyButtonClass(true), "h-6 w-6")}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
