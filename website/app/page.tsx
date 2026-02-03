"use client"

import { CategoriesCarousel } from "@/components/categories-carousel";
import { FeaturedProducts } from "@/components/home/featured-products";
import CampusMarketSlider from "@/components/home/hero-slider";
import { ProductsCarousel } from "@/components/home/products-carousel";
import { RestaurantsCarousel } from "@/components/home/restaurants-carousel";
import { StoresCarousel } from "@/components/home/stores-carousel";
import { MainLayout } from "@/components/layout/main-layout";
import { mockProducts } from "@/data/products/products";
import { mockRestaurants } from "@/data/food/restaurants";
import { mockStores } from "@/data/stores/stores";
import { useProducts } from "@/hooks/use-products";
import { Loader2 } from "lucide-react";

export default function Home() {
	const { data: newArrivalsResponse, isLoading: isProductsLoading } = useProducts({ limit: 12 });
	const { data: dealsResponse, isLoading: isDealsLoading } = useProducts({ limit: 12 });

	const newArrivals = Array.isArray(newArrivalsResponse?.data) ? newArrivalsResponse.data : [];
	const hotDeals = Array.isArray(dealsResponse?.data) 
		? dealsResponse.data.filter(p => p.compareAtPrice) 
		: [];

	return (
		<MainLayout>
			<CampusMarketSlider />

			{/* Featured Products Section */}
			<FeaturedProducts />

			{/* Restaurants Carousel */}
			<section className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
				<div className="mx-auto max-w-360">
					<RestaurantsCarousel
						restaurants={mockRestaurants.slice(0, 10)}
						showBanner={true}
						title="Hungry? Order Now"
						subtitle="Fresh meals delivered from campus restaurants"
					/>
				</div>
			</section>

			{/* New Arrivals Carousel */}
			<section className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-background">
				<div className="mx-auto max-w-360">
					{isProductsLoading ? (
						<div className="flex justify-center py-12">
							<Loader2 className="h-8 w-8 animate-spin text-primary" />
						</div>
					) : (
						<ProductsCarousel
							products={newArrivals}
							title="New Arrivals"
							subtitle="Fresh listings from campus sellers"
							badge="Just In"
							viewAllLink="/products?sort=newest"
							viewAllText="See All New"
						/>
					)}
				</div>
			</section>

			{/* Campus Stores Carousel */}
			<section className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
				<div className="mx-auto max-w-360">
					<StoresCarousel
						stores={mockStores.slice(0, 10)}
						showBanner={true}
						title="Campus Stores"
						subtitle="Shop from verified student-run businesses"
					/>
				</div>
			</section>

			{/* Categories */}
			<CategoriesCarousel />

			{/* Deals Carousel */}
			<section className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-background">
				<div className="mx-auto max-w-360">
					{isDealsLoading ? (
						<div className="flex justify-center py-12">
							<Loader2 className="h-8 w-8 animate-spin text-primary" />
						</div>
					) : hotDeals.length > 0 && (
						<ProductsCarousel
							products={hotDeals}
							title="Hot Deals"
							subtitle="Best discounts on campus"
							badge="🔥 On Sale"
							viewAllLink="/deals"
							viewAllText="View All Deals"
						/>
					)}
				</div>
			</section>
		</MainLayout>

	);
}
