import { MainLayout } from "@/components/layout/main-layout";
import { HeroWobble } from "@/components/hero-wobble";
import { GlobeSection } from "@/components/globe-section";
import { TimelineSection } from "@/components/timeline-section";
import { CategoriesCarousel } from "@/components/categories-carousel";
import { FeaturedProducts } from "@/components/home/featured-products";

export default function Home() {
	return (
		<MainLayout>
			<HeroWobble />
			<CategoriesCarousel />
			<GlobeSection />
			<TimelineSection />
			<FeaturedProducts />
		</MainLayout>
	);
}
