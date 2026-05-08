"use client"

import Image from "next/image"
import { MessageSquare, Phone, Store, MapPin, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ProductSeller } from "@/components/main/product-card"

type Props = {
  seller: ProductSeller
  location: string
}

export function SellerCard({ seller, location }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        Seller
      </h3>

      <div className="flex items-start gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-muted">
          <Image
            src={seller.avatar}
            alt={seller.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{seller.name}</p>
          <div className="mt-0.5 flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="font-medium">{seller.rating}</span>
            </div>
            <span className="text-xs text-muted-foreground">·</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Button variant="outline" size="sm" className="flex-col gap-1 h-auto py-2.5 text-xs font-medium">
          <MessageSquare className="h-4 w-4" />
          Message
        </Button>
        <Button variant="outline" size="sm" className="flex-col gap-1 h-auto py-2.5 text-xs font-medium">
          <Phone className="h-4 w-4" />
          Call
        </Button>
        <Button variant="outline" size="sm" className="flex-col gap-1 h-auto py-2.5 text-xs font-medium">
          <Store className="h-4 w-4" />
          Store
        </Button>
      </div>
    </div>
  )
}
