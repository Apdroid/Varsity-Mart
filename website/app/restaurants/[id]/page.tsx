import type { Metadata } from "next";
import { MainLayout } from "@/components/layout/main-layout";
import { RestaurantDetailContent } from "@/components/food/restaurant-detail-content";

export const metadata: Metadata = {
  title: "Restaurant - Order Food | VarsityMart",
  description: "Order delicious food for delivery on campus",
};

export default async function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <MainLayout>
      <RestaurantDetailContent restaurantId={id} />
    </MainLayout>
  );
}
