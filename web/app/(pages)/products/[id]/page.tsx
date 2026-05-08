import { mockProducts } from "@/data/product"
import { mockReviews } from "@/data/reviews"
import { notFound } from "next/navigation"
import { ProductDetailView } from "@/components/products/product-detail-view"

type Props = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
  const { id } = await params
  const product = mockProducts.find((p) => p.id === id)
  if (!product) notFound()

  const related = mockProducts
    .filter((p) => p.category.id === product.category.id && p.id !== product.id)
    .slice(0, 8)

  const recommended = mockProducts
    .filter((p) => p.id !== product.id && !related.some((r) => r.id === p.id))
    .slice(0, 4)

  return (
    <ProductDetailView
      product={product}
      related={related}
      recommended={recommended}
      reviews={mockReviews}
    />
  )
}
