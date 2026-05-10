"use client";

import { RestaurantsCarousel } from "@/components/home/restaurants-carousel";
import { useRestaurants } from "@/hooks/queries/useRestaurants";

export function LiveRestaurantsSection() {
	const { data, isLoading } = useRestaurants({ limit: 10 } as any);
	const restaurants = (data as any)?.data ?? [];

	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="h-6 w-40 rounded animate-pulse" style={{ background: "var(--ink-4)" }} />
				<div className="flex gap-3 overflow-hidden">
					{Array.from({ length: 5 }).map((_, i) => (
						<div
							key={i}
							className="shrink-0 w-[200px] h-[200px] rounded-[var(--r)] animate-pulse"
							style={{ background: "var(--ink-4)" }}
						/>
					))}
				</div>
			</div>
		);
	}

	if (!restaurants.length) return null;

	return (
		<RestaurantsCarousel
			restaurants={restaurants.slice(0, 10)}
			showBanner={true}
			title="Hungry? Order Now"
			subtitle="Fresh meals delivered from campus restaurants"
		/>
	);
}
