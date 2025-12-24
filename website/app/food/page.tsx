import {
	mockRestaurants,
	RestaurantsSectionExample,
} from "@/components/home/restaurant-section";
import { MainLayout } from "@/components/layout/main-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Food & Restaurants - VarsityMart",
	description: "Order food from campus restaurants on VarsityMart",
};

export default function FoodPage() {
	return (
		<MainLayout>
			<RestaurantsSectionExample />
		</MainLayout>
	);
}
