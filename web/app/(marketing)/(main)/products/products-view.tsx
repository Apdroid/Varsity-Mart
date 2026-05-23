"use client"

import { Suspense, useState, useMemo } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { ProductCard } from "@/components/main/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import {
	FilterSidebar,
	PRICE_RANGE_MAX,
	PRICE_RANGE_MIN,
} from "@/components/search/filter-sidebar"
import type { SearchFilters } from "@/components/search/filter-sidebar"
import { useProducts } from "@/hooks/queries/use-products"
import { useProductCategories } from "@/hooks/queries/use-categories"
import type { Product as ApiProduct, ProductCondition } from "@/lib/api/types"
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react"
import MagnifierIcon from "@/components/ui/magnifier-icon"
import { cn } from "@/lib/utils"
import Logo from "@/components/global/logo"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
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
			product.condition === "like_new"
				? "Like New"
				: product.condition === "new"
					? "New"
					: product.condition.charAt(0).toUpperCase() + product.condition.slice(1),
		location: product.location,
		seller: {
			id: product.seller.id,
			name: product.seller.name,
			email: product.seller.email ?? "",
			avatar: product.seller.avatarUrl,
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

const CONDITION_API_MAP: Record<string, ProductCondition> = {
	New: "new",
	"Like New": "like_new",
	Good: "good",
	Fair: "fair",
}

const SORT_OPTIONS = [
	{ value: "newest", label: "Newest" },
	{ value: "popular", label: "Popular" },
	{ value: "price_low", label: "Price: Low–High" },
	{ value: "price_high", label: "Price: High–Low" },
] as const
type SortValue = typeof SORT_OPTIONS[number]["value"]

const defaultFilters: SearchFilters = {
	type: "products",
	category: "all",
	priceMin: PRICE_RANGE_MIN,
	priceMax: PRICE_RANGE_MAX,
	conditions: [],
	rating: null,
	openNow: false,
	freeDelivery: false,
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------
function ProductsSkeleton({ view = "grid" }: { view?: "grid" | "list" }) {
	return (
		<div className={cn(
			view === "list"
				? "flex flex-col gap-3"
				: "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
		)}>
			{Array.from({ length: 20 }).map((_, i) => (
				<div key={i}>
					<Skeleton className="aspect-square w-full rounded-lg" />
					<Skeleton className="mt-2 h-4 w-3/4" />
					<Skeleton className="mt-1 h-4 w-1/2" />
				</div>
			))}
		</div>
	)
}

// ---------------------------------------------------------------------------
// Main content
// ---------------------------------------------------------------------------
function ProductsPageContent() {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const [searchInput, setSearchInput] = useState(searchParams.get("search") || "")
	const [filters, setFilters] = useState<SearchFilters>(defaultFilters)
	const [sort, setSort] = useState<SortValue>("newest")
	const [view, setView] = useState<"grid" | "list">("grid")
	const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

	const page = Number(searchParams.get("page")) || 1
	const searchQuery = searchParams.get("search") || undefined

	const { data: categoriesData } = useProductCategories()
	const categories = useMemo(() => categoriesData || [], [categoriesData])

	const categoryIdByName = useMemo(
		() => Object.fromEntries(categories.map((c) => [c.name, c.id])),
		[categories]
	)

	const { data, isLoading } = useProducts({
		category: filters.category !== "all" ? categoryIdByName[filters.category] : undefined,
		condition: filters.conditions.length > 0 ? CONDITION_API_MAP[filters.conditions[0]] : undefined,
		sortBy: sort,
		search: searchQuery,
		minPrice: filters.priceMin !== PRICE_RANGE_MIN ? filters.priceMin : undefined,
		maxPrice: filters.priceMax !== PRICE_RANGE_MAX ? filters.priceMax : undefined,
		page,
		limit: 20,
	})

	const products = data?.products || []
	const totalPages = data?.pagination.totalPages ?? 1
	const totalCount = data?.pagination.totalItems ?? products.length

	const categoryOptions = useMemo(
		() => categories.map((c) => ({ label: c.name, count: c.count ?? 0 })),
		[categories]
	)

	const activeFilterCount = useMemo(
		() =>
			Number(filters.category !== "all") +
			Number(filters.priceMin !== PRICE_RANGE_MIN || filters.priceMax !== PRICE_RANGE_MAX) +
			Number(filters.conditions.length > 0) +
			Number(filters.rating !== null),
		[filters]
	)

	const handleFilterChange = (updates: Partial<SearchFilters>) =>
		setFilters((prev) => ({ ...prev, ...updates, type: "products" }))

	const clearFilters = () => setFilters(defaultFilters)

	const handleSearch = (e: { preventDefault(): void }) => {
		e.preventDefault()
		const params = new URLSearchParams(searchParams.toString())
		if (searchInput) params.set("search", searchInput)
		else params.delete("search")
		params.delete("page")
		router.push(`${pathname}?${params.toString()}`)
	}

	const sidebarProps = {
		filters,
		onChange: handleFilterChange,
		onClearFilters: clearFilters,
		activeFilterCount,
		categoryOptions,
		conditionOptions: [],
	}

	const MobileFilterTrigger = () => (
		<div className="lg:hidden">
			<Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
				<SheetTrigger asChild>
					<Button variant="outline" size="lg" className=" bg-card w-40 rounded-full my-4 border-vm-tangerine border-2 ">
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
				<div className="w-full p-6">
					<Logo variant='header' />
				</div>
					<SheetHeader className="border-b border-border px-4 py-4">
						<SheetTitle>Filters</SheetTitle>
					</SheetHeader>
					<div className="flex-1 overflow-y-auto p-4">
						<FilterSidebar {...sidebarProps} />
					</div>
					<div className="border-t border-border p-4">
						<Button
							className="w-full rounded-full bg-vm-tangerine text-vm-tangerine-foreground hover:bg-vm-tangerine/90"
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
		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<div className="mb-6">
				<h1 className="text-3xl font-bold tracking-tight">Products</h1>
				<p className="mt-1 text-muted-foreground">Browse all products from campus sellers</p>
			</div>

			<div className="flex gap-6">
				{/* Desktop sidebar */}
				<aside className="hidden shrink-0 lg:block">
					<FilterSidebar {...sidebarProps} className="sticky top-20" />
				</aside>

				{/* Content */}
				<div className="min-w-0 flex-1 space-y-4">
					{/* Search bar + mobile filter trigger */}
					<div className="flex-col md:block  items-center gap-6">
						<MobileFilterTrigger />
						<form onSubmit={handleSearch} className="flex flex-1 gap-2">
							<div className="relative flex-1">
								<MagnifierIcon
									size={16}
									className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
								/>
								<Input
									placeholder="Search products..."
									value={searchInput}
									onChange={(e) => setSearchInput(e.target.value)}
									className="border-none outline-none pl-9"
								/>
							</div>
							<Button type="submit" className="vm-button w-30">Search</Button>
						</form>
					</div>

					{/* Utility bar: count + sort + view toggle */}
					{!isLoading && (
						<div className="flex flex-wrap items-center justify-between gap-3">
							<p className="text-sm text-muted-foreground">
								<span className="font-semibold text-foreground">{totalCount.toLocaleString()}</span>{" "}
								product{totalCount !== 1 ? "s" : ""}
								{searchQuery && (
									<>
										{" "}for{" "}
										<span className="font-semibold text-foreground">&ldquo;{searchQuery}&rdquo;</span>
									</>
								)}
							</p>
							<div className="flex shrink-0 items-center gap-2">
								<Select value={sort} onValueChange={(v) => setSort(v as SortValue)}>
									<SelectTrigger className="h-9 w-44 rounded-md bg-card px-3 text-sm">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{SORT_OPTIONS.map((opt) => (
											<SelectItem key={opt.value} value={opt.value}>
												{opt.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<div className="flex overflow-hidden rounded-md border border-border">
									<button
										type="button"
										onClick={() => setView("grid")}
										className={cn(
											"flex h-9 w-9 items-center justify-center transition-colors",
											view === "grid"
												? "bg-vm-tangerine text-vm-tangerine-foreground"
												: "text-muted-foreground hover:bg-muted"
										)}
									>
										<LayoutGrid className="h-4 w-4" />
										<span className="sr-only">Grid view</span>
									</button>
									<button
										type="button"
										onClick={() => setView("list")}
										className={cn(
											"flex h-9 w-9 items-center justify-center border-l border-border transition-colors",
											view === "list"
												? "bg-vm-tangerine text-vm-tangerine-foreground"
												: "text-muted-foreground hover:bg-muted"
										)}
									>
										<List className="h-4 w-4" />
										<span className="sr-only">List view</span>
									</button>
								</div>
							</div>
						</div>
					)}

					{/* Results */}
					{isLoading ? (
						<ProductsSkeleton view={view} />
					) : products.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-16 text-center">
							<SlidersHorizontal className="mb-4 h-12 w-12 text-muted-foreground" />
							<h2 className="text-xl font-semibold">No products found</h2>
							<p className="mt-2 text-muted-foreground">Try adjusting your filters or search terms</p>
							<Button
								variant="outline"
								className="mt-4"
								onClick={() => {
									clearFilters()
									router.push("/products")
								}}
							>
								Clear all filters
							</Button>
						</div>
					) : (
						<>
							<div className={cn(
								view === "list"
									? "flex flex-col divide-y divide-border"
									: "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4"
							)}>
								{products.map((product) => (
									<ProductCard
										key={product.id}
										product={mapApiProductToCard(product)}
										variant={view}
									/>
								))}
							</div>

							{totalPages > 1 && (
								<div className="mt-8 flex justify-center gap-2">
									<Button
										variant="outline"
										disabled={page <= 1}
										onClick={() => {
											const params = new URLSearchParams(searchParams.toString())
											params.set("page", String(page - 1))
											router.push(`${pathname}?${params.toString()}`)
										}}
									>
										Previous
									</Button>
									<span className="flex items-center px-4 text-sm text-muted-foreground">
										Page {page} of {totalPages}
									</span>
									<Button
										variant="outline"
										disabled={page >= totalPages}
										onClick={() => {
											const params = new URLSearchParams(searchParams.toString())
											params.set("page", String(page + 1))
											router.push(`${pathname}?${params.toString()}`)
										}}
									>
										Next
									</Button>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	)
}

export function ProductsView() {
	return (
		<Suspense fallback={<ProductsSkeleton />}>
			<ProductsPageContent />
		</Suspense>
	)
}
