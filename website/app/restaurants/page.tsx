import {
	mockRestaurants,
	RestaurantsSectionExample,
} from "@/components/home/restaurant-section";
import { RestaurantsHero } from "@/components/home/restaurants-hero";
import { MainLayout } from "@/components/layout/main-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Food & Restaurants - VarsityMart",
	description: "Order food from campus restaurants on VarsityMart",
};

export default function FoodPage() {
	return (
		<MainLayout>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<RestaurantsHero />
			</div>
			<RestaurantsSectionExample />
		</MainLayout>
	);
}
