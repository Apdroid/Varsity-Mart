import { MainLayout } from "@/components/layout/main-layout"
import { StoreDetailContent } from "@/components/stores/store-detail-content"
import { getMockStoreDetailResponse } from "@/data/api/stores/detail"
import { getMockStoreProductsResponse } from "@/data/api/stores/products"

export const metadata = {
  title: "Store - VarsityMart",
  description: "View store details on VarsityMart",
}

export default async function StoreDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Get mock data matching API response structure
  const storeResponse = getMockStoreDetailResponse(id);
  const productsResponse = getMockStoreProductsResponse(id);
  
  return (
    <MainLayout>
      <StoreDetailContent 
        storeId={id} 
        initialStore={storeResponse.data} 
        initialProducts={productsResponse.data.products} 
      />
    </MainLayout>
  )
}
