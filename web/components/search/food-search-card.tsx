"use client"

import { useRouter } from "next/navigation"
import { Flame, Clock, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FoodSearchItem } from "@/lib/api/types"

function formatGHS(value: string) {
	const n = parseFloat(value)
	return isNaN(n)
		? value
		: new Intl.NumberFormat("en-GH", {
				style: "currency",
				currency: "GHS",
				maximumFractionDigits: 0,
			}).format(n)
}

export function FoodSearchCard({ item }: { item: FoodSearchItem }) {
	const router = useRouter()

	return (
		<button
			type="button"
			onClick={() => router.push(`/restaurants/${item.restaurant_id}`)}
			className="group flex w-full gap-3 rounded-xl border border-border bg-card p-3 text-left transition-shadow hover:shadow-sm"
		>
			{/* Restaurant logo */}
			<div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted md:h-24 md:w-24">
				<img
					src={item.restaurant_logo}
					alt={item.restaurant_name}
					className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
				/>
			</div>

			<div className="flex min-w-0 flex-1 flex-col justify-between">
				<div>
					{/* Badges */}
					{item.isVegetarian && (
						<span className="mb-1 inline-block rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-600">
							Veg
						</span>
					)}

					<p className="text-sm font-semibold leading-snug">{item.name}</p>
					<p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
						{item.description}
					</p>

					<div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
						{item.preparationTime && (
							<span className="flex items-center gap-0.5">
								<Clock className="h-3 w-3" />
								{item.preparationTime}
							</span>
						)}
						{item.spicyLevel > 0 && (
							<span className="flex items-center gap-0.5 text-orange-500">
								{Array.from({ length: item.spicyLevel }).map((_, i) => (
									<Flame key={i} className="h-3 w-3" />
								))}
							</span>
						)}
					</div>
				</div>

				<div className="mt-2 flex items-end justify-between gap-2">
					<span className="text-sm font-extrabold text-vm-tangerine">
						{formatGHS(item.price)}
					</span>

					{/* Restaurant info strip */}
					<div className="flex min-w-0 items-center gap-1.5">
						<span
							className={cn(
								"h-1.5 w-1.5 shrink-0 rounded-full",
								item.restaurant_is_open ? "bg-emerald-500" : "bg-rose-400"
							)}
						/>
						<span className="truncate text-[11px] text-muted-foreground">
							{item.restaurant_name}
						</span>
						{parseFloat(item.restaurant_rating) > 0 && (
							<span className="flex shrink-0 items-center gap-0.5 text-[11px] text-muted-foreground">
								<Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
								{parseFloat(item.restaurant_rating).toFixed(1)}
							</span>
						)}
					</div>
				</div>
			</div>
		</button>
	)
}
