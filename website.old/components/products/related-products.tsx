"use client";

import { useEffect, useState } from "react";
import { ProductsCarousel } from "@/components/home/products-carousel";
import type { Product } from "@/types/models";
import { useProducts } from "@/hooks/queries/useProducts";
import { apiProductToModel } from "@/lib/utils/api-product-mapper";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Recently Viewed Tracking ───────────────────────────────────────────────
const RECENTLY_VIEWED_KEY = "varsitymart-recently-viewed"
const MAX_RECENTLY_VIEWED = 12

function getRecentlyViewedIds(): string[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY)
    return stored ? JSON.parse(stored) : []
  } catch { return [] }
}

export function trackProductView(productId: string) {
  if (typeof window === "undefined") return
  try {
    const ids = getRecentlyViewedIds().filter(id => id !== productId)
    ids.unshift(productId)
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(ids.slice(0, MAX_RECENTLY_VIEWED)))
  } catch { /* non-critical */ }
}

// ─── Related Products (by category) ─────────────────────────────────────────
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
			<div className={className}>
				<div className="space-y-4">
					<Skeleton className="h-8 w-48" />
					<div className="flex gap-4 overflow-hidden">
						{Array.from({ length: 5 }).map((_, i) => (
							<div key={i} className="space-y-3 shrink-0 w-[180px]">
								<Skeleton className="aspect-square rounded-lg" />
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-4 w-1/2" />
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	const relatedProducts = (response?.data?.products ?? [])
		.filter(p => p.id !== currentProduct.id)
		.map(apiProductToModel);

	if (relatedProducts.length === 0) return null;

	return (
		<div className={className}>
			<ProductsCarousel
				products={relatedProducts}
				title="Others Like This"
				subtitle={`More items in ${currentProduct.category.name}`}
				badge="Related"
				viewAllLink={`/products?category=${currentProduct.category.slug}`}
				viewAllText="View More"
			/>
		</div>
	);
}

// ─── More From Seller ───────────────────────────────────────────────────────
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
			<div className={className}>
				<div className="space-y-4">
					<Skeleton className="h-8 w-56" />
					<div className="flex gap-4 overflow-hidden">
						{Array.from({ length: 5 }).map((_, i) => (
							<div key={i} className="space-y-3 shrink-0 w-[180px]">
								<Skeleton className="aspect-square rounded-lg" />
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-4 w-1/2" />
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	const sellerProducts = (response?.data?.products ?? [])
		.filter(p => p.id !== currentProductId)
		.map(apiProductToModel);

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

// ─── Recently Viewed ────────────────────────────────────────────────────────
interface RecentlyViewedProps {
	excludeProductId?: string;
	className?: string;
}

export function RecentlyViewed({ excludeProductId, className }: RecentlyViewedProps) {
	const [viewedIds, setViewedIds] = useState<string[]>([])

	useEffect(() => {
		setViewedIds(getRecentlyViewedIds().filter(id => id !== excludeProductId))
	}, [excludeProductId])

	// Fetch actual product data for the recently viewed IDs
	const { data: response, isLoading } = useProducts({
		ids: viewedIds.length > 0 ? viewedIds : undefined,
		limit: 8,
	})

	if (viewedIds.length === 0) return null

	if (isLoading) {
		return (
			<div className={className}>
				<div className="space-y-4">
					<Skeleton className="h-8 w-40" />
					<div className="flex gap-4 overflow-hidden">
						{Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className="space-y-3 shrink-0 w-[180px]">
								<Skeleton className="aspect-square rounded-lg" />
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-4 w-1/2" />
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	const recentProducts = (response?.data?.products ?? []).map(apiProductToModel)

	if (recentProducts.length === 0) return null

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
