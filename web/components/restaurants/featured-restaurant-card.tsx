"use client"

import Image from "next/image"
import Link from "next/link"
import { Clock, Star } from "lucide-react"

import type { Restaurant } from "@/components/main/restaurant-card"
import { Button } from "@/components/ui/button"

type FeaturedRestaurantCardProps = {
  restaurant: Restaurant
}

function compactNumber(n: number) {
  if (n < 1000) return n.toString()
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n)
}

export function FeaturedRestaurantCard({
  restaurant,
}: FeaturedRestaurantCardProps) {
  return (
    <article className="group relative min-h-56 overflow-hidden rounded-md border border-border bg-card">
      <Image
        src={restaurant.banner}
        alt={restaurant.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-foreground/90 via-foreground/35 to-transparent dark:bg-linear-to-t dark:from-card/85 dark:via-card/35" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="mb-3 flex items-center gap-2 text-xs text-background/90 dark:text-foreground">
          <span className="inline-flex items-center gap-1 rounded-full bg-background/15 px-2 py-1 backdrop-blur-sm">
            <Clock className="h-3.5 w-3.5" />
            {restaurant.deliveryTime}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-background/15 px-2 py-1 backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 fill-vm-tangerine text-vm-tangerine" />
            {Number.parseFloat(restaurant.rating).toFixed(1)} (
            {compactNumber(restaurant.totalReviews)})
          </span>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-background/80 dark:text-foreground">{restaurant.category}</p>
            <h3 className="text-lg font-bold text-background dark:text-foreground">
              {restaurant.name}
            </h3>
          </div>
          <Button
            asChild
            size="sm"
            className="bg-vm-tangerine text-vm-tangerine-foreground hover:bg-vm-tangerine/90"
          >
            <Link href={`/restaurants/${restaurant.id}`}>Order now →</Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
