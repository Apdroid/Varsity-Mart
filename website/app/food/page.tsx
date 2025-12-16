import { MainLayout } from "@/components/layout/main-layout";
import { FoodRestaurantsPage } from "@/components/food/food-page-content";
import { mockRestaurants } from "@/components/home/restaurant-section";

export const metadata = {
	title: "Food & Restaurants - VarsityMart",
	description: "Order food from campus restaurants on VarsityMart",
};

export default function FoodPage() {
	return (
		<MainLayout>
			<FoodRestaurantsPage  restaurants={mockRestaurants} />
		</MainLayout>
	);
}
