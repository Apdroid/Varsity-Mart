import { MainLayout } from "@/components/layout/main-layout"
import { FoodPageContent } from "@/components/food/food-page-content"

export const metadata = {
  title: "Food & Restaurants - VarsityMart",
  description: "Order food from campus restaurants on VarsityMart",
}

export default function FoodPage() {
  return (
    <MainLayout>
      <FoodPageContent />
    </MainLayout>
  )
}
