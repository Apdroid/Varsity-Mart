import { MainLayout } from "@/components/layout/main-layout"
import { ProductDetailContent } from "@/components/products/product-detail-content"
import { getMockProductDetailResponse } from "@/data/api/products/detail"

export const metadata = {
  title: "Product Details - VarsityMart",
  description: "View product details on VarsityMart",
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Get mock data matching API response structure
  const productResponse = getMockProductDetailResponse(id);
  
  return (
    <MainLayout>
      <ProductDetailContent productId={id} initialProduct={productResponse.data} />
    </MainLayout>
  )
}
