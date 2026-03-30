"use client";

import { StoresCarousel } from "@/components/home/stores-carousel";
import { useStores } from "@/hooks/queries/useStores";

export function LiveStoresSection() {
	const { data, isLoading } = useStores({ limit: 10 } as any);
	const stores = (data as any)?.data ?? [];

	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="h-6 w-36 rounded animate-pulse" style={{ background: "var(--ink-4)" }} />
				<div className="flex gap-3 overflow-hidden">
					{Array.from({ length: 5 }).map((_, i) => (
						<div
							key={i}
							className="shrink-0 w-[180px] h-[180px] rounded-[var(--r)] animate-pulse"
							style={{ background: "var(--ink-4)" }}
						/>
					))}
				</div>
			</div>
		);
	}

	if (!stores.length) return null;

	return (
		<StoresCarousel
			stores={stores.slice(0, 10)}
			showBanner={true}
			title="Campus Stores"
			subtitle="Shop from verified student-run businesses"
		/>
	);
}
