import { MainLayout } from "@/components/layout/main-layout"
import { RestaurantDetailContent } from "@/components/food/restaurant-detail-content"
import { getMockRestaurantDetailResponse } from "@/data/api/restaurants/detail"
import { getMockRestaurantMenuResponse } from "@/data/api/restaurants/menu"

export const metadata = {
  title: "Restaurant - VarsityMart",
  description: "Order food from this restaurant",
}

export default async function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Get mock data matching API response structure
  const restaurantResponse = getMockRestaurantDetailResponse(id);
  const menuResponse = getMockRestaurantMenuResponse(id);
  
 return (
    <MainLayout>
      <RestaurantDetailContent 
        restaurantId={id} 
        initialRestaurant={restaurantResponse.data} 
        initialMenu={menuResponse.data} 
      />
    </MainLayout>
  )
}
