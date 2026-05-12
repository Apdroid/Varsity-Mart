"use client"

import { ShoppingCart } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { QuantityStepper } from "./quantity-stepper"
import { cn } from "@/lib/utils"

type Props = {
  price: string
  title: string
  stock?: number
  quantity: number
  onQuantityChange: (v: number) => void
  actionsVisible: boolean
}

function formatGHS(amount: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function MobileBuyBar({ price, title, stock, quantity, onQuantityChange, actionsVisible }: Props) {
  const isSoldOut = stock === undefined || stock <= 0
  const maxQty = stock !== undefined && stock > 0 ? Math.min(stock, 99) : 99
  const total = Number(price) * quantity

  if (isSoldOut) return null

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-md transition-transform duration-300 lg:hidden",
        actionsVisible ? "translate-y-full" : "translate-y-0"
      )}
    >
      <div className="flex items-center gap-3">
        <QuantityStepper
          value={quantity}
          min={1}
          max={maxQty}
          onChange={onQuantityChange}
          compact
        />
        <Button
          size="lg"
          className="h-9 flex-1 bg-vm-tangerine font-semibold text-vm-tangerine-foreground hover:bg-vm-tangerine/90"
          onClick={() =>
            toast.success(quantity > 1 ? `${quantity} items added to cart` : "Added to cart", {
              description: title,
              action: { label: "View Cart", onClick: () => {} },
            })
          }
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {quantity > 1 ? `Add ${quantity} — ${formatGHS(total)}` : "Add to Cart"}
        </Button>
      </div>
    </div>
  )
}
