"use client"

import * as React from "react"
import { ShoppingCart, Tag, Heart, Truck } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
  price: string
  originalPrice: string
  status: string
  title: string
}

function formatGHS(amount: string) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(Number(amount))
}

export function ActionsCard({ price, originalPrice, status, title }: Props) {
  const [liked, setLiked] = React.useState(false)
  const isSoldOut = status !== "active"
  const hasDiscount = originalPrice && Number(originalPrice) > Number(price)
  const discountPct = hasDiscount
    ? Math.round((1 - Number(price) / Number(originalPrice)) * 100)
    : 0

  const handleAddToCart = () => {
    toast.success("Added to cart", {
      description: title,
      action: { label: "View Cart", onClick: () => {} },
    })
  }

  const handleMakeOffer = () => {
    toast.info("Offer feature coming soon!")
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      {/* Title + price block */}
      <div className="mb-5">
        <p className="mb-1 text-sm font-semibold leading-snug text-foreground line-clamp-2">{title}</p>
        <div className="flex flex-wrap items-end gap-2">
          <span className="text-3xl font-extrabold tracking-tight">
            {formatGHS(price)}
          </span>
          {hasDiscount && (
            <>
              <span className="mb-0.5 text-base text-muted-foreground line-through">
                {formatGHS(originalPrice)}
              </span>
              <span className="mb-0.5 rounded-full bg-vm-tangerine/15 px-2 py-0.5 text-xs font-bold text-vm-tangerine">
                -{discountPct}%
              </span>
            </>
          )}
        </div>
      </div>

      {isSoldOut ? (
        <div className="mb-4 rounded-xl border border-dashed border-border py-4 text-center text-sm text-muted-foreground">
          This item is no longer available
        </div>
      ) : (
        <div className="mb-4 space-y-2.5">
          <Button
            className="w-full bg-vm-tangerine font-semibold text-vm-tangerine-foreground hover:bg-vm-tangerine/90"
            size="lg"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full font-semibold"
            onClick={handleMakeOffer}
          >
            <Tag className="mr-2 h-4 w-4" />
            Make an Offer
          </Button>
          <Button
            variant="outline"
            size="lg"
            className={cn("w-full font-semibold", liked && "border-red-300 text-red-500")}
            onClick={() => setLiked((v) => !v)}
          >
            <Heart
              className={cn("mr-2 h-4 w-4", liked && "fill-red-500 text-red-500")}
            />
            {liked ? "Saved" : "Save to Favourites"}
          </Button>
        </div>
      )}

      {/* Delivery note */}
      <div className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2.5 text-xs text-muted-foreground">
        <Truck className="h-4 w-4 shrink-0 text-vm-tangerine" />
        <span>
          <span className="font-semibold text-foreground">Free Keber delivery</span> on orders over GHS 50 within KNUST campus
        </span>
      </div>
    </div>
  )
}
