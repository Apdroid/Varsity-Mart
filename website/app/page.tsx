import { CategoriesCarousel } from "@/components/categories-carousel";
import { FeaturedProducts } from "@/components/home/featured-products";
import CampusMarketSlider from "@/components/home/hero-slider";
import { LiveProductsSection } from "@/components/home/live-products-section";
import { LiveRestaurantsSection } from "@/components/home/live-restaurants-section";
import { LiveStoresSection } from "@/components/home/live-stores-section";
import { MainLayout } from "@/components/layout/main-layout";

export default function Home() {
	return (
		<MainLayout>
			<CampusMarketSlider />

			{/* Featured Products */}
			<FeaturedProducts />

			{/* Restaurants */}
			<section className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
				<div className="mx-auto max-w-360">
					<LiveRestaurantsSection />
				</div>
			</section>

			{/* New Arrivals */}
			<section className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-background">
				<div className="mx-auto max-w-360">
					<LiveProductsSection
						title="New Arrivals"
						subtitle="Fresh listings from campus sellers"
						badge="Just In"
						viewAllLink="/products?sort=newest"
						viewAllText="See All New"
						filters={{ ordering: "-createdAt" }}
					/>
				</div>
			</section>

			{/* Campus Stores */}
			<section className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
				<div className="mx-auto max-w-360">
					<LiveStoresSection />
				</div>
			</section>

			{/* Categories */}
			<CategoriesCarousel />

			{/* Hot Deals */}
			<section className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-background">
				<div className="mx-auto max-w-360">
					<LiveProductsSection
						title="Hot Deals"
						subtitle="Best discounts on campus"
						badge="🔥 On Sale"
						viewAllLink="/deals"
						viewAllText="View All Deals"
						filters={{ badges: "hot" }}
					/>
				</div>
			</section>
		</MainLayout>
	);
}
