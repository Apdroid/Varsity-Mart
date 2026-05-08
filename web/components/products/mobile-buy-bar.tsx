"use client"

import { ShoppingCart } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

type Props = {
  price: string
  title: string
  status: string
}

function formatGHS(amount: string) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(Number(amount))
}

export function MobileBuyBar({ price, title, status }: Props) {
  const isSoldOut = status !== "active"

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-md lg:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">Price</p>
          <p className="text-lg font-extrabold">{formatGHS(price)}</p>
        </div>
        <Button
          size="lg"
          disabled={isSoldOut}
          className="shrink-0 bg-vm-tangerine font-semibold text-vm-tangerine-foreground hover:bg-vm-tangerine/90 disabled:opacity-60"
          onClick={() =>
            toast.success("Added to cart", {
              description: title,
              action: { label: "View Cart", onClick: () => {} },
            })
          }
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isSoldOut ? "Sold Out" : "Add to Cart"}
        </Button>
      </div>
    </div>
  )
}
