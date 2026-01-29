import { MainLayout } from "@/components/layout/main-layout"
import { ProductDetailContent } from "@/components/products/product-detail-content"

export const metadata = {
  title: "Product Details - VarsityMart",
  description: "View product details on VarsityMart",
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  return (
    <MainLayout>
      <ProductDetailContent productId={id} />
    </MainLayout>
  )
}
