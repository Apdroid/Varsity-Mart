"use client";

import { ProductsCarousel } from "@/components/home/products-carousel";
import { useProducts } from "@/hooks/queries/useProducts";
import { apiProductToModel } from "@/lib/utils/api-product-mapper";
import type { ProductFilters } from "@/types/api";
import type { Product } from "@/types/models";

interface LiveProductsSectionProps {
	title?: string;
	subtitle?: string;
	badge?: string;
	viewAllLink?: string;
	viewAllText?: string;
	filters?: ProductFilters & { badges?: string; ordering?: string };
}

export function LiveProductsSection({
	title,
	subtitle,
	badge,
	viewAllLink,
	viewAllText,
	filters = {},
}: LiveProductsSectionProps) {
	const { data, isLoading, isError } = useProducts(filters);

	const products: Product[] = data?.results
		? data.results.map(apiProductToModel)
		: [];

	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="h-6 w-32 rounded animate-pulse" style={{ background: "var(--ink-4)" }} />
				<div className="flex gap-3 overflow-hidden">
					{Array.from({ length: 6 }).map((_, i) => (
						<div
							key={i}
							className="shrink-0 w-[160px] h-[220px] rounded-[var(--r)] animate-pulse"
							style={{ background: "var(--ink-4)" }}
						/>
					))}
				</div>
			</div>
		);
	}

	if (isError || products.length === 0) return null;

	return (
		<ProductsCarousel
			products={products}
			title={title}
			subtitle={subtitle}
			badge={badge}
			viewAllLink={viewAllLink}
			viewAllText={viewAllText}
		/>
	);
}
