"use client"

import * as React from "react"
import {
  Search,
  SlidersHorizontal,
  UtensilsCrossed,
} from "lucide-react"

import { RestaurantCard } from "@/components/main/restaurant-card"
import { CuisinePill } from "@/components/restaurants/cuisine-pill"
import { FeaturedRestaurantCard } from "@/components/restaurants/featured-restaurant-card"
import { Badge } from "@/components/ui/badge"
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
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useRestaurants, useFeaturedRestaurants } from "@/hooks/queries/use-restaurants"
import type { RestaurantListItem } from "@/lib/api/types"

type StatusFilter = "all" | "open-now" | "free-delivery"
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

function RestaurantsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-52 w-full rounded-lg" />
      ))}
    </div>
  )
}

function FeaturedSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-48 w-full rounded-lg" />
      ))}
    </div>
  )
}

export function RestaurantsView() {
  const [search, setSearch] = React.useState("")
  const [cuisine, setCuisine] = React.useState<string>("all")
  const [status, setStatus] = React.useState<StatusFilter>("all")
  const [sort, setSort] = React.useState<SortFilter>("popular")
  const [page, setPage] = React.useState(1)
  const [filtersOpen, setFiltersOpen] = React.useState(false)

  const { data: featuredData, isLoading: featuredLoading } = useFeaturedRestaurants(3)
  const { data: restaurantsData, isLoading: restaurantsLoading } = useRestaurants({
    search: search || undefined,
    cuisineType: cuisine === "all" ? undefined : cuisine,
    isOpen: status === "open-now" ? true : undefined,
    sortBy: sort,
    page,
    limit: 12,
  })

  const featuredRestaurants = featuredData || []
  const allRestaurants = restaurantsData?.restaurants || []
  const totalCount = restaurantsData?.pagination.totalItems ?? 0
  const openCount = allRestaurants.filter((r) => r.isOpen).length
  const totalPages = restaurantsData?.pagination.totalPages ?? 1

  const filteredRestaurants = React.useMemo(() => {
    let result = allRestaurants

    if (status === "free-delivery") {
      result = result.filter((r) => Number(r.deliveryFee) === 0)
    }

    return result
  }, [allRestaurants, status])

  const activeFilterCount =
    Number(search.trim().length > 0) +
    Number(cuisine !== "all") +
    Number(status !== "all") +
    Number(sort !== "popular")

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleCuisineChange = (value: string) => {
    setCuisine(value)
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
    setCuisine("all")
    setStatus("all")
    setSort("popular")
    setPage(1)
  }

  return (
    <main className="container mx-auto space-y-6 px-4 py-8">
      <section className="space-y-2">
        <h1 className="font-heading text-3xl font-bold text-foreground">Food Court</h1>
        <p className="text-muted-foreground">Order from your favorite campus spots</p>
        <p className="text-sm text-muted-foreground">
          {totalCount} restaurants · {openCount} open now
        </p>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-foreground">Now Open</h2>
          <Badge variant="outline" className="text-muted-foreground">
            Top picks
          </Badge>
        </div>
        {featuredLoading ? (
          <FeaturedSkeleton />
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {featuredRestaurants.map((restaurant) => (
              <FeaturedRestaurantCard
                key={restaurant.id}
                restaurant={mapApiRestaurantToCard(restaurant)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="top-16 z-20 space-y-3 rounded-lg p-3 backdrop-blur-sm">
        <div className="hidden items-center gap-2 md:flex">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search restaurants or dishes..."
              className="h-10 rounded-full bg-card p-6 pl-10"
            />
          </div>

          <ToggleGroup
            type="single"
            value={status}
            onValueChange={(value) => value && handleStatusChange(value as StatusFilter)}
            variant="outline"
            className="bg-card"
          >
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            <ToggleGroupItem value="open-now">Open Now</ToggleGroupItem>
            <ToggleGroupItem value="free-delivery">Free Delivery</ToggleGroupItem>
          </ToggleGroup>

          <Select value={sort} onValueChange={(value) => handleSortChange(value as SortFilter)}>
            <SelectTrigger className="h-10 w-44 rounded-md bg-card px-3">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <section className="my-6 space-y-3">
          <h2 className="font-bold">Categories</h2>
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
        </section>

        <div className="flex items-center gap-2 md:hidden">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search restaurants or dishes..."
              className="h-10 rounded-md bg-muted px-4 pl-10"
            />
          </div>

          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="rounded-lg bg-muted">
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters ({activeFilterCount})</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-lg bg-card">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Refine food spots and delivery options.</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 p-4 pt-0">
                <ToggleGroup
                  type="single"
                  value={status}
                  onValueChange={(value) => value && handleStatusChange(value as StatusFilter)}
                  variant="outline"
                  className="w-full"
                >
                  <ToggleGroupItem value="all" className="flex-1">All</ToggleGroupItem>
                  <ToggleGroupItem value="open-now" className="flex-1">Open Now</ToggleGroupItem>
                  <ToggleGroupItem value="free-delivery" className="flex-1">Free Delivery</ToggleGroupItem>
                </ToggleGroup>

                <Select value={sort} onValueChange={(value) => handleSortChange(value as SortFilter)}>
                  <SelectTrigger className="h-10 w-full rounded-lg bg-muted px-3">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Popular</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>

                <Button type="button" variant="outline" className="w-full rounded-lg" onClick={clearFilters}>
                  Clear filters
                </Button>
                <Button
                  type="button"
                  className="w-full rounded-lg bg-vm-tangerine text-vm-tangerine-foreground hover:bg-vm-tangerine/90"
                  onClick={() => setFiltersOpen(false)}
                >
                  Apply
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-foreground">All Restaurants</h2>
          <p className="text-sm text-muted-foreground">{filteredRestaurants.length} results</p>
        </div>

        {restaurantsLoading ? (
          <RestaurantsSkeleton />
        ) : filteredRestaurants.length === 0 ? (
          <div className="rounded-md bg-card p-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <UtensilsCrossed className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              No restaurants match your filters
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try another cuisine or adjust filter settings.
            </p>
            <Button
              type="button"
              variant="default"
              className="mt-4 rounded-lg"
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={mapApiRestaurantToCard(restaurant)}
                />
              ))}
            </div>
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
          </>
        )}
      </section>

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
