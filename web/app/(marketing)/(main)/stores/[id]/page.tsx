"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
	ArrowLeft,
	Star,
	MapPin,
	Phone,
	Clock,
	ShoppingBag,
	Package,
	TrendingUp,
	CheckCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/main/product-card"
import { cn } from "@/lib/utils"
import { useStore, useStoreProducts } from "@/hooks/queries/use-stores"
import type { StoreDetail, Product as ApiProduct } from "@/lib/api/types"
import { useStoreCategory } from "@/hooks/queries"

function formatGHS(n: string | number) {
	return new Intl.NumberFormat("en-GH", {
		style: "currency",
		currency: "GHS",
		maximumFractionDigits: 0,
	}).format(Number(n))
}

function formatMemberSince(dateStr: string) {
	const date = new Date(dateStr)
	return date.toLocaleDateString("en-GH", { year: "numeric", month: "long" })
}

function formatTime(timeStr?: string) {
	if (!timeStr) return null
	const [h, m] = timeStr.split(":").map(Number)
	const period = h >= 12 ? "PM" : "AM"
	const hour = h % 12 || 12
	return `${hour}:${String(m).padStart(2, "0")} ${period}`
}

function mapApiProductToCard(product: ApiProduct) {
	return {
		id: product.id,
		title: product.title,
		description: product.description,
		price: String(product.price),
		originalPrice: product.originalPrice ? String(product.originalPrice) : undefined,
		images: product.images,
		category: {
			id: product.category.id,
			name: product.category.name,
			icon: product.category.icon,
			count: product.category.count ?? 0,
		},
		condition:
			product.condition === "like_new"
				? "Like New"
				: product.condition === "new"
					? "New"
					: product.condition.charAt(0).toUpperCase() + product.condition.slice(1),
		location: product.location,
		seller: {
			id: product.seller.id,
			name: product.seller.name,
			email: product.seller.email ?? "",
			avatar: product.seller.avatarUrl,
			rating: String(product.seller.rating),
		},
		badges: product.badges,
		status: product.status,
		views: product.views,
		likes: product.likes,
		isNightShop: product.isNightShop,
		createdAt: product.createdAt,
	}
}

/* ─── Skeleton ────────────────────────────────────────────── */

function StorePageSkeleton() {
	return (
		<div className="min-h-svh pb-16">
			<Skeleton className="h-52 w-full md:h-64" />
			<div className="mx-auto max-w-5xl px-4">
				<div className="relative -mt-14 rounded-2xl bg-card px-5 py-5 shadow-md">
					<div className="flex items-start gap-4">
						<Skeleton className="h-20 w-20 shrink-0 rounded-xl" />
						<div className="flex-1 space-y-2 pt-1">
							<Skeleton className="h-6 w-48" />
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-4 w-full" />
						</div>
					</div>
					<div className="mt-4 grid grid-cols-3 gap-3">
						<Skeleton className="h-14 rounded-xl" />
						<Skeleton className="h-14 rounded-xl" />
						<Skeleton className="h-14 rounded-xl" />
					</div>
				</div>
				<div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
					{Array.from({ length: 8 }, (_, i) => (
						<Skeleton key={i} className="aspect-square rounded-lg" />
					))}
				</div>
			</div>
		</div>
	)
}

/* ─── Store header ─────────────────────────────────────────── */

function StoreHeader({ store }: { store: StoreDetail }) {
	const openTime = formatTime(store.openingTime)
	const closeTime = formatTime(store.closingTime)
	const rating = parseFloat(store.rating)
	const { data: category } = useStoreCategory(store.category);

	return (
		<div>
			{/* Banner */}
			<div className="relative h-52 w-full overflow-hidden bg-muted md:h-64">
				{ // store.banner ? (
					<Image
						src={store.banner || "https://placehold.co/800x400?text=VM"}
						alt={store.storeName}
						fill
						className="object-cover"
						priority
					/>
					// ) : (
					// 	<div className="h-full w-full bg-linear-to-br from-vm-tangerine/20 to-muted" />
					//) 
				}
				{/* Back button */}
				<div className="absolute left-4 top-4">
					<Link
						href="/stores"
						className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
					>
						<ArrowLeft className="h-5 w-5" />
					</Link>
				</div>
			</div>

			{/* Info card */}
			<div className="mx-auto max-w-5xl px-4">
				<div className="relative -mt-14 rounded-2xl bg-card px-5 py-5 shadow-md">
					<div className="flex items-start gap-4">
						{/* Logo */}
						<div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-background bg-muted shadow-sm">
							{store.logo ? (
								<Image
									src={store.logo}
									alt={store.storeName}
									fill
									className="object-cover"
								/>
							) : (
								<div className="grid h-full w-full place-items-center bg-vm-tangerine/10">
									<ShoppingBag className="h-8 w-8 text-vm-tangerine" />
								</div>
							)}
						</div>

						{/* Name + meta */}
						<div className="min-w-0 flex-1 pt-1">
							<div className="flex flex-wrap items-center gap-2">
								<h1 className="font-heading text-xl font-bold text-foreground leading-tight">
									{store.storeName}
								</h1>
								<Badge
									className={cn(
										"h-5 rounded-full px-2 text-[10px] font-semibold",
										store.isOpen
											? "bg-emerald-500/15 text-emerald-600"
											: "bg-destructive/15 text-destructive"
									)}
								>
									{store.isOpen ? "Open" : "Closed"}
								</Badge>
							</div>

							<p className="mt-0.5 text-sm text-foreground bg-accent w-20  px-2 rounded-full">{category?.name}</p>

							{store.description && (
								<p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
									{store.description}
								</p>
							)}
						</div>
					</div>

					{/* Stats row */}
					<div className="mt-4 grid grid-cols-3 gap-2">
						<div className="flex flex-col items-center justify-center rounded-xl bg-muted/60 py-3 text-center">
							<div className="flex items-center gap-1">
								<Star className="h-4 w-4 fill-vm-tangerine text-vm-tangerine" />
								<span className="text-base font-bold text-foreground">
									{!Number.isNaN(rating) ? rating.toFixed(1) : "—"}
								</span>
							</div>
							<span className="mt-0.5 text-[10px] text-muted-foreground">
								{store.totalReviews} reviews
							</span>
						</div>
						<div className="flex flex-col items-center justify-center rounded-xl bg-muted/60 py-3 text-center">
							<span className="text-base font-bold text-foreground">{store.totalProducts}</span>
							<span className="mt-0.5 text-[10px] text-muted-foreground">Products</span>
						</div>
						<div className="flex flex-col items-center justify-center rounded-xl bg-muted/60 py-3 text-center">
							<span className="text-base font-bold text-foreground">
								{Number(store.totalSales).toLocaleString()}
							</span>
							<span className="mt-0.5 text-[10px] text-muted-foreground">Sales</span>
						</div>
					</div>

					{/* Detail pills */}
					<div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
						{store.location && (
							<div className="flex items-center gap-1.5">
								<MapPin className="h-3.5 w-3.5 shrink-0 text-vm-tangerine" />
								<span>{store.location}</span>
							</div>
						)}
						{store.phone && (
							<div className="flex items-center gap-1.5">
								<Phone className="h-3.5 w-3.5 shrink-0 text-vm-tangerine" />
								<span>{store.phone}</span>
							</div>
						)}
						{openTime && closeTime && (
							<div className="flex items-center gap-1.5">
								<Clock className="h-3.5 w-3.5 shrink-0 text-vm-tangerine" />
								<span>{openTime} – {closeTime}</span>
							</div>
						)}
					</div>

					{/* Delivery info */}
					<Separator className="my-3" />
					<div className="flex flex-wrap items-center gap-4 text-sm">
						<div className="flex items-center gap-1.5">
							<Package className="h-4 w-4 text-muted-foreground" />
							<span className="text-muted-foreground">Delivery fee:</span>
							<span className="font-semibold text-foreground">
								{Number(store.deliveryFee) === 0 ? "Free" : formatGHS(store.deliveryFee)}
							</span>
						</div>
						{store.minOrder > 0 && (
							<div className="flex items-center gap-1.5">
								<TrendingUp className="h-4 w-4 text-muted-foreground" />
								<span className="text-muted-foreground">Min. order:</span>
								<span className="font-semibold text-foreground">{formatGHS(store.minOrder)}</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

/* ─── Owner card ───────────────────────────────────────────── */

function OwnerCard({ store }: { store: StoreDetail }) {
	return (
		<div className="rounded-xl  bg-card p-4">
			<h2 className="mb-3 text-sm font-semibold text-foreground">Seller</h2>
			<div className="flex items-center gap-3">
				<div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
					{store.owner.avatarUrl ? (
						<Image src={store.owner.avatarUrl} alt={store.owner.name} fill className="object-cover" />
					) : (
						<div className="grid h-full w-full place-items-center bg-vm-tangerine/10 text-xs font-bold text-vm-tangerine">
							{store.owner.name.charAt(0).toUpperCase()}
						</div>
					)}
				</div>
				<div className="min-w-0 flex-1">
					<p className="truncate font-semibold text-foreground">{store.owner.name}</p>
					<p className="text-xs text-muted-foreground">
						Member since {formatMemberSince(store.member_since)}
					</p>
				</div>
				<div className="flex items-center gap-1 text-xs text-emerald-600">
					<CheckCircle className="h-3.5 w-3.5" />
					<span className="font-semibold">Verified</span>
				</div>
			</div>
		</div>
	)
}

/* ─── Products section ─────────────────────────────────────── */

function ProductsSection({ storeId }: { storeId: string }) {
	const [page, setPage] = React.useState(1)
	const { data, isLoading } = useStoreProducts(storeId, page, 20)

	const products: ApiProduct[] = data?.products ?? []
	const pagination = data?.pagination

	if (isLoading) {
		return (
			<div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
				{Array.from({ length: 8 }, (_, i) => (
					<Skeleton key={i} className="aspect-square rounded-lg" />
				))}
			</div>
		)
	}

	if (products.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center gap-3 rounded-xl   py-14 text-center">
				<div className="grid h-14 w-14 place-items-center rounded-full bg-muted">
					<Package className="h-6 w-6 text-muted-foreground" />
				</div>
				<p className="font-semibold text-foreground">No products yet</p>
				<p className="text-sm text-muted-foreground">This store hasn&apos;t listed any products.</p>
			</div>
		)
	}

	return (
		<div className="space-y-5">
			<div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
				{products.map((p) => (
					<ProductCard key={p.id} product={mapApiProductToCard(p)} />
				))}
			</div>

			{/* Pagination */}
			{pagination && pagination.totalPages > 1 && (
				<div className="flex items-center justify-center gap-2 pt-2">
					<Button
						variant="outline"
						size="sm"
						disabled={page <= 1}
						onClick={() => setPage((p) => p - 1)}
					>
						Previous
					</Button>
					<span className="text-sm text-muted-foreground">
						Page {pagination.currentPage} of {pagination.totalPages}
					</span>
					<Button
						variant="outline"
						size="sm"
						disabled={page >= pagination.totalPages}
						onClick={() => setPage((p) => p + 1)}
					>
						Next
					</Button>
				</div>
			)}
		</div>
	)
}

/* ─── Page ─────────────────────────────────────────────────── */

export default function StoreDetailPage() {
	const { id } = useParams<{ id: string }>()
	const { data: store, isLoading, isError } = useStore(id)
	if (isLoading) return <StorePageSkeleton />

	if (isError || !store) {
		return (
			<div className="flex min-h-svh flex-col items-center justify-center gap-4 text-center">
				<div className="grid h-16 w-16 place-items-center rounded-full bg-muted">
					<ShoppingBag className="h-7 w-7 text-muted-foreground" />
				</div>
				<p className="font-semibold text-foreground">Store not found</p>
				<p className="text-sm text-muted-foreground">This store may have been removed or doesn&apos;t exist.</p>
				<Link href="/stores">
					<Button variant="outline">Browse stores</Button>
				</Link>
			</div>
		)
	}

	return (
		<main className="min-h-svh pb-16">
			<StoreHeader store={store} />

			<div className="mx-auto max-w-5xl space-y-5 px-4 pt-5">
				<OwnerCard store={store} />

				<div>
					<h2 className="mb-3 font-heading text-lg font-bold text-foreground">
						Products
						{store.totalProducts > 0 && (
							<span className="ml-1.5 text-base font-normal text-muted-foreground">
								({store.totalProducts})
							</span>
						)}
					</h2>
					<ProductsSection storeId={id} />
				</div>
			</div>
		</main>
	)
}
