"use client"

import * as React from "react"
import { LayoutGrid, List, Search, SlidersHorizontal, Store } from "lucide-react"

import { StoreCard } from "@/components/main/stores-card"
import { CategoryPill } from "@/components/stores/category-pill"
import { FeaturedStoreCard } from "@/components/stores/featured-store-card"
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { mockStores } from "@/data/store"
import { cn } from "@/lib/utils"

type StatusFilter = "all" | "open" | "closed"
type SortFilter = "most-popular" | "highest-rated" | "most-products" | "newest"
type ViewMode = "grid" | "list"

function normalizeCategory(category: string) {
  const value = category.toLowerCase()
  if (
    value.includes("electronics") ||
    value.includes("phone") ||
    value.includes("laptop")
  ) {
    return "Electronics"
  }
  if (
    value.includes("fashion") ||
    value.includes("sneaker") ||
    value.includes("streetwear")
  ) {
    return "Fashion"
  }
  if (value.includes("snack") || value.includes("drink")) return "Food"
  if (value.includes("book")) return "Books"
  if (value.includes("beauty")) return "Beauty"
  if (value.includes("hostel") || value.includes("home")) return "Hostel Supplies"
  if (value.includes("print") || value.includes("stationery")) return "Printing"
  if (value.includes("gift") || value.includes("souvenir")) return "Gifts"
  if (value.includes("sport") || value.includes("fitness")) return "Sports"
  return category
}

function toNumber(value: string) {
  const parsed = Number.parseFloat(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

const CATEGORY_PRIORITY = [
  "Electronics",
  "Fashion",
  "Food",
  "Books",
  "Beauty",
  "Hostel Supplies",
]

export default function StoresPage() {
  const [search, setSearch] = React.useState("")
  const [category, setCategory] = React.useState("all")
  const [status, setStatus] = React.useState<StatusFilter>("all")
  const [sort, setSort] = React.useState<SortFilter>("most-popular")
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid")
  const [visibleCount, setVisibleCount] = React.useState(6)
  const [filtersOpen, setFiltersOpen] = React.useState(false)

  const featuredStores = React.useMemo(() => {
    return [...mockStores]
      .sort((a, b) => toNumber(b.rating) * b.totalProducts - toNumber(a.rating) * a.totalProducts)
      .slice(0, 3)
  }, [])

  const categoryCounts = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const store of mockStores) {
      const key = normalizeCategory(store.category)
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
    return counts
  }, [])

  const categories = React.useMemo(() => {
    const all = Array.from(categoryCounts.keys())
    return all.sort((a, b) => {
      const aIndex = CATEGORY_PRIORITY.indexOf(a)
      const bIndex = CATEGORY_PRIORITY.indexOf(b)
      const aRank = aIndex === -1 ? Number.POSITIVE_INFINITY : aIndex
      const bRank = bIndex === -1 ? Number.POSITIVE_INFINITY : bIndex
      if (aRank === bRank) return a.localeCompare(b)
      return aRank - bRank
    })
  }, [categoryCounts])

  const filteredStores = React.useMemo(() => {
    const filtered = mockStores.filter((store) => {
      const normalized = normalizeCategory(store.category)
      const searchHaystack = `${store.name} ${store.category} ${normalized}`.toLowerCase()
      const matchesSearch = search.trim().length === 0 || searchHaystack.includes(search.toLowerCase())
      const matchesCategory = category === "all" || normalized === category
      const matchesStatus =
        status === "all" || (status === "open" ? store.isOpen : !store.isOpen)
      return matchesSearch && matchesCategory && matchesStatus
    })

    const sorted = [...filtered]
    sorted.sort((a, b) => {
      if (sort === "most-popular") return b.totalReviews - a.totalReviews
      if (sort === "highest-rated") {
        const ratingDiff = toNumber(b.rating) - toNumber(a.rating)
        if (ratingDiff !== 0) return ratingDiff
        return b.totalReviews - a.totalReviews
      }
      if (sort === "most-products") return b.totalProducts - a.totalProducts
      return b.id.localeCompare(a.id)
    })
    return sorted
  }, [category, search, sort, status])

  const visibleStores = filteredStores.slice(0, visibleCount)
  const hasMore = filteredStores.length > visibleCount

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setVisibleCount(6)
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    setVisibleCount(6)
  }

  const handleStatusChange = (value: StatusFilter) => {
    setStatus(value)
    setVisibleCount(6)
  }

  const handleSortChange = (value: SortFilter) => {
    setSort(value)
    setVisibleCount(6)
  }

  const clearFilters = () => {
    setSearch("")
    setCategory("all")
    setStatus("all")
    setSort("most-popular")
    setVisibleCount(6)
  }

  return (
    <main className="container mx-auto space-y-8 px-4 py-8">
      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <h1 className="font-heading text-3xl font-bold text-foreground">Campus Stores</h1>
          <Badge variant="outline" className="text-muted-foreground">
            248 stores
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Discover verified vendors across KNUST campus
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-heading text-xl font-bold text-foreground">Featured Stores</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featuredStores.map((store) => (
            <FeaturedStoreCard key={store.id} store={store} />
          ))}
        </div>
      </section>

      <section className="sticky top-16 z-20 rounded-lg  bg-card/95 p-3 backdrop-blur-sm">
        <div className="hidden items-center gap-2 md:flex">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search stores..."
              className="rounded-lg bg-card pl-9"
            />
          </div>
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="h-9 w-[170px] rounded-md bg-card">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(value) => handleStatusChange(value as StatusFilter)}>
            <SelectTrigger className="h-9 w-35 rounded-md bg-card">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="open">Open Now</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(value) => handleSortChange(value as SortFilter)}>
            <SelectTrigger className="h-9 w-42.5 rounded-md bg-card">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="most-popular">Most Popular</SelectItem>
              <SelectItem value="highest-rated">Highest Rated</SelectItem>
              <SelectItem value="most-products">Most Products</SelectItem>
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
            className="ml-auto"
          >
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
            <SheetContent side="bottom" className="rounded-t-lg  bg-card">
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
                    {categories.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
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
                    <SelectItem value="most-popular">Most Popular</SelectItem>
                    <SelectItem value="highest-rated">Highest Rated</SelectItem>
                    <SelectItem value="most-products">Most Products</SelectItem>
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
          {categories.map((item) => (
            <CategoryPill
              key={item}
              label={item}
              active={category === item}
              onClick={() => handleCategoryChange(item)}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-foreground">All Stores</h2>
          <p className="text-sm text-muted-foreground">{filteredStores.length} results</p>
        </div>

        {filteredStores.length === 0 ? (
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
              {visibleStores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-md"
                  onClick={() => setVisibleCount((current) => current + 6)}
                >
                  Load more
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
