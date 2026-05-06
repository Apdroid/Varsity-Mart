"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"

import type { Store } from "@/components/main/stores-card"
import { Button } from "@/components/ui/button"

type FeaturedStoreCardProps = {
  store: Store
}

function compactNumber(n: number) {
  if (n < 1000) return n.toString()
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n)
}

export function FeaturedStoreCard({ store }: FeaturedStoreCardProps) {
  return (
    <article className="group relative min-h-64 overflow-hidden rounded-lg border border-border bg-card">
      <Image
        src={store.logo}
        alt={store.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-foreground/85 via-foreground/35 dark:bg-linear-to-t dark:from-card/85 dark:via-card/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-background/85 dark:opacity-85 dark:text-foreground">
            {store.category}
          </p>
          <h3 className="text-lg font-bold text-background dark:text-foreground">{store.name}</h3>
          <div className="flex items-center gap-2 text-xs text-background/85 dark:text-foreground">
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-vm-tangerine text-vm-tangerine" />
              {Number.parseFloat(store.rating).toFixed(1)}
            </span>
            <span>·</span>
            <span>{compactNumber(store.totalProducts)} products</span>
          </div>
        </div>
        <Button
          asChild
          size="sm"
          className="bg-vm-tangerine text-vm-tangerine-foreground hover:bg-vm-tangerine/90"
        >
          <Link href={`/stores/${store.id}`}>Visit store →</Link>
        </Button>
      </div>
    </article>
  )
}
