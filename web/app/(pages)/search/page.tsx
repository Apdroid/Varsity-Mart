"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SlidersHorizontal } from "lucide-react"

import { ProductCard } from "@/components/main/product-card"
import type { Product } from "@/components/main/product-card"
import { RestaurantCard } from "@/components/main/restaurant-card"
import type { Restaurant } from "@/components/main/restaurant-card"
import { StoreCard } from "@/components/main/stores-card"
import type { Store } from "@/components/main/stores-card"
import {
	FilterSidebar,
	PRICE_RANGE_MAX,
	PRICE_RANGE_MIN,
} from "@/components/search/filter-sidebar"
import type { SearchFilters, SearchType } from "@/components/search/filter-sidebar"
import { SearchEmptyState } from "@/components/search/search-empty-state"
import { SearchNoResults } from "@/components/search/search-no-results"
import { SearchUtilityBar } from "@/components/search/search-utility-bar"
import type { SortOption } from "@/components/search/search-utility-bar"
import { Button } from "@/components/ui/button"
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import { mockProducts } from "@/data/product"
import { mockRestaurants } from "@/data/restaurant"
import { mockStores } from "@/data/store"
import { cn } from "@/lib/utils"

const RECENT_SEARCHES_KEY = "vm-recent-searches"
const DEFAULT_RECENT_SEARCHES = ["jollof", "macbook", "sneakers", "indomie", "books"]
const TRENDING_SEARCHES = [
	"macbook",
	"jollof",
	"hostel mattress",
	"calculator",
	"indomie",
	"sneakers",
	"phone",
	"books",
]
const ITEMS_PER_PAGE = 24

const defaultFilters: SearchFilters = {
	type: "all",
	category: "all",
	priceMin: PRICE_RANGE_MIN,
	priceMax: PRICE_RANGE_MAX,
	conditions: [],
	rating: null,
	openNow: false,
	freeDelivery: false,
}

function normalizeType(v: string | null): SearchType {
	if (v === "products" || v === "stores" || v === "food") return v
	if (v === "restaurants") return "food"
	return "all"
}

function normalizeSort(v: string | null): SortOption {
	if (
		v === "newest" ||
		v === "price-low" ||
		v === "price-high" ||
		v === "highest-rated"
	)
		return v
	if (v === "relevant") return "relevance"
	return "relevance"
}

function parsePrice(v: string | null): [number, number] {
	if (!v || !v.includes("-")) return [PRICE_RANGE_MIN, PRICE_RANGE_MAX]
	const [a, b] = v.split("-").map(Number)
	if (Number.isNaN(a) || Number.isNaN(b)) return [PRICE_RANGE_MIN, PRICE_RANGE_MAX]
	return [Math.max(PRICE_RANGE_MIN, a), Math.min(PRICE_RANGE_MAX, b)]
}

function titleCase(s: string) {
	return s.replace(/\b\w/g, (c) => c.toUpperCase())
}

function parseState(params: URLSearchParams) {
	const [priceMin, priceMax] = parsePrice(params.get("price"))
	const conditionParam = params.get("condition") ?? ""
	const conditions = conditionParam
		? conditionParam.split(",").filter(Boolean).map(titleCase)
		: []
	const ratingRaw = params.get("rating")
	const rating = ratingRaw !== null ? Number(ratingRaw) : null

	return {
		query: params.get("query") ?? "",
		filters: {
			type: normalizeType(params.get("type")),
			category: params.get("category") ?? "all",
			priceMin,
			priceMax,
			conditions,
			rating: rating !== null && !Number.isNaN(rating) ? rating : null,
			openNow: params.get("open") === "1",
			freeDelivery: params.get("delivery") === "free",
		} satisfies SearchFilters,
		sort: normalizeSort(params.get("sort")),
		view: (params.get("view") === "list" ? "list" : "grid") as "grid" | "list",
	}
}

function buildParams(
	query: string,
	filters: SearchFilters,
	sort: SortOption,
	view: "grid" | "list"
) {
	const params = new URLSearchParams()
	if (query) params.set("query", query)
	if (filters.type !== "all") params.set("type", filters.type)
	if (filters.category !== "all") params.set("category", filters.category)
	if (filters.priceMin !== PRICE_RANGE_MIN || filters.priceMax !== PRICE_RANGE_MAX) {
		params.set("price", `${filters.priceMin}-${filters.priceMax}`)
	}
	if (filters.conditions.length > 0) {
		params.set("condition", filters.conditions.map((c) => c.toLowerCase()).join(","))
	}
	if (filters.rating !== null) params.set("rating", String(filters.rating))
	if (sort !== "relevance") params.set("sort", sort)
	if (filters.openNow) params.set("open", "1")
	if (filters.freeDelivery) params.set("delivery", "free")
	if (view === "list") params.set("view", "list")
	return params.toString()
}

function toNum(v: string | number): number {
	const n = typeof v === "string" ? Number.parseFloat(v) : v
	return Number.isNaN(n) ? 0 : n
}

function scoreMatch(haystack: string, query: string): number {
	return haystack.includes(query) ? 1 : 0
}

export default function SearchPage() {
	return (
		<React.Suspense fallback={<div className="min-h-svh bg-background" />}>
			<SearchPageClient />
		</React.Suspense>
	)
}

function SearchPageClient() {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const inputRef = React.useRef<HTMLInputElement>(null)


	const initial = React.useMemo(
		() => parseState(new URLSearchParams(searchParams.toString())),
		[]
	)

	const [query, setQuery] = React.useState(initial.query)
	const [filters, setFilters] = React.useState<SearchFilters>(initial.filters)
	const [sort, setSort] = React.useState<SortOption>(initial.sort)
	const [view, setView] = React.useState<"grid" | "list">(initial.view)
	const [isInputFocused, setIsInputFocused] = React.useState(false)
	const [isMobileFiltersOpen, setIsMobileFiltersOpen] = React.useState(false)
	const [displayCount, setDisplayCount] = React.useState(ITEMS_PER_PAGE)
	const [isLoadingMore, setIsLoadingMore] = React.useState(false)
	const [recentSearches, setRecentSearches] = React.useState<string[]>(() => {
		if (typeof window === "undefined") return DEFAULT_RECENT_SEARCHES
		try {
			const stored = window.localStorage.getItem(RECENT_SEARCHES_KEY)
			if (!stored) return DEFAULT_RECENT_SEARCHES
			const parsed = JSON.parse(stored) as string[]
			return Array.isArray(parsed) && parsed.length > 0
				? parsed.slice(0, 5)
				: DEFAULT_RECENT_SEARCHES
		} catch {
			return DEFAULT_RECENT_SEARCHES
		}
	})
	const [debouncedQuery, setDebouncedQuery] = React.useState(query.trim())

	React.useEffect(() => {
		const timer = window.setTimeout(() => {
			const next = query.trim()
			setDebouncedQuery(next)
			if (next) {
				setRecentSearches((prev) =>
					[next, ...prev.filter((s) => s !== next)].slice(0, 5)
				)
			}
		}, 200)
		return () => window.clearTimeout(timer)
	}, [query])

	React.useEffect(() => {
		try {
			window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches))
		} catch { }
	}, [recentSearches])

	React.useEffect(() => {
		setDisplayCount(ITEMS_PER_PAGE)
	}, [
		debouncedQuery,
		filters.type,
		filters.category,
		filters.priceMin,
		filters.priceMax,
		filters.conditions,
		filters.rating,
		filters.openNow,
		filters.freeDelivery,
		sort,
	])

	const serializedParams = React.useMemo(
		() => buildParams(query.trim(), filters, sort, view),
		[query, filters, sort, view]
	)

	React.useEffect(() => {
		if (serializedParams === searchParams.toString()) return
		const target = serializedParams ? `${pathname}?${serializedParams}` : pathname
		router.replace(target, { scroll: false })
	}, [serializedParams, pathname, router, searchParams])

	const isDebouncing = query.trim() !== debouncedQuery
	const hasQuery = debouncedQuery.length > 0
	const queryLower = debouncedQuery.toLowerCase()

	const categoryOptions = React.useMemo(() => {
		const counts = new Map<string, number>()
		for (const p of mockProducts) {
			const haystack =
				`${p.title} ${p.description} ${p.category.name} ${p.location} ${p.seller.name}`.toLowerCase()
			if (!queryLower || haystack.includes(queryLower)) {
				counts.set(p.category.name, (counts.get(p.category.name) ?? 0) + 1)
			}
		}
		return Array.from(counts.entries())
			.map(([label, count]) => ({ label, count }))
			.sort((a, b) => b.count - a.count)
	}, [queryLower])

	const conditionOptions = React.useMemo(() => {
		const counts = new Map<string, number>()
		for (const p of mockProducts) {
			const haystack = `${p.title} ${p.description} ${p.category.name}`.toLowerCase()
			if (!queryLower || haystack.includes(queryLower)) {
				counts.set(p.condition, (counts.get(p.condition) ?? 0) + 1)
			}
		}
		return Array.from(counts.entries()).map(([label, count]) => ({ label, count }))
	}, [queryLower])

	const filteredProducts = React.useMemo(() => {
		if (!hasQuery) return []
		return mockProducts.filter((p) => {
			const haystack =
				`${p.title} ${p.description} ${p.category.name} ${p.location} ${p.seller.name}`.toLowerCase()
			if (!haystack.includes(queryLower)) return false
			const price = toNum(p.price)
			if (filters.priceMin !== PRICE_RANGE_MIN && price < filters.priceMin) return false
			if (filters.priceMax !== PRICE_RANGE_MAX && price > filters.priceMax) return false
			if (filters.category !== "all" && p.category.name !== filters.category) return false
			if (
				filters.conditions.length > 0 &&
				!filters.conditions.includes(p.condition)
			)
				return false
			if (filters.rating !== null && toNum(p.seller.rating) < filters.rating) return false
			return true
		})
	}, [hasQuery, queryLower, filters])

	const filteredFood = React.useMemo(() => {
		if (!hasQuery) return []
		return mockRestaurants.filter((r) => {
			const haystack = `${r.name} ${r.category}`.toLowerCase()
			if (!haystack.includes(queryLower)) return false
			if (filters.openNow && !r.isOpen) return false
			if (filters.freeDelivery && r.deliveryFee !== "0") return false
			if (filters.rating !== null && toNum(r.rating) < filters.rating) return false
			return true
		})
	}, [hasQuery, queryLower, filters])

	const filteredStores = React.useMemo(() => {
		if (!hasQuery) return []
		return mockStores.filter((s) => {
			const haystack = `${s.name} ${s.category}`.toLowerCase()
			if (!haystack.includes(queryLower)) return false
			if (filters.openNow && !s.isOpen) return false
			if (filters.rating !== null && toNum(s.rating) < filters.rating) return false
			return true
		})
	}, [hasQuery, queryLower, filters])

	const productRelevance = React.useCallback(
		(p: Product) =>
			scoreMatch(p.title.toLowerCase(), queryLower) * 4 +
			scoreMatch(p.description.toLowerCase(), queryLower) * 2 +
			scoreMatch(p.category.name.toLowerCase(), queryLower),
		[queryLower]
	)

	const sortedProducts = React.useMemo(() => {
		const arr = [...filteredProducts]
		arr.sort((a, b) => {
			if (sort === "newest")
				return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			if (sort === "highest-rated") return toNum(b.seller.rating) - toNum(a.seller.rating)
			if (sort === "price-low") return toNum(a.price) - toNum(b.price)
			if (sort === "price-high") return toNum(b.price) - toNum(a.price)
			return productRelevance(b) - productRelevance(a)
		})
		return arr
	}, [filteredProducts, sort, productRelevance])

	const sortedFood = React.useMemo(() => {
		const arr = [...filteredFood]
		arr.sort((a, b) => {
			if (sort === "newest") return b.id.localeCompare(a.id)
			if (sort === "highest-rated") return toNum(b.rating) - toNum(a.rating)
			if (sort === "price-low") return a.minOrder - b.minOrder
			return (
				scoreMatch(b.name.toLowerCase(), queryLower) -
				scoreMatch(a.name.toLowerCase(), queryLower)
			)
		})
		return arr
	}, [filteredFood, sort, queryLower])

	const sortedStores = React.useMemo(() => {
		const arr = [...filteredStores]
		arr.sort((a, b) => {
			if (sort === "newest") return b.id.localeCompare(a.id)
			if (sort === "highest-rated") return toNum(b.rating) - toNum(a.rating)
			return (
				scoreMatch(b.name.toLowerCase(), queryLower) -
				scoreMatch(a.name.toLowerCase(), queryLower)
			)
		})
		return arr
	}, [filteredStores, sort, queryLower])

	const totalCount =
		filters.type === "products"
			? sortedProducts.length
			: filters.type === "food"
				? sortedFood.length
				: filters.type === "stores"
					? sortedStores.length
					: sortedProducts.length + sortedFood.length + sortedStores.length

	const activeFilterCount = React.useMemo(
		() =>
			Number(filters.category !== "all") +
			Number(
				filters.priceMin !== PRICE_RANGE_MIN || filters.priceMax !== PRICE_RANGE_MAX
			) +
			Number(filters.conditions.length > 0) +
			Number(filters.rating !== null) +
			Number(filters.openNow) +
			Number(filters.freeDelivery),
		[filters]
	)

	const clearFilters = () =>
		setFilters((prev) => ({ ...defaultFilters, type: prev.type }))

	const handleFilterChange = (updates: Partial<SearchFilters>) =>
		setFilters((prev) => ({ ...prev, ...updates }))

	const handleLoadMore = () => {
		setIsLoadingMore(true)
		window.setTimeout(() => {
			setDisplayCount((prev) => prev + ITEMS_PER_PAGE)
			setIsLoadingMore(false)
		}, 500)
	}

	const visibleProducts =
		filters.type === "all" ? sortedProducts : sortedProducts.slice(0, displayCount)
	const visibleFood =
		filters.type === "all" ? sortedFood : sortedFood.slice(0, displayCount)
	const visibleStores =
		filters.type === "all" ? sortedStores : sortedStores.slice(0, displayCount)

	const hasMore =
		filters.type !== "all" &&
		(filters.type === "products"
			? sortedProducts.length > displayCount
			: filters.type === "food"
				? sortedFood.length > displayCount
				: sortedStores.length > displayCount)

	const sidebarProps = {
		filters,
		onChange: handleFilterChange,
		onClearFilters: clearFilters,
		activeFilterCount,
		categoryOptions,
		conditionOptions,
	}

	const utilityBarProps = {
		query,
		onQueryChange: setQuery,
		debouncedQuery,
		totalCount,
		sort,
		onSortChange: setSort,
		view,
		onViewChange: setView,
		recentSearches,
		isInputFocused,
		onFocus: () => setIsInputFocused(true),
		onBlur: () => window.setTimeout(() => setIsInputFocused(false), 100),
		hasQuery,
		inputRef,
	}

	return (
		<main className="pb-16 max-w-7xl mx-auto">
			{/* Page-level utility bar */}
			<div className="border-b border-border bg-background px-4 py-4">
				<div className="my-5 mx-auto max-w-8xl">
					<SearchUtilityBar {...utilityBarProps} />
				</div>
			</div>

			<div className="mx-auto max-w-8xl px-4">
				{!hasQuery ? (
					<SearchEmptyState
						trendingSearches={TRENDING_SEARCHES}
						onSelectTrending={setQuery}
						recentlyViewed={mockProducts.slice(0, 4)}
					/>
				) : (
					<div className="mt-6 flex gap-6">
						{/* Desktop sidebar */}
						<aside className="hidden shrink-0 lg:block">
							<div className=" top-20">
								<FilterSidebar {...sidebarProps} />
							</div>
						</aside>

						{/* Results column */}
						<div className="min-w-0 flex-1 space-y-4">
							{/* Mobile filter trigger */}
							<div className="flex items-center lg:hidden">
								<Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
									<SheetTrigger asChild>
										<Button variant="outline" size="sm" className="rounded-md bg-card">
											<SlidersHorizontal className="h-4 w-4" />
											Filters
											{activeFilterCount > 0 && (
												<span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-vm-tangerine text-[11px] font-bold text-vm-tangerine-foreground">
													{activeFilterCount}
												</span>
											)}
										</Button>
									</SheetTrigger>
									<SheetContent side="left" className="flex w-[85vw] max-w-sm flex-col bg-card p-0">
										<SheetHeader className="border-b border-border px-4 py-4">
											<SheetTitle>Filters</SheetTitle>
										</SheetHeader>
										<div className="flex-1 overflow-y-auto p-4">
											<FilterSidebar {...sidebarProps} />
										</div>
										<div className="border-t border-border p-4">
											<Button
												className="w-full rounded-md bg-vm-tangerine text-vm-tangerine-foreground hover:bg-vm-tangerine/90"
												onClick={() => setIsMobileFiltersOpen(false)}
											>
												Apply Filters
											</Button>
										</div>
									</SheetContent>
								</Sheet>
							</div>

							{/* Result content */}
							{isDebouncing ? (
								<SkeletonGrid type={filters.type} />
							) : totalCount === 0 ? (
								<SearchNoResults
									query={debouncedQuery}
									popularProducts={[...mockProducts]
										.sort((a, b) => b.likes - a.likes)
										.slice(0, 4)}
									onClearFilters={clearFilters}
									hasActiveFilters={activeFilterCount > 0}
								/>
							) : filters.type === "all" ? (
								<AllResultsView
									products={visibleProducts}
									food={visibleFood}
									stores={visibleStores}
									view={view}
									onViewAll={(type) => handleFilterChange({ type })}
									productTotal={sortedProducts.length}
									foodTotal={sortedFood.length}
									storeTotal={sortedStores.length}
								/>
							) : (
								<>
									<TypeResultsView
										type={filters.type}
										products={visibleProducts}
										food={visibleFood}
										stores={visibleStores}
										view={view}
									/>
									{hasMore && !isLoadingMore && (
										<div className="flex justify-center pt-6">
											<Button
												variant="outline"
												className="rounded-md px-8"
												onClick={handleLoadMore}
											>
												Load more
											</Button>
										</div>
									)}
									{isLoadingMore && <SkeletonGrid type={filters.type} count={4} />}
								</>
							)}
						</div>
					</div>
				)}
			</div>
		</main>
	)
}

/* ── Sub-views ─────────────────────────────────────────────── */

function AllResultsView({
	products,
	food,
	stores,
	view,
	onViewAll,
	productTotal,
	foodTotal,
	storeTotal,
}: {
	products: Product[]
	food: Restaurant[]
	stores: Store[]
	view: "grid" | "list"
	onViewAll: (type: SearchType) => void
	productTotal: number
	foodTotal: number
	storeTotal: number
}) {
	const sections = [
		{
			key: "products" as SearchType,
			title: "Products",
			total: productTotal,
			content:
				products.length > 0 ? (
					<div
						className={cn(
							"grid gap-3",
							view === "list"
								? "grid-cols-1"
								: "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
						)}
					>
						{products.slice(0, 8).map((item) => (
							<ProductCard key={item.id} product={item} />
						))}
					</div>
				) : null,
		},
		{
			key: "food" as SearchType,
			title: "Food",
			total: foodTotal,
			content:
				food.length > 0 ? (
					<div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
						{food.slice(0, 6).map((item) => (
							<RestaurantCard key={item.id} restaurant={item} />
						))}
					</div>
				) : null,
		},
		{
			key: "stores" as SearchType,
			title: "Stores",
			total: storeTotal,
			content:
				stores.length > 0 ? (
					<div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
						{stores.slice(0, 6).map((item) => (
							<StoreCard key={item.id} store={item} />
						))}
					</div>
				) : null,
		},
	].filter((s) => s.total > 0)

	return (
		<div>
			{sections.map((section, index) => (
				<section key={section.key}>
					{index > 0 && <div className="border-b border-border" />}
					<div className="space-y-4 py-8">
						<div className="flex items-center justify-between">
							<h2 className="font-heading text-xl font-bold text-foreground">
								{section.title}{" "}
								<span className="text-base font-normal text-muted-foreground">
									({section.total})
								</span>
							</h2>
							{section.total > 6 && (
								<button
									type="button"
									onClick={() => onViewAll(section.key)}
									className="text-sm font-semibold text-vm-tangerine hover:underline"
								>
									View all {section.total} →
								</button>
							)}
						</div>
						{section.content}
					</div>
				</section>
			))}
		</div>
	)
}

function TypeResultsView({
	type,
	products,
	food,
	stores,
	view,
}: {
	type: SearchType
	products: Product[]
	food: Restaurant[]
	stores: Store[]
	view: "grid" | "list"
}) {
	if (type === "products") {
		return (
			<div
				className={cn(
					"grid gap-3",
					view === "list"
						? "grid-cols-1"
						: "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
				)}
			>
				{products.map((item) => (
					<ProductCard key={item.id} product={item} />
				))}
			</div>
		)
	}
	if (type === "food") {
		return (
			<div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
				{food.map((item) => (
					<RestaurantCard key={item.id} restaurant={item} />
				))}
			</div>
		)
	}
	return (
		<div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
			{stores.map((item) => (
				<StoreCard key={item.id} store={item} />
			))}
		</div>
	)
}

function SkeletonGrid({
	type,
	count,
}: {
	type: SearchType
	count?: number
}) {
	const n =
		count ??
		(type === "products" || type === "all" ? 8 : type === "food" ? 6 : 4)
	return (
		<div
			className={cn(
				"grid gap-3",
				type === "products" || type === "all"
					? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
					: type === "food"
						? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
						: "grid-cols-1 lg:grid-cols-2"
			)}
		>
			{Array.from({ length: n }, (_, i) => (
				<div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
			))}
		</div>
	)
}
