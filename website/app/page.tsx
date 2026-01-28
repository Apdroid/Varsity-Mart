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

export default function Home() {
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
					<ProductsCarousel
						products={mockProducts.slice(4, 16)}
						title="New Arrivals"
						subtitle="Fresh listings from campus sellers"
						badge="Just In"
						viewAllLink="/products?sort=newest"
						viewAllText="See All New"
					/>
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
					<ProductsCarousel
						products={mockProducts.filter(p => p.compareAtPrice).slice(0, 12)}
						title="Hot Deals"
						subtitle="Best discounts on campus"
						badge="🔥 On Sale"
						viewAllLink="/deals"
						viewAllText="View All Deals"
					/>
				</div>
			</section>
		</MainLayout>

	);
}
