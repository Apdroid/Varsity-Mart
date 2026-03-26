import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { mockProducts } from "@/data/products/products";

export function FeaturedProducts() {
	const products = mockProducts.slice(0, 12);

	return (
		<section className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-background">
			<div className="mx-auto max-w-360">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<div>
						<h2 className="text-lg md:text-xl font-bold">Featured Products</h2>
						<p className="text-muted-foreground text-sm">Popular items from campus sellers</p>
					</div>
					<Link
						href="/products"
						className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
					>
						View all
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>

				{/* Products */}
				<Carousel
					opts={{ align: "start", loop: false, dragFree: true }}
					className="w-full"
				>
					<CarouselContent className="-ml-3">
						{products.map((product) => (
							<CarouselItem
								key={product.id}
								className="pl-3 basis-[48%] sm:basis-[32%] md:basis-[24%] lg:basis-[20%] xl:basis-[16%]"
							>
								<ProductCard product={product} />
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>

				{/* Mobile link */}
				<div className="mt-4 text-center sm:hidden">
					<Link
						href="/products"
						className="inline-flex items-center gap-1 text-sm font-medium text-primary"
					>
						View all products
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>
			</div>
		</section>
	);
}
