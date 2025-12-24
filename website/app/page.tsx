import { CategoriesCarousel } from "@/components/categories-carousel";
import { FeaturedProducts } from "@/components/home/featured-products";
import CampusMarketSlider from "@/components/home/hero-slider";
import { RestaurantsSectionExample } from "@/components/home/restaurant-section";
import { MainLayout } from "@/components/layout/main-layout";
export default function Home() {
	return (
		<MainLayout>
			<CampusMarketSlider />
			<FeaturedProducts />
			<CategoriesCarousel />
			<RestaurantsSectionExample />
		</MainLayout>

	);
}
