import Image from "next/image"
import Link from "next/link"
import { Star, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { MenuItemCard } from "@/components/restaurants/menu-item-card"
import type { MenuItem, RestaurantWithMenu } from "@/lib/api/types"

function compactNumber(n: number) {
	if (n < 1000) return n.toString()
	return new Intl.NumberFormat("en-US", {
		notation: "compact",
		maximumFractionDigits: 1,
	}).format(n)
}

type RestaurantSummary = {
	id: string
	name: string
	logo: string
	category: string
	rating: number | string
	totalReviews: number
	isOpen: boolean
}

type RestaurantMenuSectionProps = {
	restaurant: RestaurantSummary
	items: MenuItem[]
	className?: string
}

export function RestaurantMenuSection({
	restaurant,
	items,
	className,
}: RestaurantMenuSectionProps) {
	const rating = parseFloat(String(restaurant.rating))
	const ratingDisplay = !Number.isNaN(rating) ? rating.toFixed(1) : "—"

	// MenuItemCard only reads id, name and isOpen off the restaurant.
	const restaurantForCard: RestaurantWithMenu = {
		id: restaurant.id,
		name: restaurant.name,
		logo: restaurant.logo,
		isOpen: restaurant.isOpen,
		menu: { categories: [] },
	}

	return (
		<div className={cn("py-8 first:pt-0 last:pb-0", className)}>
			<div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">

				{/* ── Mobile: compact horizontal header ───────────── */}
				<div className="flex items-center gap-3 lg:hidden">
					<div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
						<Image
							src={restaurant.logo || "https://placehold.co/200x200?text=VM"}
							alt={restaurant.name}
							width={48}
							height={48}
							className="h-full w-full object-cover"
							loading="lazy"
						/>
						<span
							className={cn(
								"absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background",
								restaurant.isOpen ? "bg-emerald-500" : "bg-muted-foreground"
							)}
						/>
					</div>
					<div className="min-w-0 flex-1">
						<div className="flex items-start justify-between gap-2">
							<div className="min-w-0">
								<p className="truncate text-sm font-bold text-foreground">
									{restaurant.name}
								</p>
								<p className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">
									{restaurant.category}
								</p>
							</div>
							<Link
								href={`/restaurants/${restaurant.id}`}
								className="shrink-0 text-xs font-semibold text-vm-tangerine"
							>
								View menu →
							</Link>
						</div>
						<div className="mt-1 flex items-center gap-1">
							<Star className="h-3 w-3 fill-vm-tangerine text-vm-tangerine" />
							<span className="text-xs font-bold text-foreground">{ratingDisplay}</span>
							<span className="text-[10px] text-muted-foreground">
								({compactNumber(restaurant.totalReviews)})
							</span>
						</div>
					</div>
				</div>

				{/* ── Desktop: vertical restaurant card ─────────────── */}
				<div className="hidden w-52 shrink-0 lg:block">
					<div className="rounded-lg bg-card p-5">
						<div className="relative mb-4 h-16 w-16 overflow-hidden rounded-lg border border-border bg-muted">
							<Image
								src={restaurant.logo || "https://placehold.co/200x200?text=VM"}
								alt={restaurant.name}
								width={64}
								height={64}
								className="h-full w-full object-cover"
								loading="lazy"
							/>
							<span
								className={cn(
									"absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card",
									restaurant.isOpen ? "bg-emerald-500" : "bg-muted-foreground"
								)}
							/>
						</div>

						<p className="text-[15px] font-bold leading-snug text-foreground">
							{restaurant.name}
						</p>
						<p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
							{restaurant.category}
						</p>

						<div className="mt-3 flex items-center gap-1">
							<Star className="h-3.5 w-3.5 fill-vm-tangerine text-vm-tangerine" />
							<span className="text-sm font-bold text-foreground">{ratingDisplay}</span>
							<span className="text-xs text-muted-foreground">
								({compactNumber(restaurant.totalReviews)})
							</span>
						</div>

						<div className="mt-1 text-xs text-muted-foreground">
							{restaurant.isOpen ? (
								<span className="font-semibold text-emerald-600">Open now</span>
							) : (
								<span>Closed</span>
							)}
						</div>

						<div className="mt-4 border-t border-border pt-4">
							<Link
								href={`/restaurants/${restaurant.id}`}
								className="flex items-center gap-1.5 text-sm font-semibold text-vm-tangerine transition-opacity hover:opacity-75"
							>
								View menu <ArrowRight className="h-3.5 w-3.5" />
							</Link>
						</div>
					</div>
				</div>

				{/* ── Menu item carousel ───────────────────────────── */}
				<div className="min-w-0 flex-1">
					<div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
						{items.map((item) => (
							<div key={item.id} className="w-[280px] shrink-0">
								<MenuItemCard item={item} restaurant={restaurantForCard} />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
