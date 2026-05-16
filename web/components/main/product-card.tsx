"use client";
import * as React from "react"
import Link from "next/link"
import { Heart, Star, MapPin, Moon } from "lucide-react"
import Image from "next/image"

import { cn } from "@/lib/utils"

/* -----------------------------------------------------------
	 Types — mirrors the API schema
----------------------------------------------------------- */
export type ProductImage = {
	id: string
	product: string
	url: string
	thumbnail_url: string
	optimized_url: string
	width: number
	height: number
	format: string
	display_order: number
	created_at: string
}

export type ProductCategory = {
	id: string
	name: string
	icon?: string
	count?: number
}

export type ProductSeller = {
	id: string
	name: string
	email?: string
	avatarUrl?: string
	rating: string
}

export type Product = {
	id: string
	title: string
	description: string
	price: string
	originalPrice?: string
	images: ProductImage[]
	category: ProductCategory
	condition: string
	location: string
	seller: ProductSeller
	store?: { id: string; name: string }
	badges?: string
	status: string
	stock?: number
	views: number
	likes: number
	isNightShop: boolean
	createdAt: string
}

/* -----------------------------------------------------------
	 Helpers
----------------------------------------------------------- */
function formatGHS(value: string | number) {
	const n = typeof value === "string" ? parseFloat(value) : value
	if (Number.isNaN(n)) return "—"
	return new Intl.NumberFormat("en-GH", {
		style: "currency",
		currency: "GHS",
		maximumFractionDigits: 0,
	}).format(n)
}

function discountPct(price: string, original?: string) {
	if (!original) return null
	const p = parseFloat(price)
	const o = parseFloat(original)
	if (!o || o <= p) return null
	return Math.round(((o - p) / o) * 100)
}

/* -----------------------------------------------------------
	 Product card — e-commerce style
----------------------------------------------------------- */
type ProductCardProps = {
	product: Product
	onLike?: (id: string) => void
	onAddToCart?: (id: string) => void
	className?: string
}

export function ProductCard({
	product,
	onLike,
	onAddToCart,
	className,
}: ProductCardProps) {
	const [liked, setLiked] = React.useState(false)
	const primary = product.images[0]
	const discount = discountPct(product.price, product.originalPrice)
	const isSoldOut = product.status?.toLowerCase() === "sold"
	const rating = parseFloat(product.seller.rating)

	const handleLike = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setLiked((v) => !v)
		onLike?.(product.id)
	}

	const handleAddToCart = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		onAddToCart?.(product.id)
	}

	return (
		<Link
			href={`/products/${product.id}`}
			className={cn(
				"group rounded-md hover:bg-card p-2 relative flex flex-col bg-background transition-colors",
				isSoldOut && "opacity-70",
				className
			)}
		>
			{/* ─── Image ──────────────────────────────────────── */}
			<div className="relative aspect-square rounded-md overflow-hidden bg-muted">
				{primary && (
					<Image
						width={1200}
						height={1200}
						src={primary.url || primary.optimized_url || "https://placehold.net/800x600.png/"}
						alt={product.title}
						className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
						loading="lazy"
					/>
				)}

				{/* Discount tag — sharp corner, hard color */}
				{discount && (
					<div className="absolute left-0 top-3 bg-vm-tangerine px-2 py-1 text-[11px] font-bold text-vm-tangerine-foreground">
						-{discount}%
					</div>
				)}

				{/* Stacked top-right pills (badge / night) */}
				<div className="absolute right-2 top-2 flex flex-col items-end gap-1">
					{product.badges && (
						<span className="bg-foreground/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-background backdrop-blur-sm">
							{product.badges}
						</span>
					)}
					{product.isNightShop && (
						<span className="flex items-center gap-1 bg-foreground/85 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-background backdrop-blur-sm">
							<Moon className="h-2.5 w-2.5" />
							Night
						</span>
					)}
				</div>

				{/* Wishlist — subtle, bottom-right of image */}
				<button
					type="button"
					onClick={handleLike}
					aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
					aria-pressed={liked}
					className={cn(
						"absolute bottom-2 right-2 grid h-8 w-8 place-items-center rounded-full bg-card/95 text-foreground opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100",
						liked && "opacity-100 text-vm-tangerine"
					)}
				>
					<Heart
						className={cn("h-4 w-4", liked && "fill-vm-tangerine")}
					/>
				</button>

				{/* Sold out overlay */}
				{isSoldOut && (
					<div className="absolute inset-0 grid place-items-center bg-foreground/50 backdrop-blur-[1px]">
						<span className="bg-card px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-foreground">
							Sold Out
						</span>
					</div>
				)}
			</div>

			{/* ─── Content ────────────────────────────────────── */}
			<div className="flex flex-1 flex-col px-1 pt-2.5">
				{/* Title — 2 lines max */}
				<h3 className="line-clamp-2  text-[13px] font-bold leading-tight text-foreground">
					{product.title}
				</h3>

				{/* Rating + likes count — small and gray */}
				<div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
					<div className="flex items-center gap-0.5">
						<Star className="h-3 w-3 fill-vm-tangerine text-vm-tangerine" />
						<span className="font-semibold text-foreground">
							{!Number.isNaN(rating) ? rating.toFixed(1) : "—"}
						</span>
					</div>
					<span className="text-muted-foreground/50">|</span>
					<span>{product.likes} sold</span>
				</div>

				{/* Price row — the hero */}
				<div className="mt-1.5 flex items-baseline gap-1.5">
					<span className="text-base font-bold text-vm-tangerine">
						{formatGHS(product.price)}
					</span>
					{discount && product.originalPrice && (
						<span className="text-[11px] text-muted-foreground line-through">
							{formatGHS(product.originalPrice)}
						</span>
					)}
				</div>

				{/* Location + condition — single line, tiny */}
				<div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
					<div className="flex min-w-0 items-center gap-0.5">
						<MapPin className="h-2.5 w-2.5 shrink-0" />
						<span className="truncate">{product.location}</span>
					</div>
					<span className="shrink-0 font-medium uppercase tracking-wide text-foreground/70">
						{product.condition}
					</span>
				</div>
			</div>
		</Link>
	)
}
