import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { mockProducts } from "@/data/products/products";

export function FeaturedProducts() {
	return (
		<section className="py-12 px-4 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-360">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl font-bold text-foreground">Featured Products</h2>
					<Link
						href="/products"
						className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/20 transition-colors"
					>
						View All
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>

				<div className=" auto-grid gap-4">
					{mockProducts.slice(0,16).map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</div>
		</section>
	);
}
