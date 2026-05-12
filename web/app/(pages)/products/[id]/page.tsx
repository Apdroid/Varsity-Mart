"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { ProductDetailView } from "@/components/products/product-detail-view"
import { Skeleton } from "@/components/ui/skeleton"
import { useProduct, useProducts, useProductReviews } from "@/hooks/queries/use-products"
import type { Product as ApiProduct, ProductDetail, Review as ApiReview } from "@/lib/api/types"

type Props = {
	params: Promise<{ id: string }>
}

function productCategoryId(product: ApiProduct | ProductDetail): string | undefined {
	const c = product.category
	return typeof c === "object" && c !== null && "id" in c ? c.id : undefined
}

function formatConditionLabel(condition: string) {
	if (condition === "like_new") return "Like New"
	if (condition === "new") return "New"
	return condition.charAt(0).toUpperCase() + condition.slice(1)
}

function mapApiProductToCard(product: ApiProduct | ProductDetail) {
	const category =
		typeof product.category === "string"
			? { id: product.category, name: product.category }
			: {
				id: product.category.id,
				name: product.category.name,
				icon: product.category.icon,
				count: product.category.count ?? 0,
			}

	const badges =
		typeof product.badges === "string"
			? product.badges
			: Array.isArray(product.badges)
				? product.badges.join(" · ")
				: undefined

	return {
		id: product.id,
		title: product.title,
		description: product.description,
		price: String(product.price),
		originalPrice: product.originalPrice ? String(product.originalPrice) : undefined,
		images: product.images,
		category,
		condition: formatConditionLabel(product.condition),
		location: product.location,
		seller: {
			id: product.seller.id,
			name: product.seller.name,
			email: product.seller.email ?? "",
			avatarUrl: product.seller.avatar,
			rating: String(product.seller.rating),
		},
		badges,
		status: product.status,
		stock: "stock" in product ? product.stock : undefined,
		views: product.views,
		likes: product.likes,
		isNightShop: product.isNightShop,
		createdAt: product.createdAt,
	}
}

function mapApiReview(review: ApiReview) {
	return {
		id: review.id,
		productId: "",
		user: {
			id: review.author.id,
			name: `${review.author.firstName} ${review.author.lastName}`,
			avatar: review.author.avatar || "",
		},
		rating: review.rating,
		comment: review.review,
		createdAt: review.createdAt,
		helpful: review.helpfulCount,
		verified: review.author.isVerified,
	}
}

function ProductDetailSkeleton() {
	return (
		<div className="container mx-auto max-w-6xl px-4 py-6">
			<Skeleton className="mb-6 h-6 w-64" />
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
				<div className="lg:col-span-3">
					<Skeleton className="aspect-square w-full rounded-xl" />
					<div className="mt-3 grid grid-cols-5 gap-2 md:grid-cols-8">
						{Array.from({ length: 5 }).map((_, i) => (
							<Skeleton key={i} className="aspect-square w-full rounded-lg" />
						))}
					</div>
				</div>
				<div className="lg:col-span-2 space-y-4">
					<Skeleton className="h-5 w-24 rounded-full" />
					<Skeleton className="h-8 w-full" />
					<Skeleton className="h-4 w-28 rounded-full" />
					<Skeleton className="h-10 w-40" />
					<Skeleton className="h-5 w-32 rounded-full" />
					<Skeleton className="h-20 w-full" />
					<Skeleton className="h-32 w-full rounded-xl" />
				</div>
			</div>
		</div>
	)
}

function ProductDetailContent({ id }: { id: string }) {
	const { data: product, isLoading, error } = useProduct(id)

	const categoryId = product ? productCategoryId(product) : undefined
	const sellerId = product?.seller?.id

	const { data: relatedData } = useProducts({
		category: categoryId,
		limit: 8,
	})

	const { data: sellerProductsData } = useProducts({
		sellerId,
		limit: 5,
	})

	const { data: reviewsData } = useProductReviews(id)

	if (isLoading) {
		return <ProductDetailSkeleton />
	}

	if (error || !product) {
		notFound()
	}

	const related = (relatedData?.products || [])
		.filter((p) => p.id !== product.id)
		.slice(0, 8)
		.map(mapApiProductToCard)

	const sellerProducts = (sellerProductsData?.products || [])
		.map(mapApiProductToCard)

	const reviews = (reviewsData?.reviews || []).map(mapApiReview)

	return (
		<ProductDetailView
			product={mapApiProductToCard(product)}
			related={related}
			sellerProducts={sellerProducts}
			reviews={reviews}
		/>
	)
}

export default function Page({ params }: Props) {
	const { id } = use(params)
	return <ProductDetailContent id={id} />
}
