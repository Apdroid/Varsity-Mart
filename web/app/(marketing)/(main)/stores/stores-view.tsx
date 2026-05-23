"use client"

import * as React from "react"
import { LayoutGrid, List, SlidersHorizontal, Store } from "lucide-react"

import { StoreCard } from "@/components/main/stores-card"
import { CategoryPill } from "@/components/stores/category-pill"
import { FeaturedStoreCard } from "@/components/stores/featured-store-card"
import MagnifierIcon from "@/components/ui/magnifier-icon"
import { Badge } from "@/components/ui/badge"
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
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import { useStores, useFeaturedStores } from "@/hooks/queries/use-stores"
import { useStoreCategories } from "@/hooks/queries/use-categories"
import type { StoreListItem } from "@/lib/api/types"

type StatusFilter = "all" | "open" | "closed"
type SortFilter = "popular" | "newest"
type ViewMode = "grid" | "list"

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

function StoreSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-32 w-full rounded-lg" />
      ))}
    </div>
  )
}

function FeaturedSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-48 w-full rounded-lg" />
      ))}
    </div>
  )
}

export function StoresView() {
  const [search, setSearch] = React.useState("")
  const [category, setCategory] = React.useState("all")
  const [status, setStatus] = React.useState<StatusFilter>("all")
  const [sort, setSort] = React.useState<SortFilter>("popular")
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid")
  const [page, setPage] = React.useState(1)
  const [filtersOpen, setFiltersOpen] = React.useState(false)

  const { data: featuredData, isLoading: featuredLoading } = useFeaturedStores(3)
  const { data: storesData, isLoading: storesLoading } = useStores({
    search: search || undefined,
    category: category === "all" ? undefined : category,
    sortBy: sort,
    page,
    limit: 12,
  })
  const { data: categoriesData } = useStoreCategories()

  const featuredStores = featuredData || []
  const allStores = storesData?.stores || []
  const categories = categoriesData || []
  const totalCount = storesData?.pagination.totalItems ?? 0
  const totalPages = storesData?.pagination.totalPages ?? 1

  const filteredStores = React.useMemo(() => {
    if (status === "all") return allStores
    return allStores.filter((store) =>
      status === "open" ? store.isOpen : !store.isOpen
    )
  }, [allStores, status])

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    setPage(1)
  }

  const handleStatusChange = (value: StatusFilter) => {
    setStatus(value)
    setPage(1)
  }

  const handleSortChange = (value: SortFilter) => {
    setSort(value)
    setPage(1)
  }

  const clearFilters = () => {
    setSearch("")
    setCategory("all")
    setStatus("all")
    setSort("popular")
    setPage(1)
  }

  return (
    <main className="container mx-auto space-y-8 px-4 py-8">
      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <h1 className="font-heading text-3xl font-bold text-foreground">Campus Stores</h1>
          <Badge variant="outline" className="text-muted-foreground">
            {totalCount} stores
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Discover verified vendors across campus
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-heading text-xl font-bold text-foreground">Featured Stores</h2>
        </div>
        {featuredLoading ? (
          <FeaturedSkeleton />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredStores.map((store) => (
              <FeaturedStoreCard key={store.id} store={mapApiStoreToCard(store)} />
            ))}
          </div>
        )}
      </section>

      <section className=" top-16 z-20 rounded-lg p-3 backdrop-blur-sm">
        <div className="hidden items-center gap-2 md:flex">
          <div className="relative min-w-0 flex-1">
            <MagnifierIcon
              size={16}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 cursor-default text-muted-foreground"
            />
            <Input
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search stores..."
              className="rounded-full bg-inherit px-9 py-6"
            />
          </div>
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="px-9 py-6 rounded-lg bg-card">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(value) => handleStatusChange(value as StatusFilter)}>
            <SelectTrigger className="px-9 py-6 rounded-lg bg-card">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="open">Open Now</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(value) => handleSortChange(value as SortFilter)}>
            <SelectTrigger className="px-9 py-6 rounded-lg bg-card">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value) => {
              if (value) setViewMode(value as ViewMode)
            }}
            variant="outline"
            className="ml-auto border border-border outline-1 ring-1 ring-muted"
          >
            <ToggleGroupItem value="grid" aria-label="Grid view" className="px-8 py-6">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view" className="px-8 py-6">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <div className="relative min-w-0 flex-1">
            <MagnifierIcon
              size={16}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 cursor-default text-muted-foreground"
            />
            <Input
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search stores..."
              className="rounded-md bg-muted pl-9"
            />
          </div>
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-md bg-muted">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="sr-only">Open filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-lg bg-card">
              <SheetHeader>
                <SheetTitle>Filter stores</SheetTitle>
                <SheetDescription>Refine stores by category, status, and sort.</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 p-4 pt-0">
                <Select value={category} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="h-9 w-full rounded-md bg-muted">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={status}
                  onValueChange={(value) => handleStatusChange(value as StatusFilter)}
                >
                  <SelectTrigger className="h-9 w-full rounded-md bg-muted">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="open">Open Now</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sort} onValueChange={(value) => handleSortChange(value as SortFilter)}>
                  <SelectTrigger className="h-9 w-full rounded-md bg-muted">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
                <ToggleGroup
                  type="single"
                  value={viewMode}
                  onValueChange={(value) => {
                    if (value) setViewMode(value as ViewMode)
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <ToggleGroupItem value="grid" aria-label="Grid view" className="flex-1">
                    <LayoutGrid className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="list" aria-label="List view" className="flex-1">
                    <List className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-md"
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
                <Button
                  type="button"
                  className="w-full rounded-md bg-vm-tangerine text-vm-tangerine-foreground hover:bg-vm-tangerine/90"
                  onClick={() => setFiltersOpen(false)}
                >
                  Apply
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-xl font-bold text-foreground">Browse by Category</h2>
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <CategoryPill
            label="All"
            active={category === "all"}
            onClick={() => handleCategoryChange("all")}
          />
          {categories.map((cat) => (
            <CategoryPill
              key={cat.id}
              label={cat.name}
              active={category === cat.id}
              onClick={() => handleCategoryChange(cat.id)}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-foreground">All Stores</h2>
          <p className="text-sm text-muted-foreground">{filteredStores.length} results</p>
        </div>

        {storesLoading ? (
          <StoreSkeleton />
        ) : filteredStores.length === 0 ? (
          <div className="rounded-lg bg-card p-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Store className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No stores match your filters</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search terms or selected filters.
            </p>
            <Button
              type="button"
              variant="default"
              className="mt-4 rounded-md"
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            <div
              className={cn(
                "grid gap-3",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              )}
            >
              {filteredStores.map((store) => (
                <StoreCard key={store.id} store={mapApiStoreToCard(store)} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-md"
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
                  className="rounded-md"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      <section className="rounded-lg bg-card px-6 py-8">
        <div className="mx-auto max-w-3xl space-y-3 text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Run a hustle on campus? Sell on VarsityMart
          </h2>
          <p className="text-muted-foreground">
            Reach verified student buyers, manage inventory from your phone, and grow your
            store within the campus community.
          </p>
          <Button className="rounded-md bg-vm-tangerine text-vm-tangerine-foreground hover:bg-vm-tangerine/90">
            Start Selling →
          </Button>
        </div>
      </section>
    </main>
  )
}
