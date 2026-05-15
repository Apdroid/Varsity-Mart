"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
	ArrowRight,
	Clock,
	MapPin,
	Phone,
	Plus,
	Star,
	Store,
	TrendingUp,
	Truck,
	UtensilsCrossed,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { useMyRestaurant } from "@/hooks/queries/use-restaurants"
import { useAuth } from "@/providers/auth-provider"
import { cn } from "@/lib/utils"
import type { RestaurantDetail } from "@/lib/api/types"

function formatGHS(n: number | string) {
	return new Intl.NumberFormat("en-GH", {
		style: "currency",
		currency: "GHS",
		maximumFractionDigits: 0,
	}).format(Number(n))
}

function formatTime(t?: string) {
	if (!t) return null
	const [h, m] = t.split(":")
	const hour = Number(h)
	const ampm = hour >= 12 ? "PM" : "AM"
	const display = hour % 12 || 12
	return `${display}:${m} ${ampm}`
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

function MyRestaurantSkeleton() {
	return (
		<div className="mx-auto max-w-3xl px-4 pb-16 pt-8">
			<Skeleton className="mb-6 h-7 w-48" />
			<Skeleton className="mb-4 h-44 w-full rounded-2xl" />
			<div className="flex items-end gap-4 px-4">
				<Skeleton className="h-20 w-20 rounded-2xl" />
				<div className="flex-1 space-y-2 pb-1">
					<Skeleton className="h-5 w-52" />
					<Skeleton className="h-4 w-32" />
				</div>
			</div>
			<div className="mt-6 grid grid-cols-3 gap-3">
				{Array.from({ length: 3 }).map((_, i) => (
					<Skeleton key={i} className="h-20 rounded-xl" />
				))}
			</div>
		</div>
	)
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: React.ElementType }) {
	return (
		<Card className="text-center">
			<CardContent className="p-4">
				<Icon className="mx-auto mb-2 h-5 w-5 text-vm-tangerine" />
				<p className="text-xl font-bold">{value}</p>
				<p className="text-xs text-muted-foreground">{label}</p>
			</CardContent>
		</Card>
	)
}

// ── Info row ──────────────────────────────────────────────────────────────────

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
	return (
		<div className="flex items-start gap-3 py-2.5">
			<Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
			<div className="min-w-0 flex-1">
				<p className="text-xs text-muted-foreground">{label}</p>
				<p className="text-sm font-medium">{value}</p>
			</div>
		</div>
	)
}

// ── Main restaurant view ──────────────────────────────────────────────────────

function RestaurantView({ restaurant }: { restaurant: RestaurantDetail }) {
	const openTime = formatTime(restaurant.openingTime)
	const closeTime = formatTime(restaurant.closingTime)
	const hours = openTime && closeTime ? `${openTime} – ${closeTime}` : "Not specified"

	return (
		<div className="mx-auto max-w-3xl px-4 pb-16 pt-8">
			{/* Page header */}
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold font-heading">My Restaurant</h1>
				<Button asChild size="sm" variant="outline">
					<Link href="/seller/dashboard">
						Dashboard
						<ArrowRight className="ml-1.5 h-3.5 w-3.5" />
					</Link>
				</Button>
			</div>

			{/* Banner */}
			<div className="relative aspect-[3/1] w-full overflow-hidden rounded-2xl bg-muted">
				{restaurant.banner ? (
					<Image src={restaurant.banner} alt="Restaurant banner" fill className="object-cover" />
				) : (
					<div className="flex h-full w-full items-center justify-center">
						<UtensilsCrossed className="h-12 w-12 text-muted-foreground/30" />
					</div>
				)}
				{/* Status badge */}
				<div className="absolute right-3 top-3">
					<Badge
						className={cn(
							"gap-1 border-0 font-semibold",
							restaurant.isOpen
								? "bg-emerald-500/90 text-white"
								: "bg-muted-foreground/70 text-white"
						)}
					>
						<span className={cn("h-1.5 w-1.5 rounded-full", restaurant.isOpen ? "bg-white animate-pulse" : "bg-white/60")} />
						{restaurant.isOpen ? "Open" : "Closed"}
					</Badge>
				</div>
			</div>

			{/* Logo + name row */}
			<div className="-mt-8 flex items-end gap-4 px-2">
				<div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-4 border-background bg-muted shadow-md">
					{restaurant.logo ? (
						<Image src={restaurant.logo} alt={restaurant.name} fill className="object-cover" />
					) : (
						<div className="flex h-full w-full items-center justify-center bg-vm-tangerine/10">
							<UtensilsCrossed className="h-8 w-8 text-vm-tangerine" />
						</div>
					)}
				</div>
				<div className="flex-1 pb-1">
					<h2 className="text-lg font-bold leading-tight">{restaurant.name}</h2>
					<p className="text-sm text-muted-foreground">{restaurant.category}</p>
				</div>
			</div>

			{/* Stats */}
			<div className="mt-6 grid grid-cols-3 gap-3">
				<StatCard icon={Star} label="Rating" value={Number(restaurant.rating) > 0 ? Number(restaurant.rating).toFixed(1) : "New"} />
				<StatCard icon={TrendingUp} label="Reviews" value={restaurant.totalReviews} />
				<StatCard icon={Truck} label="Delivery" value={restaurant.deliveryTime || "—"} />
			</div>

			{/* Description */}
			{restaurant.description && (
				<p className="mt-5 text-sm leading-relaxed text-muted-foreground">{restaurant.description}</p>
			)}

			<Separator className="my-5" />

			{/* Details */}
			<Card>
				<CardHeader className="pb-2 pt-4">
					<CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
						Restaurant details
					</CardTitle>
				</CardHeader>
				<CardContent className="divide-y divide-border px-4 pb-2">
					{restaurant.location && (
						<InfoRow icon={MapPin} label="Location" value={restaurant.location} />
					)}
					<InfoRow icon={Clock} label="Hours" value={hours} />
					<InfoRow
						icon={Truck}
						label="Delivery fee"
						value={Number(restaurant.deliveryFee) === 0 ? "Free" : formatGHS(restaurant.deliveryFee)}
					/>
					<InfoRow
						icon={Store}
						label="Minimum order"
						value={formatGHS(restaurant.minOrder)}
					/>
					{restaurant.phone && (
						<InfoRow icon={Phone} label="Phone" value={restaurant.phone} />
					)}
				</CardContent>
			</Card>

			{/* Actions */}
			<div className="mt-6 grid grid-cols-2 gap-3">
				<Button asChild variant="outline" className="h-11">
					<Link href={`/restaurants/${restaurant.id}`}>
						View public page
					</Link>
				</Button>
				<Button asChild className="h-11 bg-vm-tangerine text-white hover:bg-vm-tangerine/90">
					<Link href="/seller/menu/add">
						<Plus className="mr-1.5 h-4 w-4" />
						Add menu item
					</Link>
				</Button>
			</div>
		</div>
	)
}

// ── Empty state ───────────────────────────────────────────────────────────────

function NoRestaurant() {
	const router = useRouter()
	return (
		<div className="mx-auto max-w-md px-4 py-24 text-center">
			<div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-vm-tangerine/10">
				<UtensilsCrossed className="h-8 w-8 text-vm-tangerine" />
			</div>
			<h1 className="text-xl font-bold">You don&apos;t have a restaurant yet</h1>
			<p className="mt-2 text-sm text-muted-foreground">
				Open your campus restaurant and start taking food orders from students.
			</p>
			<Button
				className="mt-6 bg-vm-tangerine text-white hover:bg-vm-tangerine/90 rounded-full px-8"
				onClick={() => router.push("/seller/restaurant/create")}
			>
				Open a restaurant
			</Button>
		</div>
	)
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MyRestaurantPage() {
	const { isLoading: authLoading } = useAuth()
	const { data: restaurant, isLoading, error } = useMyRestaurant()

	if (authLoading || isLoading) return <MyRestaurantSkeleton />

	if (error || !restaurant) return <NoRestaurant />

	return <RestaurantView restaurant={restaurant} />
}
