"use client"
import Link from "next/link"
import Image from "next/image"
import {
	Star,
	Clock,
	Sparkles,
	Flame,
	Award,
	Zap,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type Restaurant = {
	id: string
	name: string
	logo: string
	banner: string
	category: string
	rating: string | number
	totalReviews: number
	deliveryTime: string
	deliveryFee: string | number
	minOrder: number
	isOpen: boolean
	badge?: string
}

function formatGHS(value: string | number) {
	const n = typeof value === "string" ? parseFloat(value) : value
	if (Number.isNaN(n)) return "—"
	return new Intl.NumberFormat("en-GH", {
		style: "currency",
		currency: "GHS",
		maximumFractionDigits: 0,
	}).format(n)
}

function compactNumber(n: number) {
	if (n < 1000) return n.toString()
	return new Intl.NumberFormat("en-US", {
		notation: "compact",
		maximumFractionDigits: 1,
	}).format(n)
}

function isFreeDelivery(fee: string) {
	const n = parseFloat(fee)
	return !Number.isNaN(n) && n === 0
}

function initials(name: string) {
	return name
		.split(" ")
		.map((p) => p[0])
		.filter(Boolean)
		.slice(0, 2)
		.join("")
		.toUpperCase()
}

function getBadgeIcon(badge: string) {
	const b = badge.toLowerCase()
	if (b.includes("popular") || b.includes("hot") || b.includes("trending")) {
		return <Flame className="h-3 w-3" />
	}
	if (b.includes("new")) {
		return <Zap className="h-3 w-3" />
	}
	if (b.includes("top") || b.includes("best") || b.includes("featured")) {
		return <Award className="h-3 w-3" />
	}
	return <Sparkles className="h-3 w-3" />
}

/* -----------------------------------------------------------
	 Restaurant card — theme-aware
----------------------------------------------------------- */
type RestaurantCardProps = {
	restaurant: Restaurant
	className?: string
}

export function RestaurantCard({ restaurant, className }: RestaurantCardProps) {
	const rating = typeof restaurant.rating === "number" ? restaurant.rating : parseFloat(restaurant.rating)
	const free = isFreeDelivery(String(restaurant.deliveryFee))

	return (
		<Link
			href={`/restaurants/${restaurant.id}`}
			className={cn(
				"group relative flex flex-col overflow-hidden rounded-md p-2 transition-all duration-300",
				"hover:-translate-y-1 hover:border-foreground/20 hover:shadow-lg",
				!restaurant.isOpen && "opacity-90",
				className
			)}
		>
			{/* ─── Banner ───────────────────────────────────────── */}
			<div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
				<Image
					src={restaurant.banner || "https://placehold.co/800x400?text=VM"}
					fill
					alt=""
					sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
					className={cn(
						"object-cover transition-all duration-700 ease-out group-hover:scale-105",
						!restaurant.isOpen && "grayscale"
					)}
					loading="lazy"
				/>

				{/* Top scrim for legibility */}
				<div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/40 to-transparent" />

				{/* Open / Closed status */}
				<div className="absolute left-3 top-3">
					<Badge
						className={cn(
							"h-6 gap-1.5 rounded-full border-0 px-2.5 text-[11px] font-semibold backdrop-blur-md",
							restaurant.isOpen
								? "bg-card/90 text-foreground hover:bg-card/90"
								: "bg-foreground/70 text-background hover:bg-foreground/70"
						)}
					>
						<span
							className={cn(
								"h-1.5 w-1.5 rounded-full",
								restaurant.isOpen
									? "animate-pulse bg-emerald-500"
									: "bg-background/60"
							)}
						/>
						{restaurant.isOpen ? "Open Now" : "Closed"}
					</Badge>
				</div>

				{/* Featured badge */}
				{restaurant.badge && (
					<div className="absolute right-3 top-3">
						<Badge className="h-6 gap-1 rounded-full border-0 bg-vm-tangerine px-2.5 text-[10px] font-bold uppercase tracking-wider text-vm-tangerine-foreground shadow-md hover:bg-vm-tangerine">
							{getBadgeIcon(restaurant.badge)}
							{restaurant.badge}
						</Badge>
					</div>
				)}

				{/* Delivery time */}
				<div className="absolute bottom-3 right-3">
					<div className="flex items-center gap-1.5 rounded-full bg-foreground/70 px-2.5 py-1 text-[11px] font-semibold text-background backdrop-blur-md">
						<Clock className="h-3 w-3" />
						{restaurant.deliveryTime}
					</div>
				</div>

				{/* Closed overlay */}
				{!restaurant.isOpen && (
					<div className="absolute inset-0 grid place-items-center bg-foreground/30 backdrop-blur-[1px]">
						<div className="rounded-md bg-card/95 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-foreground shadow-md">
							Currently Closed
						</div>
					</div>
				)}
			</div>

			{/* ─── Logo overlap ──────────────────────────────────── */}
			<div className="relative px-4">
				<Avatar className="absolute -top-7 left-4 h-14 w-14 rounded-md border-4 border-card shadow-md ring-1 ring-border/50">
					<AvatarImage
						src={restaurant.logo}
						alt={restaurant.name}
						className="rounded-sm object-cover"
					/>
					<AvatarFallback className="rounded-sm bg-foreground text-sm font-bold text-background">
						{initials(restaurant.name)}
					</AvatarFallback>
				</Avatar>
			</div>

			{/* ─── Content ──────────────────────────────────────── */}
			<div className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-9">
				<div className="flex items-start justify-between gap-2">
					<div className="min-w-0 flex-1">
						<h3 className="truncate text-base font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-vm-tangerine">
							{restaurant.name}
						</h3>
						<p className="mt-0.5 text-xs text-muted-foreground">
							{restaurant.category}
						</p>
					</div>

					{!Number.isNaN(rating) && (
						<div className="flex shrink-0 items-center gap-1 rounded-md bg-muted px-2 py-1">
							<Star className="h-3 w-3 fill-vm-tangerine text-vm-tangerine" />
							<span className="text-xs font-bold text-foreground">
								{rating.toFixed(1)}
							</span>
							<span className="text-[10px] text-muted-foreground">
								({compactNumber(restaurant.totalReviews)})
							</span>
						</div>
					)}
				</div>


				<div className="flex items-center justify-between text-xs">
					<div className="flex items-center gap-1.5 text-foreground">
						{free ? (
							<span className="font-semibold text-vm-tangerine">Free delivery</span>
						) : (
							<span>
								<span className="font-semibold">{formatGHS(restaurant.deliveryFee)}</span>
								<span className="text-muted-foreground"> delivery</span>
							</span>
						)}
					</div>

					<div className="flex items-center gap-1.5 text-muted-foreground">
						<span>
							Min{" "}
							<span className="font-semibold text-foreground">
								{formatGHS(restaurant.minOrder)}
							</span>
						</span>
					</div>
				</div>
			</div>
		</Link>
	)
}
