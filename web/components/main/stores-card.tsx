"use client"

import * as React from "react"
import { Star, Package, ChevronRight } from "lucide-react"
import Image from "next/image"

import { cn } from "@/lib/utils"

/* -----------------------------------------------------------
   Types — mirrors the API schema
----------------------------------------------------------- */
export type Store = {
  id: string
  name: string
  logo: string
  category: string
  rating: string
  totalReviews: number
  totalProducts: number
  isOpen: boolean
}

/* -----------------------------------------------------------
   Helpers
----------------------------------------------------------- */
function compactNumber(n: number) {
  if (n < 1000) return n.toString()
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n)
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

/* -----------------------------------------------------------
   Store card — horizontal layout, theme-aware
----------------------------------------------------------- */
type StoreCardProps = {
  store: Store
  className?: string
}

export function StoreCard({ store, className }: StoreCardProps) {
  const rating = parseFloat(store.rating)
  const [imgError, setImgError] = React.useState(false)

  return (
    <a
      href={`/stores/${store.id}`}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg p-3 transition-all hover:border-foreground/20 hover:bg-card hover:shadow-sm",
        className
      )}
    >
      {/* ─── Logo ─────────────────────────────────────────── */}
      <div className="relative shrink-0">
        <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-border bg-muted">
          {store.logo && !imgError ? (
            <Image
              src={store.logo}
              alt={store.name}
              width={128}
              height={128}
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-foreground text-sm font-bold text-background">
              {initials(store.name)}
            </div>
          )}
        </div>

        {/* Status dot — anchored to logo */}
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card",
            store.isOpen ? "bg-emerald-500" : "bg-muted-foreground"
          )}
          aria-label={store.isOpen ? "Open" : "Closed"}
        />
      </div>

      {/* ─── Body ─────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-sm font-semibold leading-tight text-foreground transition-colors group-hover:text-vm-tangerine">
            {store.name}
          </h3>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
        </div>

        <p className="truncate text-[11px] uppercase tracking-wider text-muted-foreground">
          {store.category}
        </p>

        {/* Stats row */}
        <div className="mt-1 flex items-center gap-3 text-[11px]">
          {!Number.isNaN(rating) && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-vm-tangerine text-vm-tangerine" />
              <span className="font-semibold text-foreground">
                {rating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">
                ({compactNumber(store.totalReviews)})
              </span>
            </div>
          )}

          <span className="text-muted-foreground/50">·</span>

          <div className="flex items-center gap-1 text-muted-foreground">
            <Package className="h-3 w-3" />
            <span>
              <span className="font-semibold text-foreground">
                {compactNumber(store.totalProducts)}
              </span>{" "}
              products
            </span>
          </div>
        </div>
      </div>
    </a>
  )
}
