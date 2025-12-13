import { MainLayout } from "@/components/layout/main-layout"
import { RestaurantDetailContent } from "@/components/food/restaurant-detail-content"

export const metadata = {
  title: "Restaurant - VarsityMart",
  description: "Order food from this restaurant",
}

export default async function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <MainLayout>
      <RestaurantDetailContent restaurantId={id} />
    </MainLayout>
  )
}
