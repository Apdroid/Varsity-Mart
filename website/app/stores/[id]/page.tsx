import { MainLayout } from "@/components/layout/main-layout"
import { StoreDetailContent } from "@/components/stores/store-detail-content"

export const metadata = {
  title: "Store - VarsityMart",
  description: "View store details on VarsityMart",
}

export default async function StoreDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <MainLayout>
      <StoreDetailContent storeId={id} />
    </MainLayout>
  )
}
