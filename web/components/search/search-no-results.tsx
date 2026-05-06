"use client"

import Link from "next/link"
import { SearchX } from "lucide-react"

import { Product, ProductCard } from "@/components/main/product-card"

type SearchNoResultsProps = {
  query: string
  popularProducts: Product[]
  onBrowseProducts: () => void
}

export function SearchNoResults({
  query,
  popularProducts,
  onBrowseProducts,
}: SearchNoResultsProps) {
  return (
    <div className="space-y-8 py-10">
      <div className="mx-auto max-w-xl space-y-3 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-muted text-muted-foreground">
          <SearchX className="h-8 w-8" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-foreground">
          No results for &quot;{query}&quot;
        </h2>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>Try checking your spelling</p>
          <p>Use fewer keywords</p>
          <button
            type="button"
            onClick={onBrowseProducts}
            className="font-semibold text-vm-tangerine hover:underline"
          >
            Browse all products →
          </button>
        </div>
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">You might like these</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <p className="text-center text-xs text-muted-foreground">
        Need something else?{" "}
        <Link href="/stores" className="text-vm-tangerine hover:underline">
          Browse campus stores
        </Link>
      </p>
    </div>
  )
}
