"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";


export function ProductsPageContent() {
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
				<h1 className="text-2xl font-bold text-foreground">All Products</h1>
				<Link href="/search" className="text-sm text-primary hover:underline">
					Advanced Search
				</Link>
			</div>

			<div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
				{mockProducts.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</div>
	);
}
