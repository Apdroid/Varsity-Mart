"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { useProducts } from "@/hooks/use-products";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export function ProductsPageContent() {
	const { data, isLoading, error } = useProducts();
	const products = data?.data || [];

	if (error) {
		return (
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
				<Alert className="mb-6">
					<AlertTriangle className="h-4 w-4" />
					<AlertDescription>
						Unable to load products. Please try again later.
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
			{/* Breadcrumb */}
			<nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
				<Link href="/" className="hover:text-foreground">
					Home
				</Link>
				<ChevronRight className="h-4 w-4" />
				<span className="text-foreground">Products</span>
			</nav>

			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">All Products</h1>
					<p className="text-muted-foreground text-sm">Browse thousands of items from verified sellers</p>
				</div>
				<Link href="/search" className="text-sm text-primary hover:underline hidden md:block">
					Advanced Search
				</Link>
			</div>

			{isLoading ? (
				<div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
					{Array.from({ length: 12 }).map((_, i) => (
						<div key={i} className="space-y-2">
							<Skeleton className="aspect-square rounded-md" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-3/4" />
						</div>
					))}
				</div>
			) : (
				<div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
					{products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			)}
		</div>
	);
}
