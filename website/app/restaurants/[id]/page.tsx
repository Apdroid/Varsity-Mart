import type { Metadata } from "next";
import { MainLayout } from "@/components/layout/main-layout";
import { RestaurantDetailContent } from "@/components/food/restaurant-detail-content";
import { getMockRestaurantDetailResponse } from "@/data/api/restaurants/detail";
import { getMockRestaurantMenuResponse } from "@/data/api/restaurants/menu";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const restaurantResponse = getMockRestaurantDetailResponse(id);
  const restaurant = restaurantResponse.data;

  return {
    title: `${restaurant?.name || "Restaurant"} - Order Food | VarsityMart`,
    description: restaurant?.description || "Order delicious food for delivery on campus",
    openGraph: {
      title: restaurant?.name,
      description: restaurant?.description,
      images: restaurant?.banner ? [restaurant.banner] : [],
    },
  };
}

export default async function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

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
  );
}
