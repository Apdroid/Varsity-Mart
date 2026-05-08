import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/main/product-card"
import type { Product } from "@/components/main/product-card"

type Props = {
  products: Product[]
  heading?: string
}

export function SimilarProducts({ products, heading = "Similar Products" }: Props) {
  if (products.length === 0) return null

  const hasMore = products.length >= 8

  return (
    <section className="mt-12">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold">{heading}</h2>
        {hasMore && (
          <Button variant="ghost" size="sm" asChild className="gap-1 text-sm">
            <Link href="/search">
              View more <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {products.slice(0, 8).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
