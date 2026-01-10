import { CategoryGrid } from "@/components/home/category-grid";
import EstablishmentCardSideOverlay from "@/components/home/overlay-card";
import PreviewSection from "@/components/home/preview-section";
import ProductCard from "@/components/main/product-card";
import { establishments } from "@/data/food/establishment-data";
import { mockProducts } from "@/data/products/products";

export default function Page() {
	return (
		<div className="max-w-460">
			<section className="category-grid my-10 mx-auto">
				<CategoryGrid />
			</section>
			<section className="my-20 mx-auto">
				<PreviewSection
					title="Featured Products"
					description="Bringing together products from your peers and also from the famous stores around you for easy access"
				>
					{mockProducts.slice(0, 14).map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</PreviewSection>
			</section>
			<section className="my-20 mx-auto">
				<PreviewSection
					title="Featured Restaurants and Fast Food Joints"
					description="
					Bringing together restaurants from your surroundings and also from the
					famous stores around you for easy access"
				>
					{establishments.map((item) => (
						<div key={item.name}>
							<EstablishmentCardSideOverlay product={item} />
						</div>
					))}
				</PreviewSection>
			</section>
		</div>
	);
}
