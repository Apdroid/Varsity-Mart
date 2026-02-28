"use client";

import { ProductsCarousel } from "@/components/home/products-carousel";
import { mockProducts } from "@/data/products/products";
import type { Product } from "@/types/models";
import { useProducts } from "@/hooks/queries/useProducts";
import { Loader2 } from "lucide-react";

interface RelatedProductsProps {
	currentProduct: Product;
	className?: string;
}

export function RelatedProducts({ currentProduct, className }: RelatedProductsProps) {
	const { data: response, isLoading } = useProducts({ 
		category: currentProduct.category.id,
		limit: 12 
	});

	if (isLoading) {
		return (
			<div className="flex justify-center py-12">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	const relatedProducts = Array.isArray(response?.data)
		? response.data.filter(p => p.id !== currentProduct.id)
		: [];

	if (relatedProducts.length === 0) return null;

	return (
		<div className={className}>
			<ProductsCarousel
				products={relatedProducts}
				title="You Might Also Like"
				subtitle={`More items in ${currentProduct.category.name}`}
				badge="Related"
				viewAllLink={`/products?category=${currentProduct.category.slug}`}
				viewAllText="View More"
			/>
		</div>
	);
}

interface MoreFromSellerProps {
	sellerId: string;
	storeId?: string;
	currentProductId: string;
	storeName?: string;
	className?: string;
}

export function MoreFromSeller({
	sellerId,
	storeId,
	currentProductId,
	storeName,
	className,
}: MoreFromSellerProps) {
	const { data: response, isLoading } = useProducts({ 
		sellerId: sellerId,
		limit: 12 
	});

	if (isLoading) {
		return (
			<div className="flex justify-center py-12">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	const sellerProducts = Array.isArray(response?.data)
		? response.data.filter(p => p.id !== currentProductId)
		: [];

	if (sellerProducts.length === 0) return null;

	return (
		<div className={className}>
			<ProductsCarousel
				products={sellerProducts.slice(0, 12)}
				title={storeName ? `More from ${storeName}` : "More from this Seller"}
				subtitle="Check out other listings from this seller"
				badge="Same Seller"
				viewAllLink={storeId ? `/stores/${storeId}` : `/products?seller=${sellerId}`}
				viewAllText="View Store"
			/>
		</div>
	);
}

interface RecentlyViewedProps {
	excludeProductId?: string;
	className?: string;
}

export function RecentlyViewed({ excludeProductId, className }: RecentlyViewedProps) {
	// In a real app, this would come from localStorage or user session
	const recentProducts = mockProducts
		.filter((p) => p.id !== excludeProductId)
		.slice(0, 8);

	if (recentProducts.length === 0) return null;

	return (
		<div className={className}>
			<ProductsCarousel
				products={recentProducts}
				title="Recently Viewed"
				subtitle="Continue where you left off"
				badge=""
				viewAllLink="/products"
				viewAllText="Browse All"
			/>
		</div>
	);
}
