import Image from "next/image"
import Link from "next/link"
import { Star, Package, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProductCard, type Product } from "@/components/main/product-card"
import type { Store } from "@/components/main/stores-card"

function compactNumber(n: number) {
	if (n < 1000) return n.toString()
	return new Intl.NumberFormat("en-US", {
		notation: "compact",
		maximumFractionDigits: 1,
	}).format(n)
}

type ShopByStoreSectionProps = {
	store: Store
	products: Product[]
	className?: string
}

export function ShopByStoreSection({
	store,
	products,
	className,
}: ShopByStoreSectionProps) {
	const rating = parseFloat(store.rating)
	const ratingDisplay = !Number.isNaN(rating) ? rating.toFixed(1) : "—"

	return (
		<div className={cn("py-8 first:pt-0 last:pb-0", className)}>
			<div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">

				{/* ── Mobile: compact horizontal header ───────────── */}
				<div className="flex items-center gap-3 lg:hidden">
					<div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg  bg-muted">
						<Image
							src={store.logo}
							alt={store.name}
							width={48}
							height={48}
							className="h-full w-full object-cover"
							loading="lazy"
						/>
						<span
							className={cn(
								"absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background",
								store.isOpen ? "bg-emerald-500" : "bg-muted-foreground"
							)}
						/>
					</div>
					<div className="min-w-0 flex-1">
						<div className="flex items-start justify-between gap-2">
							<div className="min-w-0">
								<p className="truncate text-sm font-bold text-foreground">
									{store.name}
								</p>
								<p className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">
									{store.category}
								</p>
							</div>
							<Link
								href={`/stores/${store.id}`}
								className="shrink-0 text-xs font-semibold text-vm-tangerine"
							>
								Visit store →
							</Link>
						</div>
						<div className="mt-1 flex items-center gap-1">
							<Star className="h-3 w-3 fill-vm-tangerine text-vm-tangerine" />
							<span className="text-xs font-bold text-foreground">
								{ratingDisplay}
							</span>
							<span className="text-[10px] text-muted-foreground">
								({compactNumber(store.totalReviews)})
							</span>
						</div>
					</div>
				</div>

				{/* ── Desktop: vertical store card ─────────────────── */}
				<div className="hidden w-52 shrink-0 lg:block">
					<div className="rounded-lg  bg-card p-5">
						<div className="relative mb-4 h-16 w-16 overflow-hidden rounded-lg border border-border bg-muted">
							<Image
								src={store.logo}
								alt={store.name}
								width={64}
								height={64}
								className="h-full w-full object-cover"
								loading="lazy"
							/>
							<span
								className={cn(
									"absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card",
									store.isOpen ? "bg-emerald-500" : "bg-muted-foreground"
								)}
							/>
						</div>

						<p className="text-[15px] font-bold leading-snug text-foreground">
							{store.name}
						</p>
						<p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
							{store.category}
						</p>

						<div className="mt-3 flex items-center gap-1">
							<Star className="h-3.5 w-3.5 fill-vm-tangerine text-vm-tangerine" />
							<span className="text-sm font-bold text-foreground">
								{ratingDisplay}
							</span>
							<span className="text-xs text-muted-foreground">
								({compactNumber(store.totalReviews)})
							</span>
						</div>

						<div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
							<Package className="h-3 w-3" />
							<span>
								<span className="font-semibold text-foreground">
									{compactNumber(store.totalProducts)}
								</span>{" "}
								products
							</span>
						</div>

						<div className="mt-4 border-t border-border pt-4">
							<Link
								href={`/stores/${store.id}`}
								className="flex items-center gap-1.5 text-sm font-semibold text-vm-tangerine transition-opacity hover:opacity-75"
							>
								Visit store <ArrowRight className="h-3.5 w-3.5" />
							</Link>
						</div>
					</div>
				</div>

				{/* ── Product carousel ─────────────────────────────── */}
				<div className="min-w-0 flex-1">
					<div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
						{products.map((product) => (
							<ProductCard
								key={product.id}
								product={product}
								className="w-[155px] shrink-0 sm:w-[170px]"
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
