import Link from "next/link"
import { Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/main/product-card"
import type { Product } from "@/components/main/product-card"

type Props = {
  products: Product[]
  heading?: string
  categoryId?: string
}

export function SimilarProducts({ products, heading = "Similar Products", categoryId }: Props) {
  if (products.length === 0) return null

  const href = categoryId ? `/search?category=${categoryId}` : "/search"

  return (
    <section className="mt-12 border-t border-border pt-12">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold font-heading">
          <Sparkles className="h-5 w-5 text-vm-tangerine" />
          {heading}
        </h2>
        <Button variant="ghost" size="sm" asChild className="gap-1 text-sm">
          <Link href={href}>
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      {/* Mobile: horizontal scroll; desktop: grid */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 md:grid-cols-6">
        {products.slice(0, 8).map((p) => (
          <div key={p.id} className="w-48 shrink-0 sm:w-auto">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  )
}
