"use client"

import * as React from "react"
import { Star, Package, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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
    <Link
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

        {/* Status badge — visible label so non-technical users understand */}
        <span
          className={cn(
            "absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full border border-card px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide whitespace-nowrap",
            store.isOpen
              ? "bg-emerald-500 text-white"
              : "bg-muted-foreground text-white"
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", store.isOpen ? "bg-white/80 animate-pulse" : "bg-white/50")} />
          {store.isOpen ? "Open" : "Closed"}
        </span>
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
    </Link>
  )
}
