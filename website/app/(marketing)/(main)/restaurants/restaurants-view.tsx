"use client"

import * as React from "react"
import { Search, SlidersHorizontal, UtensilsCrossed } from "lucide-react"

import { FeaturedRestaurantCard } from "@/components/restaurants/featured-restaurant-card"
import { CuisinePill } from "@/components/restaurants/cuisine-pill"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
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
import { useRestaurants } from "@/hooks/queries/use-restaurants"
import type { RestaurantListItem } from "@/lib/api/types"

type SortFilter = "popular" | "rating" | "newest"

const CUISINES = [
  { label: "All", emoji: "🍽️", query: "all" },
  { label: "Ghanaian", emoji: "🇬🇭", query: "ghanaian" },
  { label: "Pizza", emoji: "🍕", query: "pizza" },
  { label: "Burgers", emoji: "🍔", query: "burger" },
  { label: "Wings", emoji: "🍗", query: "wings" },
  { label: "Chinese", emoji: "🥡", query: "chinese" },
  { label: "Healthy", emoji: "🥗", query: "healthy" },
  { label: "Drinks", emoji: "🥤", query: "drink" },
  { label: "Late Night", emoji: "🌙", query: "late" },
  { label: "Breakfast", emoji: "☕", query: "coffee" },
] as const

const SORT_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
] as const

const defaultFilters: SearchFilters = {
  type: "food",
  category: "all",
  priceMin: PRICE_RANGE_MIN,
  priceMax: PRICE_RANGE_MAX,
  conditions: [],
  rating: null,
  openNow: false,
  freeDelivery: false,
}

function mapApiRestaurantToCard(restaurant: RestaurantListItem) {
  return {
    id: restaurant.id,
    name: restaurant.name,
    logo: restaurant.logo || "",
    banner: restaurant.banner || restaurant.logo || "",
    category: restaurant.category,
    rating: restaurant.rating,
    totalReviews: restaurant.totalReviews,
    deliveryTime: restaurant.deliveryTime,
    deliveryFee: restaurant.deliveryFee,
    minOrder: restaurant.minOrder,
    isOpen: restaurant.isOpen,
    badge: restaurant.badge,
  }
}

function SectionsSkeleton() {
  return (
    <div className="space-y-8">
      {Array.from({ length: 2 }).map((_, s) => (
        <div key={s} className="space-y-3">
          <Skeleton className="h-6 w-40" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-56 w-full rounded-md" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function RestaurantsView() {
  const [search, setSearch] = React.useState("")
  const [cuisine, setCuisine] = React.useState<string>("all")
  const [sort, setSort] = React.useState<SortFilter>("popular")
  const [page, setPage] = React.useState(1)
  const [filters, setFilters] = React.useState<SearchFilters>(defaultFilters)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = React.useState(false)

  const { data: restaurantsData, isLoading } = useRestaurants({
    search: search || undefined,
    cuisineType: cuisine === "all" ? undefined : cuisine,
    isOpen: filters.openNow ? true : undefined,
    sortBy: sort,
    page,
    limit: 12,
  })

  const allRestaurants = React.useMemo(
    () => restaurantsData?.restaurants || [],
    [restaurantsData]
  )
  const totalCount = restaurantsData?.pagination.totalItems ?? 0
  const openCount = allRestaurants.filter((r) => r.isOpen).length
  const totalPages = restaurantsData?.pagination.totalPages ?? 1

  // Budget / rating / free-delivery filters run client-side — the
  // restaurants API only supports search, cuisine, isOpen and sort.
  const visibleRestaurants = React.useMemo(() => {
    let result = allRestaurants

    if (filters.freeDelivery) {
      result = result.filter((r) => Number(r.deliveryFee) === 0)
    }
    if (filters.priceMin !== PRICE_RANGE_MIN || filters.priceMax !== PRICE_RANGE_MAX) {
      result = result.filter(
        (r) => r.minOrder >= filters.priceMin && r.minOrder <= filters.priceMax
      )
    }
    if (filters.rating !== null) {
      result = result.filter((r) => Number(r.rating) >= filters.rating!)
    }

    return result
  }, [allRestaurants, filters])

  // Group the visible restaurants into sections by their category.
  const sections = React.useMemo(() => {
    const map = new Map<string, RestaurantListItem[]>()
    for (const r of visibleRestaurants) {
      const key = r.category?.trim() || "Other"
      const bucket = map.get(key)
      if (bucket) bucket.push(r)
      else map.set(key, [r])
    }
    return Array.from(map, ([category, items]) => ({ category, items }))
  }, [visibleRestaurants])

  const sidebarFilterCount =
    Number(filters.priceMin !== PRICE_RANGE_MIN || filters.priceMax !== PRICE_RANGE_MAX) +
    Number(filters.rating !== null) +
    Number(filters.openNow) +
    Number(filters.freeDelivery)

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleCuisineChange = (value: string) => {
    setCuisine(value)
    setPage(1)
  }

  const handleSortChange = (value: SortFilter) => {
    setSort(value)
    setPage(1)
  }

  const handleFilterChange = (updates: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates, type: "food" }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters(defaultFilters)
    setSearch("")
    setCuisine("all")
    setSort("popular")
    setPage(1)
  }

  const sidebarProps = {
    filters,
    onChange: handleFilterChange,
    onClearFilters: clearFilters,
    activeFilterCount: sidebarFilterCount,
    categoryOptions: [],
    conditionOptions: [],
    showType: false,
  }

  return (
    <main className="container mx-auto space-y-6 px-4 py-8">
      {/* Header + search at the top */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl font-bold text-foreground">Food Court</h1>
          <p className="text-muted-foreground">Order from your favorite campus spots</p>
          <p className="text-sm text-muted-foreground">
            {totalCount} restaurants · {openCount} open now
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search restaurants or dishes..."
              className="h-12 rounded-full bg-card pl-10"
            />
          </div>

          {/* Mobile filters trigger */}
          <div className="lg:hidden">
            <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="h-12 shrink-0 rounded-full border-2 border-vm-tangerine bg-card"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {sidebarFilterCount > 0 && (
                    <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-vm-tangerine text-[11px] font-bold text-vm-tangerine-foreground">
                      {sidebarFilterCount}
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
                    className="w-full rounded-full bg-vm-tangerine text-vm-tangerine-foreground hover:bg-vm-tangerine/90"
                    onClick={() => setIsMobileFiltersOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </section>

      <div className="flex gap-6">
        {/* Desktop sidebar — the products budget filter bar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <FilterSidebar {...sidebarProps} className="sticky top-20" />
        </aside>

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-6">
          {/* Cuisine pills + sort */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-bold text-foreground">Categories</h2>
              <Select value={sort} onValueChange={(value) => handleSortChange(value as SortFilter)}>
                <SelectTrigger className="h-10 w-40 shrink-0 rounded-md bg-card px-3">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {CUISINES.map((item) => (
                <CuisinePill
                  key={item.label}
                  label={item.label}
                  emoji={item.emoji}
                  active={cuisine === item.query}
                  onClick={() => handleCuisineChange(item.query)}
                />
              ))}
            </div>
          </div>

          {/* Category sections */}
          {isLoading ? (
            <SectionsSkeleton />
          ) : sections.length === 0 ? (
            <div className="rounded-md bg-card p-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <UtensilsCrossed className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                No restaurants match your filters
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try another cuisine or adjust your budget and filters.
              </p>
              <Button type="button" className="mt-4 rounded-lg" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {sections.map(({ category, items }) => (
                <section key={category} className="space-y-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="font-heading text-xl font-bold text-foreground">{category}</h2>
                    <p className="text-sm text-muted-foreground">
                      {items.length} {items.length === 1 ? "spot" : "spots"}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {items.map((restaurant) => (
                      <FeaturedRestaurantCard
                        key={restaurant.id}
                        restaurant={mapApiRestaurantToCard(restaurant)}
                      />
                    ))}
                  </div>
                </section>
              ))}

              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-lg"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4 text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-lg"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <section className="rounded-md bg-card px-6 py-8">
        <div className="mx-auto max-w-3xl space-y-3 text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Run a food spot on campus? Join the Food Court
          </h2>
          <p className="text-muted-foreground">
            Reach hungry students, manage orders in real time, and grow your kitchen
            with VarsityMart.
          </p>
          <Button className="rounded-lg bg-vm-tangerine text-vm-tangerine-foreground hover:bg-vm-tangerine/90">
            Apply as Vendor →
          </Button>
        </div>
      </section>
    </main>
  )
}
