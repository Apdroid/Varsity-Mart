"use client"

import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Review } from "@/components/products/product-detail-view"

type Props = {
  reviews: Review[]
  className?: string
}

export function RatingDistribution({ reviews, className }: Props) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const id = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(id)
  }, [])

  const total = reviews.length
  const avg =
    total === 0 ? 0 : reviews.reduce((s, r) => s + r.rating, 0) / total

  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: total === 0 ? 0 : (reviews.filter((r) => r.rating === star).length / total) * 100,
  }))

  return (
    <div className={cn("flex gap-6", className)}>
      {/* Average score */}
      <div className="flex shrink-0 flex-col items-center justify-center">
        <span className="text-5xl font-extrabold leading-none">{avg.toFixed(1)}</span>
        <div className="mt-1.5 flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={cn(
                "h-4 w-4",
                s <= Math.round(avg)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-muted text-muted"
              )}
            />
          ))}
        </div>
        <span className="mt-1 text-xs text-muted-foreground">
          {total} review{total !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Bars */}
      <div className="flex flex-1 flex-col justify-center gap-1.5">
        {counts.map(({ star, count, pct }) => (
          <div key={star} className="flex items-center gap-2">
            <span className="w-4 shrink-0 text-right text-xs font-medium">{star}</span>
            <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" />
            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-amber-400 transition-all duration-700 ease-out"
                style={{ width: mounted ? `${pct}%` : "0%" }}
              />
            </div>
            <span className="w-5 shrink-0 text-xs text-muted-foreground">{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
