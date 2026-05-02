"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { useProducts } from "@/hooks/queries/useProducts";
import { apiProductToModel } from "@/lib/utils/api-product-mapper";
import type { Product } from "@/types/models";

function ProductCardSkeleton() {
	return (
		<div
			className="rounded-[var(--r)] overflow-hidden border"
			style={{ borderColor: "var(--ink-4)" }}
		>
			<div
				className="aspect-square animate-pulse"
				style={{ background: "var(--ink-4)" }}
			/>
			<div className="p-3 space-y-2">
				<div
					className="h-3.5 rounded animate-pulse w-4/5"
					style={{ background: "var(--ink-4)" }}
				/>
				<div
					className="h-3.5 rounded animate-pulse w-3/5"
					style={{ background: "var(--ink-4)" }}
				/>
				<div
					className="h-4 rounded animate-pulse w-2/5"
					style={{ background: "var(--ink-4)" }}
				/>
			</div>
		</div>
	);
}

export function FeaturedProducts() {
	const { data, isLoading } = useProducts({ limit: 12 } as any);

	const products: Product[] = data?.data?.products
		? data.data.products.map(apiProductToModel)
		: [];

	return (
		<section
			className="py-8 md:py-12 px-4 sm:px-6 lg:px-8"
			style={{ background: "var(--surface)" }}
		>
			<div className="mx-auto max-w-360">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<div>
						<span className="vm-section-label mb-1.5 block">Marketplace</span>
						<h2
							className="text-lg md:text-xl font-bold"
							style={{ color: "var(--ink)", fontFamily: "var(--font-heading)" }}
						>
							Featured Products
						</h2>
						<p
							className="text-sm mt-0.5"
							style={{ color: "var(--ink-3)" }}
						>
							Popular items from campus sellers
						</p>
					</div>
					<Link
						href="/products"
						className="hidden sm:inline-flex items-center gap-1 text-sm font-medium transition-colors"
						style={{ color: "var(--orange)" }}
					>
						View all
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>

				{/* Carousel */}
				{isLoading ? (
					<div className="flex gap-3 overflow-hidden">
						{Array.from({ length: 6 }).map((_, i) => (
							<div
								key={i}
								className="shrink-0"
								style={{ width: "clamp(140px, 20%, 180px)" }}
							>
								<ProductCardSkeleton />
							</div>
						))}
					</div>
				) : (
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
				)}

				{/* Mobile link */}
				<div className="mt-4 text-center sm:hidden">
					<Link
						href="/products"
						className="inline-flex items-center gap-1 text-sm font-medium"
						style={{ color: "var(--orange)" }}
					>
						View all products
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>
			</div>
		</section>
	);
}
