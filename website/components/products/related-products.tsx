"use client";

import { ProductsCarousel } from "@/components/home/products-carousel";
import { mockProducts } from "@/data/products/products";
import type { Product } from "@/types/models";

interface RelatedProductsProps {
	currentProduct: Product;
	className?: string;
}

export function RelatedProducts({ currentProduct, className }: RelatedProductsProps) {
	// Get related products from the same category, excluding current product
	const relatedByCategory = mockProducts.filter(
		(p) => p.category.id === currentProduct.category.id && p.id !== currentProduct.id
	);

	// Get products from the same seller/store
	const relatedBySeller = mockProducts.filter(
		(p) =>
			(p.storeId === currentProduct.storeId || p.sellerId === currentProduct.sellerId) &&
			p.id !== currentProduct.id
	);

	// Combine and deduplicate
	const relatedProducts = [
		...relatedByCategory.slice(0, 8),
		...relatedBySeller.filter((p) => !relatedByCategory.find((r) => r.id === p.id)).slice(0, 4),
	].slice(0, 12);

	// If not enough related products, add random products
	if (relatedProducts.length < 6) {
		const additionalProducts = mockProducts
			.filter((p) => p.id !== currentProduct.id && !relatedProducts.find((r) => r.id === p.id))
			.slice(0, 6 - relatedProducts.length);
		relatedProducts.push(...additionalProducts);
	}

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
	const sellerProducts = mockProducts.filter(
		(p) =>
			(p.storeId === storeId || p.sellerId === sellerId) && p.id !== currentProductId
	);

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
