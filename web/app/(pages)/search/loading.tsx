import { Search } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

function SearchSpinner() {
	return (
		<div className="flex flex-col items-center gap-3 py-10">
			<div className="relative flex h-12 w-12 items-center justify-center">
				{/* Outer ring */}
				<span className="absolute inset-0 animate-ping rounded-full bg-vm-tangerine/20" />
				<span className="absolute inset-1 animate-spin rounded-full border-2 border-transparent border-t-vm-tangerine" />
				<Search className="h-5 w-5 text-vm-tangerine" />
			</div>
			<p className="text-xs font-medium text-muted-foreground tracking-wide">Searching…</p>
		</div>
	)
}

function CardSkeleton() {
	return (
		<div className="rounded-xl border border-border bg-card p-3 space-y-2">
			<Skeleton className="aspect-square w-full rounded-lg" />
			<Skeleton className="h-3.5 w-3/4" />
			<Skeleton className="h-3 w-1/2" />
			<Skeleton className="h-4 w-1/3" />
		</div>
	)
}

export default function SearchLoading() {
	return (
		<main className="min-h-svh pb-16">
			<div className="mx-auto max-w-7xl px-4 pt-6">
				<div className="flex gap-6">
					{/* Sidebar skeleton — desktop only */}
					<aside className="hidden w-56 shrink-0 space-y-4 lg:block">
						<Skeleton className="h-5 w-24" />
						<div className="space-y-2">
							{Array.from({ length: 5 }).map((_, i) => (
								<Skeleton key={i} className="h-8 w-full rounded-md" />
							))}
						</div>
						<Skeleton className="h-px w-full" />
						<Skeleton className="h-5 w-20" />
						<Skeleton className="h-10 w-full rounded-md" />
						<Skeleton className="h-px w-full" />
						<Skeleton className="h-5 w-24" />
						<div className="space-y-2">
							{Array.from({ length: 3 }).map((_, i) => (
								<Skeleton key={i} className="h-8 w-full rounded-md" />
							))}
						</div>
					</aside>

					{/* Results area */}
					<div className="min-w-0 flex-1 space-y-4">
						<SearchSpinner />

						{/* Utility bar skeleton */}
						<div className="flex items-center justify-between">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-8 w-28 rounded-md" />
						</div>

						{/* Card grid */}
						<div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
							{Array.from({ length: 8 }).map((_, i) => (
								<CardSkeleton key={i} />
							))}
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}
