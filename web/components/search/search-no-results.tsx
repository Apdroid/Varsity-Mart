"use client"

import { SearchX } from "lucide-react"

import { Product, ProductCard } from "@/components/main/product-card"
import { Button } from "@/components/ui/button"

type SearchNoResultsProps = {
  query: string
  popularProducts: Product[]
  onClearFilters?: () => void
  hasActiveFilters?: boolean
}

export function SearchNoResults({
  query,
  popularProducts,
  onClearFilters,
  hasActiveFilters,
}: SearchNoResultsProps) {
  return (
    <div className="space-y-8 py-10">
      <div className="mx-auto max-w-md space-y-4 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-muted text-muted-foreground">
          <SearchX className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            No results for &quot;{query}&quot;
          </h2>
          <p className="text-sm text-muted-foreground">
            Try a different search or remove some filters
          </p>
        </div>
        {hasActiveFilters && onClearFilters && (
          <Button
            onClick={onClearFilters}
            className="rounded-md bg-vm-tangerine text-vm-tangerine-foreground hover:bg-vm-tangerine/90"
          >
            Clear all filters
          </Button>
        )}
      </div>

      {popularProducts.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">You might like these</h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
