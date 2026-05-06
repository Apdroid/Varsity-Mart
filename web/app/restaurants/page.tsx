"use client"

import * as React from "react"
import {
  Search,
  SlidersHorizontal,
  UtensilsCrossed,
  X,
} from "lucide-react"

import { RestaurantCard, type Restaurant } from "@/components/main/restaurant-card"
import { CuisinePill } from "@/components/restaurants/cuisine-pill"
import { FeaturedRestaurantCard } from "@/components/restaurants/featured-restaurant-card"
import { OrderAgainCard } from "@/components/restaurants/order-again-card"
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
import { mockRestaurants } from "@/data/restaurant"

type StatusFilter = "all" | "open-now" | "free-delivery"
type PriceFilter = "all" | "$" | "$$" | "$$$"
type SortFilter =
  | "recommended"
  | "fastest-delivery"
  | "top-rated"
  | "lowest-min-order"

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

function toNumber(value: string) {
  const parsed = Number.parseFloat(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

function minDeliveryMinutes(deliveryTime: string) {
  const match = deliveryTime.match(/\d+/)
  return match ? Number.parseInt(match[0], 10) : Number.POSITIVE_INFINITY
}

function isFreeDelivery(fee: string) {
  return fee === "0"
}

function matchesPriceRange(minOrder: number, priceFilter: PriceFilter) {
  if (priceFilter === "all") return true
  if (priceFilter === "$") return minOrder <= 25
  if (priceFilter === "$$") return minOrder >= 26 && minOrder <= 60
  return minOrder > 60
}

export default function RestaurantsPage() {
  const [search, setSearch] = React.useState("")
  const [cuisine, setCuisine] = React.useState<string>("all")
  const [status, setStatus] = React.useState<StatusFilter>("all")
  const [sort, setSort] = React.useState<SortFilter>("recommended")
  const [price, setPrice] = React.useState<PriceFilter>("all")
  const [visibleCount, setVisibleCount] = React.useState(8)
  const [filtersOpen, setFiltersOpen] = React.useState(false)
  const [showPromo, setShowPromo] = React.useState(true)

  const nowOpenFeatured = React.useMemo(
    () =>
      mockRestaurants
        .filter((restaurant) => restaurant.isOpen)
        .sort((a, b) => toNumber(b.rating) - toNumber(a.rating))
        .slice(0, 3),
    []
  )

  const orderAgainRestaurants = React.useMemo(
    () => mockRestaurants.slice(0, 4),
    []
  )

  const filteredRestaurants = React.useMemo(() => {
    const filtered = mockRestaurants.filter((restaurant) => {
      const lowerCategory = restaurant.category.toLowerCase()
      const lowerSearch = search.toLowerCase()

      const matchesCuisine =
        cuisine === "all" || lowerCategory.includes(cuisine.toLowerCase())
      const matchesSearch =
        search.trim().length === 0 ||
        `${restaurant.name} ${restaurant.category}`
          .toLowerCase()
          .includes(lowerSearch)
      const matchesStatus =
        status === "all" ||
        (status === "open-now" && restaurant.isOpen) ||
        (status === "free-delivery" && isFreeDelivery(restaurant.deliveryFee))
      const matchesPrice = matchesPriceRange(restaurant.minOrder, price)

      return matchesCuisine && matchesSearch && matchesStatus && matchesPrice
    })

    const sorted = [...filtered]
    sorted.sort((a, b) => {
      if (a.isOpen !== b.isOpen) return a.isOpen ? -1 : 1

      if (sort === "fastest-delivery") {
        return minDeliveryMinutes(a.deliveryTime) - minDeliveryMinutes(b.deliveryTime)
      }
      if (sort === "top-rated") {
        const byRating = toNumber(b.rating) - toNumber(a.rating)
        if (byRating !== 0) return byRating
        return b.totalReviews - a.totalReviews
      }
      if (sort === "lowest-min-order") return a.minOrder - b.minOrder

      const recommendedA = toNumber(a.rating) * (a.totalReviews + 1)
      const recommendedB = toNumber(b.rating) * (b.totalReviews + 1)
      return recommendedB - recommendedA
    })

    return sorted
  }, [cuisine, price, search, sort, status])

  const visibleRestaurants = filteredRestaurants.slice(0, visibleCount)
  const hasMore = filteredRestaurants.length > visibleCount

  const activeFilterCount =
    Number(search.trim().length > 0) +
    Number(cuisine !== "all") +
    Number(status !== "all") +
    Number(price !== "all") +
    Number(sort !== "recommended")

  const resetVisible = () => setVisibleCount(8)

  const handleSearchChange = (value: string) => {
    setSearch(value)
    resetVisible()
  }

  const handleCuisineChange = (value: string) => {
    setCuisine(value)
    resetVisible()
  }

  const handleStatusChange = (value: StatusFilter) => {
    setStatus(value)
    resetVisible()
  }

  const handleSortChange = (value: SortFilter) => {
    setSort(value)
    resetVisible()
  }

  const handlePriceChange = (value: PriceFilter) => {
    setPrice(value)
    resetVisible()
  }

  const clearFilters = () => {
    setSearch("")
    setCuisine("all")
    setStatus("all")
    setSort("recommended")
    setPrice("all")
    setVisibleCount(8)
  }

  return (
    <main className="container mx-auto space-y-6 px-4 py-8">
      <section className="space-y-2">
        <h1 className="font-heading text-3xl font-bold text-foreground">Food Court</h1>
        <p className="text-muted-foreground">Order from your favorite campus spots</p>
        <p className="text-sm text-muted-foreground">47 restaurants · 12 open now</p>
      </section>


      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-foreground">Now Open</h2>
          <Badge variant="outline" className="text-muted-foreground">
            Top picks
          </Badge>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {nowOpenFeatured.map((restaurant) => (
            <FeaturedRestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>

      <section className=" top-16 z-20 space-y-3 rounded-lg p-3 backdrop-blur-sm">
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
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="fastest-delivery">Fastest Delivery</SelectItem>
              <SelectItem value="top-rated">Top Rated</SelectItem>
              <SelectItem value="lowest-min-order">Lowest Min Order</SelectItem>
            </SelectContent>
          </Select>

          <Select value={price} onValueChange={(value) => handlePriceChange(value as PriceFilter)}>
            <SelectTrigger className="h-10 w-28 rounded-md bg-card px-3">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="$">$</SelectItem>
              <SelectItem value="$$">$$</SelectItem>
              <SelectItem value="$$$">$$$</SelectItem>
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
                  onValueChange={(value) =>
                    value && handleStatusChange(value as StatusFilter)
                  }
                  variant="outline"
                  className="w-full"
                >
                  <ToggleGroupItem value="all" className="flex-1">
                    All
                  </ToggleGroupItem>
                  <ToggleGroupItem value="open-now" className="flex-1">
                    Open Now
                  </ToggleGroupItem>
                  <ToggleGroupItem value="free-delivery" className="flex-1">
                    Free Delivery
                  </ToggleGroupItem>
                </ToggleGroup>

                <Select value={sort} onValueChange={(value) => handleSortChange(value as SortFilter)}>
                  <SelectTrigger className="h-10 w-full rounded-lg bg-muted px-3">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="fastest-delivery">Fastest Delivery</SelectItem>
                    <SelectItem value="top-rated">Top Rated</SelectItem>
                    <SelectItem value="lowest-min-order">Lowest Min Order</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={price} onValueChange={(value) => handlePriceChange(value as PriceFilter)}>
                  <SelectTrigger className="h-10 w-full rounded-lg bg-muted px-3">
                    <SelectValue placeholder="Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="$">$</SelectItem>
                    <SelectItem value="$$">$$</SelectItem>
                    <SelectItem value="$$$">$$$</SelectItem>
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

      {orderAgainRestaurants.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-md font-bold text-foreground">Order again</h2>
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {orderAgainRestaurants.map((restaurant) => (
              <OrderAgainCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-foreground">All Restaurants</h2>
          <p className="text-sm text-muted-foreground">{filteredRestaurants.length} results</p>
        </div>

        {filteredRestaurants.length === 0 ? (
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
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleRestaurants.map((restaurant: Restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-lg"
                  onClick={() => setVisibleCount((count) => count + 8)}
                >
                  Load more
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
