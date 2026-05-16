"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SlidersHorizontal } from "lucide-react"

import { ProductCard } from "@/components/main/product-card"
import { StoreCard } from "@/components/main/stores-card"
import { FoodSearchCard } from "@/components/search/food-search-card"
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
import { Skeleton } from "@/components/ui/skeleton"
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useSearch } from "@/hooks/queries/use-search"
import { useProducts } from "@/hooks/queries/use-products"
import type {
	Product as ApiProduct,
	FoodSearchItem,
	StoreListItem,
	ProductCondition,
} from "@/lib/api/types"

const TRENDING_SEARCHES = [
	"macbook", "jollof", "hostel mattress", "calculator",
	"indomie", "sneakers", "phone", "books",
]

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

function mapApiProductToCard(product: ApiProduct) {
	return {
		id: product.id,
		title: product.title,
		description: product.description,
		price: String(product.price),
		originalPrice: product.originalPrice ? String(product.originalPrice) : undefined,
		images: product.images,
		category: {
			id: product.category.id,
			name: product.category.name,
			icon: product.category.icon,
			count: product.category.count ?? 0,
		},
		condition:
			product.condition === "like_new" || product.condition === "like-new"
				? "Like New"
				: product.condition === "new"
					? "New"
					: product.condition.charAt(0).toUpperCase() + product.condition.slice(1),
		location: product.location,
		seller: {
			id: product.seller.id,
			name: product.seller.name,
			email: product.seller.email ?? "",
			avatar: product.seller.avatar,
			rating: String(product.seller.rating),
		},
		badges: product.badges,
		status: product.status,
		views: product.views,
		likes: product.likes,
		isNightShop: product.isNightShop,
		createdAt: product.createdAt,
	}
}


function mapApiStoreToCard(store: StoreListItem) {
	return {
		id: store.id,
		name: store.name,
		logo: store.logo || "",
		category: store.category,
		rating: String(store.rating),
		totalReviews: store.totalReviews,
		totalProducts: store.totalProducts,
		isOpen: store.isOpen,
	}
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
	const searchParams = useSearchParams()

	// Query is always driven by the URL — header navigation updates it automatically
	const query = searchParams.get("query") ?? ""
	const hasQuery = query.length > 0

	const [filters, setFilters] = React.useState<SearchFilters>(defaultFilters)
	const [sort, setSort] = React.useState<SortOption>("relevance")
	const [view, setView] = React.useState<"grid" | "list">("grid")
	const [isMobileFiltersOpen, setIsMobileFiltersOpen] = React.useState(false)

	const sortByApi =
		sort === "newest"
			? "newest"
			: sort === "price-low"
				? "price_low"
				: sort === "price-high"
					? "price_high"
					: "relevance"

	const { data: searchData, isLoading, isFetching } = useSearch(
		{
			query,
			type: filters.type,
			category: filters.category !== "all" ? filters.category : undefined,
			minPrice: filters.priceMin !== PRICE_RANGE_MIN ? filters.priceMin : undefined,
			maxPrice: filters.priceMax !== PRICE_RANGE_MAX ? filters.priceMax : undefined,
			condition:
				filters.conditions.length > 0
					? (filters.conditions[0].toLowerCase() as ProductCondition)
					: undefined,
			sortBy: sortByApi,
		},
		hasQuery
	)

	const { data: popularProductsData } = useProducts({ sortBy: "popular", limit: 4 })

	const products = searchData?.products || []
	const food = searchData?.food || []
	const stores = searchData?.stores || []

	const totalCount = searchData?.totals?.all ?? (
		(searchData?.totals?.products ?? 0) +
		(searchData?.totals?.stores ?? 0) +
		(searchData?.totals?.food ?? 0)
	)

	const activeFilterCount = React.useMemo(
		() =>
			Number(filters.category !== "all") +
			Number(filters.priceMin !== PRICE_RANGE_MIN || filters.priceMax !== PRICE_RANGE_MAX) +
			Number(filters.conditions.length > 0) +
			Number(filters.rating !== null) +
			Number(filters.openNow) +
			Number(filters.freeDelivery),
		[filters]
	)

	const clearFilters = () => setFilters((prev) => ({ ...defaultFilters, type: prev.type }))
	const handleFilterChange = (updates: Partial<SearchFilters>) =>
		setFilters((prev) => ({ ...prev, ...updates }))

	const sidebarProps = {
		filters,
		onChange: handleFilterChange,
		onClearFilters: clearFilters,
		activeFilterCount,
		categoryOptions: [],
		conditionOptions: [],
	}

	const popularProducts = (popularProductsData?.products || []).map(mapApiProductToCard)

	const MobileFilterTrigger = () => (
		<div className="lg:hidden">
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
	)

	return (
		<main className="min-h-svh pb-16">
			<div className="mx-auto max-w-7xl px-4 pt-6">
				{!hasQuery ? (
					<SearchEmptyState
						trendingSearches={TRENDING_SEARCHES}
						onSelectTrending={(q) => router.push(`/search?query=${encodeURIComponent(q)}`)}
						recentlyViewed={popularProducts}
					/>
				) : (
					<div className="flex gap-6">
						{/* Desktop filter sidebar */}
						<aside className="hidden shrink-0 lg:block">
							<FilterSidebar {...sidebarProps} />
						</aside>

						<div className="min-w-0 flex-1 space-y-4">
							{isLoading || (isFetching && !searchData) ? (
								<>
									<MobileFilterTrigger />
									<SkeletonGrid type={filters.type} />
								</>
							) : totalCount === 0 ? (
								<>
									<MobileFilterTrigger />
									<SearchNoResults
										query={query}
										popularProducts={popularProducts}
										onClearFilters={clearFilters}
										hasActiveFilters={activeFilterCount > 0}
									/>
								</>
							) : (
								<div className={cn("transition-opacity duration-200", isFetching && "opacity-50 pointer-events-none")}>
									<div className="flex flex-wrap items-center gap-3">
										<MobileFilterTrigger />
										<div className="min-w-0 flex-1">
											<SearchUtilityBar
												query={query}
												totalCount={totalCount}
												sort={sort}
												onSortChange={setSort}
												view={view}
												onViewChange={setView}
											/>
										</div>
									</div>

									{filters.type === "all" ? (
										<AllResultsView
											products={products.map(mapApiProductToCard)}
											food={food}
											stores={stores.map(mapApiStoreToCard)}
											view={view}
											onViewAll={(type) => handleFilterChange({ type })}
											productTotal={searchData?.totals?.products ?? 0}
											foodTotal={searchData?.totals?.food ?? 0}
											storeTotal={searchData?.totals?.stores ?? 0}
										/>
									) : (
										<TypeResultsView
											type={filters.type}
											products={products.map(mapApiProductToCard)}
											food={food}
											stores={stores.map(mapApiStoreToCard)}
											view={view}
										/>
									)}
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</main>
	)
}

function AllResultsView({
	products, food, stores, view, onViewAll, productTotal, foodTotal, storeTotal,
}: {
	products: ReturnType<typeof mapApiProductToCard>[]
	food: FoodSearchItem[]
	stores: ReturnType<typeof mapApiStoreToCard>[]
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
			content: products.length > 0 ? (
				<div className={cn("grid gap-3", view === "list" ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4")}>
					{products.slice(0, 8).map((item) => <ProductCard key={item.id} product={item} />)}
				</div>
			) : null,
		},
		{
			key: "food" as SearchType,
			title: "Food",
			total: foodTotal,
			content: food.length > 0 ? (
				<div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
					{food.slice(0, 6).map((item) => <FoodSearchCard key={item.id} item={item} />)}
				</div>
			) : null,
		},
		{
			key: "stores" as SearchType,
			title: "Stores",
			total: storeTotal,
			content: stores.length > 0 ? (
				<div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
					{stores.slice(0, 6).map((item) => <StoreCard key={item.id} store={item} />)}
				</div>
			) : null,
		},
	].filter((s) => s.total > 0)

	return (
		<div>
			{sections.map((section, index) => (
				<section key={section.key}>
					{index > 0 && <div className="border-b border-border" />}
					<div className="space-y-4 py-6">
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
	type, products, food, stores, view,
}: {
	type: SearchType
	products: ReturnType<typeof mapApiProductToCard>[]
	food: FoodSearchItem[]
	stores: ReturnType<typeof mapApiStoreToCard>[]
	view: "grid" | "list"
}) {
	if (type === "products") {
		return (
			<div className={cn("grid gap-3", view === "list" ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4")}>
				{products.map((item) => <ProductCard key={item.id} product={item} />)}
			</div>
		)
	}
	if (type === "food") {
		return (
			<div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
				{food.map((item) => <FoodSearchCard key={item.id} item={item} />)}
			</div>
		)
	}
	return (
		<div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
			{stores.map((item) => <StoreCard key={item.id} store={item} />)}
		</div>
	)
}

function SkeletonGrid({ type, count }: { type: SearchType; count?: number }) {
	const n = count ?? (type === "products" || type === "all" ? 8 : type === "food" ? 6 : 4)
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
				<Skeleton key={i} className="h-48 w-full rounded-lg" />
			))}
		</div>
	)
}
