"use client"

import * as React from "react"
import { ProductCard } from "@/components/main/product-card"
import type { Product } from "@/components/main/product-card"

const STORAGE_KEY = "vm_recently_viewed"

export function saveRecentlyViewed(product: Product) {
  try {
    const existing: Product[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
    const filtered = existing.filter((p) => p.id !== product.id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify([product, ...filtered].slice(0, 10)))
  } catch {}
}

type Props = {
  currentProductId: string
}

export function RecentlyViewed({ currentProductId }: Props) {
  const [products, setProducts] = React.useState<Product[]>([])

  React.useEffect(() => {
    try {
      const stored: Product[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
      setProducts(stored.filter((p) => p.id !== currentProductId).slice(0, 4))
    } catch {}
  }, [currentProductId])

  if (products.length === 0) return null

  return (
    <section className="mt-12 border-t border-border pt-12">
      <h2 className="mb-5 text-xl font-bold font-heading">Recently Viewed</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
