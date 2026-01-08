import { mockProducts } from "@/data/products/products";
import ProductCard from "../main/product-card";

export default function Newproducts() {
	return (
		<div className="my-10 max-w-460 mx-auto">
			<h1 className="text-2xl font-bold my-6">
				Featured Products <hr className="mt-2 w-20 border-primary" />
			</h1>
			<p className="text-sm text-foreground/80 mb-6">
				Bringing together products from your peers and also from the famous
				stores around you for easy access
			</p>
			<div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-6">
				{mockProducts.slice(0, 14).map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</div>
	);
}
