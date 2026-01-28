"use client";

import { ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { mockProducts } from "@/data/products/products";

export function FeaturedProducts() {
	return (
		<section className="py-10 md:py-16 px-4 sm:px-6 lg:px-8 bg-background">
			<div className="mx-auto max-w-360">
				{/* Section Header */}
				<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
					<div>
						<div className="flex items-center gap-2 mb-2">
							<span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
								<TrendingUp className="h-3 w-3" />
								Trending Now
							</span>
						</div>
						<h2 className="text-xl md:text-2xl font-bold text-foreground">Featured Products</h2>
						<p className="text-muted-foreground mt-1 text-sm">
							Discover popular items from verified campus sellers
						</p>
					</div>
					<Link
						href="/products"
						className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors group"
					>
						View All Products
						<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
					</Link>
				</div>

				{/* Products Carousel - Mobile friendly with swipe */}
				<Carousel
					opts={{
						align: "start",
						loop: false,
						dragFree: true,
					}}
					className="w-full"
				>
					<CarouselContent className="-ml-3 md:-ml-4">
						{mockProducts.slice(0, 12).map((product) => (
							<CarouselItem
								key={product.id}
								className="pl-3 md:pl-4 basis-[45%] sm:basis-[30%] md:basis-[22%] lg:basis-[18%] xl:basis-[14%]"
							>
								<ProductCard product={product} />
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>

				{/* Mobile View All Button */}
				<div className="mt-6 text-center sm:hidden">
					<Link
						href="/products"
						className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
					>
						View All Products
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>
			</div>
		</section>
	);
}
