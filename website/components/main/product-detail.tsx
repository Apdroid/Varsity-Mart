"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
	ArrowLeft,
	Heart,
	Star,
	MapPin,
	Moon,
	Eye,
	Share2,
	ShoppingCart,
	ChevronLeft,
	ChevronRight,
	MessageCircle,
	Shield,
	Truck,
	RotateCcw,
	Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
	ProductCard,
	type Product,
	type ProductImage,
} from "@/components/main/product-card"

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function compactNumber(n: number) {
	if (n < 1000) return n.toString()
	return new Intl.NumberFormat("en-US", {
		notation: "compact",
		maximumFractionDigits: 1,
	}).format(n)
}

function timeAgo(iso: string) {
	const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
	if (days === 0) return "Today"
	if (days === 1) return "Yesterday"
	if (days < 7) return `${days}d ago`
	if (days < 30) return `${Math.floor(days / 7)}w ago`
	return `${Math.floor(days / 30)}mo ago`
}

const conditionStyle: Record<string, string> = {
	New: "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400",
	"Like New": "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
	Good: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
	Used: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
}

// ─── Image Gallery ────────────────────────────────────────────────────────────

function ImageGallery({
	images,
	isSoldOut,
}: {
	images: ProductImage[]
	isSoldOut: boolean
}) {
	const [selected, setSelected] = React.useState(0)
	const multi = images.length > 1

	const prev = () => setSelected((i) => (i - 1 + images.length) % images.length)
	const next = () => setSelected((i) => (i + 1) % images.length)

	return (
		<div className="space-y-3">
			{/* Main image */}
			<div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
				{images[selected] && (
					<Image
						src={images[selected].optimized_url || images[selected].url}
						alt=""
						fill
						priority
						sizes="(max-width: 1024px) 100vw, 50vw"
						className={cn(
							"object-cover transition-opacity duration-300",
							isSoldOut && "grayscale opacity-60"
						)}
					/>
				)}

				{isSoldOut && (
					<div className="absolute inset-0 grid place-items-center bg-foreground/30 backdrop-blur-[2px]">
						<span className="rounded-lg bg-card/95 px-5 py-2 text-sm font-bold uppercase tracking-[0.18em] text-foreground shadow-lg">
							Sold Out
						</span>
					</div>
				)}

				{multi && (
					<>
						<button
							type="button"
							onClick={prev}
							className="absolute left-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-card/90 text-foreground shadow-md backdrop-blur-sm transition hover:bg-card"
						>
							<ChevronLeft className="h-4 w-4" />
						</button>
						<button
							type="button"
							onClick={next}
							className="absolute right-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-card/90 text-foreground shadow-md backdrop-blur-sm transition hover:bg-card"
						>
							<ChevronRight className="h-4 w-4" />
						</button>
						<div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
							{images.map((_, i) => (
								<button
									key={i}
									type="button"
									onClick={() => setSelected(i)}
									className={cn(
										"h-1.5 rounded-full transition-all duration-300",
										i === selected ? "w-5 bg-white" : "w-1.5 bg-white/50"
									)}
								/>
							))}
						</div>
					</>
				)}
			</div>

			{/* Thumbnails */}
			{multi && (
				<div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
					{images.map((img, i) => (
						<button
							key={img.id}
							type="button"
							onClick={() => setSelected(i)}
							className={cn(
								"relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
								i === selected
									? "border-vm-tangerine"
									: "border-transparent opacity-55 hover:opacity-100"
							)}
						>
							<Image
								src={img.thumbnail_url || img.url}
								alt=""
								fill
								className="object-cover"
							/>
						</button>
					))}
				</div>
			)}
		</div>
	)
}

// ─── Seller Card ──────────────────────────────────────────────────────────────

function SellerCard({ seller }: { seller: Product["seller"] }) {
	console.log(seller)
	const rating = parseFloat(seller.rating)
	const initials = seller.name
		.split(" ")
		.map((w) => w[0])
		.join("")
		.toUpperCase()
		.slice(0, 2)

	return (
		<div className="rounded-xl border border-border bg-card p-4">
			<p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
				Seller
			</p>
			<div className="flex items-center gap-3">
				<Avatar className="h-12 w-12">
					<AvatarImage src={seller.avatarUrl} alt={seller.name} />
					<AvatarFallback className="text-sm font-bold">{initials}</AvatarFallback>
				</Avatar>
				<div className="min-w-0 flex-1">
					<p className="font-semibold leading-snug text-foreground">{seller.name}</p>
					<div className="mt-0.5 flex items-center gap-1 text-xs">
						<Star className="h-3 w-3 fill-vm-tangerine text-vm-tangerine" />
						<span className="font-semibold text-foreground">
							{!Number.isNaN(rating) ? rating.toFixed(1) : "—"}
						</span>
						<span className="text-muted-foreground">seller rating</span>
					</div>
					<p className="mt-0.5 truncate text-xs text-muted-foreground">{seller.email}</p>
				</div>
				<Button size="sm" variant="outline" className="shrink-0 gap-1.5">
					<MessageCircle className="h-3.5 w-3.5" />
					Chat
				</Button>
			</div>
		</div>
	)
}

// ─── Trust Strip ──────────────────────────────────────────────────────────────

function TrustStrip() {
	const items = [
		{ icon: Truck, label: "Campus Delivery", sub: "via Keber" },
		{ icon: RotateCcw, label: "7-day Returns", sub: "most items" },
		{ icon: Shield, label: "Verified Sellers", sub: "KNUST-checked" },
	]
	return (
		<div className="grid grid-cols-3 gap-2 text-center">
			{items.map(({ icon: Icon, label, sub }) => (
				<div key={label} className="rounded-xl border border-border bg-muted/30 p-3">
					<Icon className="mx-auto mb-1.5 h-4 w-4 text-vm-tangerine" />
					<p className="text-[11px] font-semibold text-foreground">{label}</p>
					<p className="text-[10px] text-muted-foreground">{sub}</p>
				</div>
			))}
		</div>
	)
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Props = {
	product: Product
	related: Product[]
}

export default function ProductDetailPage({ product, related }: Props) {
	const [liked, setLiked] = React.useState(false)
	const isSoldOut = product.status.toLowerCase() === "sold"
	const discount = discountPct(product.price, product.originalPrice)
	const rating = parseFloat(product.seller.rating)
	const condCls =
		conditionStyle[product.condition] ?? "bg-muted text-muted-foreground"

	return (
		<div className="min-h-screen bg-background">

			{/* ── Back / breadcrumb bar ── */}
			<div className="border-b border-border/50 bg-card">
				<div className="container mx-auto flex h-11 items-center justify-between px-4">
					<Link
						href="/"
						className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
					>
						<ArrowLeft className="h-4 w-4" />
						Back
					</Link>

					{/* Breadcrumb — desktop */}
					<nav className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
						<Link href="/" className="hover:text-foreground">Home</Link>
						<span>/</span>
						<Link href="/search" className="hover:text-foreground">
							{product.category.name}
						</Link>
						<span>/</span>
						<span className="max-w-[220px] truncate text-foreground">
							{product.title}
						</span>
					</nav>

					{/* Top actions */}
					<div className="flex items-center">
						<Button variant="ghost" size="icon" className="h-9 w-9">
							<Share2 className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className={cn("h-9 w-9", liked && "text-vm-tangerine")}
							onClick={() => setLiked((v) => !v)}
							aria-label="Save to wishlist"
						>
							<Heart className={cn("h-4 w-4", liked && "fill-vm-tangerine")} />
						</Button>
					</div>
				</div>
			</div>

			{/* ── Page body ── */}
			<div className="container mx-auto px-4 py-6">
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14">

					{/* Left — image gallery (sticky on desktop) */}
					<div className="lg:sticky lg:top-6 lg:self-start">
						<ImageGallery images={product.images} isSoldOut={isSoldOut} />
					</div>

					{/* Right — product info */}
					<div className="space-y-5 pb-28 lg:pb-0">

						{/* Category + chips */}
						<div className="flex flex-wrap items-center gap-2">
							<span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
								{product.category.name}
							</span>
							<span className="text-muted-foreground/30">·</span>
							<span
								className={cn(
									"rounded-full px-2.5 py-0.5 text-xs font-semibold",
									condCls
								)}
							>
								{product.condition}
							</span>
							{product.badges && (
								<span className="rounded-full bg-vm-tangerine px-2.5 py-0.5 text-xs font-bold text-vm-tangerine-foreground">
									{product.badges}
								</span>
							)}
							{product.isNightShop && (
								<span className="flex items-center gap-1 rounded-full bg-foreground/10 px-2.5 py-0.5 text-xs font-semibold text-foreground">
									<Moon className="h-3 w-3" />
									Night Shop
								</span>
							)}
						</div>

						{/* Title */}
						<h1 className="text-2xl font-black leading-tight tracking-tight text-foreground sm:text-3xl">
							{product.title}
						</h1>

						{/* Social proof row */}
						<div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
							<div className="flex items-center gap-1">
								<Star className="h-3.5 w-3.5 fill-vm-tangerine text-vm-tangerine" />
								<span className="font-semibold text-foreground">
									{!Number.isNaN(rating) ? rating.toFixed(1) : "—"}
								</span>
								<span>seller rating</span>
							</div>
							<span className="text-muted-foreground/30">·</span>
							<div className="flex items-center gap-1">
								<Eye className="h-3.5 w-3.5" />
								<span>{compactNumber(product.views)} views</span>
							</div>
							<span className="text-muted-foreground/30">·</span>
							<span>{product.likes} sold</span>
							<span className="text-muted-foreground/30">·</span>
							<div className="flex items-center gap-1">
								<Clock className="h-3 w-3" />
								<span>{timeAgo(product.createdAt)}</span>
							</div>
						</div>

						<Separator />

						{/* Price */}
						<div className="space-y-1">
							<div className="flex items-baseline gap-3">
								<span className="text-3xl font-black text-vm-tangerine">
									{formatGHS(product.price)}
								</span>
								{discount && product.originalPrice && (
									<>
										<span className="text-base text-muted-foreground line-through">
											{formatGHS(product.originalPrice)}
										</span>
										<span className="rounded-sm bg-vm-tangerine px-1.5 py-0.5 text-xs font-bold text-vm-tangerine-foreground">
											-{discount}%
										</span>
									</>
								)}
							</div>
							{discount && product.originalPrice && (
								<p className="text-sm text-muted-foreground">
									You save{" "}
									{formatGHS(
										parseFloat(product.originalPrice) - parseFloat(product.price)
									)}
								</p>
							)}
						</div>

						{/* Location */}
						<div className="flex items-center gap-1.5 text-sm text-muted-foreground">
							<MapPin className="h-4 w-4 shrink-0 text-vm-tangerine" />
							<span>{product.location}</span>
						</div>

						{/* Desktop CTAs */}
						<div className="hidden space-y-3 lg:block">
							{isSoldOut ? (
								<Button disabled className="w-full" size="lg">
									Sold Out
								</Button>
							) : (
								<Button
									size="lg"
									className="w-full bg-vm-tangerine text-vm-tangerine-foreground hover:bg-vm-tangerine/90"
								>
									<ShoppingCart className="mr-2 h-5 w-5" />
									Add to Cart
								</Button>
							)}
							<Button
								variant="outline"
								size="lg"
								className={cn(
									"w-full gap-2",
									liked && "border-vm-tangerine text-vm-tangerine"
								)}
								onClick={() => setLiked((v) => !v)}
							>
								<Heart className={cn("h-4 w-4", liked && "fill-vm-tangerine")} />
								{liked ? "Saved" : "Save to Wishlist"}
							</Button>
						</div>

						<Separator />

						{/* Description */}
						<div>
							<h2 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
								About this item
							</h2>
							<p className="text-sm leading-relaxed text-foreground">
								{product.description}
							</p>
						</div>

						<Separator />

						{/* Trust strip */}
						<TrustStrip />

						<Separator />

						{/* Seller */}
						<SellerCard seller={product.seller} />
					</div>
				</div>

				{/* ── Related products ── */}
				{related.length > 0 && (
					<section className="mt-14">
						<h2 className="mb-4 text-lg font-bold text-foreground">
							More in {product.category.name}
						</h2>
						<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
							{related.map((p) => (
								<ProductCard key={p.id} product={p} />
							))}
						</div>
					</section>
				)}
			</div>

			{/* ── Mobile sticky CTA bar ── */}
			<div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-4 py-3 backdrop-blur-sm lg:hidden">
				<div className="flex items-center gap-3">
					<div className="flex-1 min-w-0">
						<span className="text-xl font-black text-vm-tangerine">
							{formatGHS(product.price)}
						</span>
						{discount && product.originalPrice && (
							<span className="ml-2 text-xs text-muted-foreground line-through">
								{formatGHS(product.originalPrice)}
							</span>
						)}
					</div>
					<Button
						variant="outline"
						size="icon"
						className={cn(
							"h-11 w-11 shrink-0",
							liked && "border-vm-tangerine text-vm-tangerine"
						)}
						onClick={() => setLiked((v) => !v)}
						aria-label="Save to wishlist"
					>
						<Heart className={cn("h-5 w-5", liked && "fill-vm-tangerine")} />
					</Button>
					{isSoldOut ? (
						<Button disabled className="h-11 flex-1">
							Sold Out
						</Button>
					) : (
						<Button className="h-11 flex-1 bg-vm-tangerine text-vm-tangerine-foreground hover:bg-vm-tangerine/90">
							<ShoppingCart className="mr-2 h-4 w-4" />
							Add to Cart
						</Button>
					)}
				</div>
			</div>
		</div>
	)
}
