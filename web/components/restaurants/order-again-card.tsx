"use client"

import Image from "next/image"
import Link from "next/link"

import type { Restaurant } from "@/components/main/restaurant-card"

type OrderAgainCardProps = {
  restaurant: Restaurant
}

export function OrderAgainCard({ restaurant }: OrderAgainCardProps) {
  return (
    <Link
      href={`/restaurants/${restaurant.id}`}
      className="inline-flex min-w-44 items-center gap-3 rounded-md bg-card p-3 transition-colors hover:bg-muted/60"
    >
      <Image
        src={restaurant.logo}
        alt={restaurant.name}
        width={44}
        height={44}
        className="h-11 w-11 rounded-md object-cover"
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">{restaurant.name}</p>
        <p className="text-xs text-vm-tangerine">Order again →</p>
      </div>
    </Link>
  )
}
