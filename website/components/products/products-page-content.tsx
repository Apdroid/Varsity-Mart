"use client";

import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { useProducts } from "@/hooks/queries/useProducts";
import { apiProductToModel } from "@/lib/utils/api-product-mapper";
import type { Product } from "@/types/models";

function ProductSkeleton() {
	return (
		<div className="rounded-[var(--r)] overflow-hidden" style={{ border: "1px solid var(--ink-4)" }}>
			<div className="aspect-square animate-pulse" style={{ background: "var(--ink-4)" }} />
			<div className="p-3 space-y-2">
				<div className="h-3 rounded animate-pulse w-4/5" style={{ background: "var(--ink-4)" }} />
				<div className="h-3 rounded animate-pulse w-3/5" style={{ background: "var(--ink-4)" }} />
				<div className="h-4 rounded animate-pulse w-2/5" style={{ background: "var(--ink-4)" }} />
			</div>
		</div>
	);
}

export function ProductsPageContent() {
	const { data, isLoading, isError } = useProducts();
	const products: Product[] = data?.results ? data.results.map(apiProductToModel) : [];
	const total = data?.count ?? 0;

	return (
		<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
			{/* Breadcrumb */}
			<nav className="flex items-center gap-2 text-sm mb-6" style={{ color: "var(--ink-3)" }}>
				<Link href="/" className="hover:text-foreground transition-colors">Home</Link>
				<ChevronRight className="h-4 w-4" />
				<span style={{ color: "var(--ink)" }}>Products</span>
			</nav>

			<div className="flex items-center justify-between mb-6">
				<div>
					<h1
						className="text-2xl md:text-3xl font-bold mb-1"
						style={{ color: "var(--ink)", fontFamily: "var(--font-heading)" }}
					>
						All Products
					</h1>
					<p className="text-sm" style={{ color: "var(--ink-3)" }}>
						{isLoading
							? "Loading products…"
							: `${total.toLocaleString()} items from verified sellers`}
					</p>
				</div>
				<Link
					href="/search"
					className="text-sm font-medium hidden md:block transition-colors"
					style={{ color: "var(--orange)" }}
				>
					Advanced Search
				</Link>
			</div>

			{isError && (
				<div
					className="rounded-[var(--r)] p-6 text-center mb-6"
					style={{ background: "var(--orange-dim)", border: "1px solid var(--orange-border)" }}
				>
					<Package className="h-8 w-8 mx-auto mb-2" style={{ color: "var(--orange)" }} />
					<p className="text-sm font-medium" style={{ color: "var(--orange-dark)" }}>
						Could not load products. Please try again.
					</p>
				</div>
			)}

			<div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
				{isLoading
					? Array.from({ length: 12 }).map((_, i) => <ProductSkeleton key={i} />)
					: products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
			</div>
		</div>
	);
}
