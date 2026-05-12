import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/main/product-card"
import type { Product, ProductSeller } from "@/components/main/product-card"

type Props = {
  seller: ProductSeller
  products: Product[]
  currentProductId: string
}

export function MoreFromSeller({ seller, products, currentProductId }: Props) {
  const visible = products.filter((p) => p.id !== currentProductId).slice(0, 4)

  if (visible.length === 0) return null

  return (
    <section className="mt-12 border-t border-border pt-12">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold font-heading">More from {seller.name}</h2>
        <Button variant="ghost" size="sm" asChild className="gap-1 text-sm">
          <Link href={`/stores/${seller.id}`}>
            View store <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {visible.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
