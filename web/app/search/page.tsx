"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  Search,
  X,
  SlidersHorizontal,
} from "lucide-react"

import { ProductCard } from "@/components/main/product-card"
import { RestaurantCard } from "@/components/main/restaurant-card"
import { StoreCard } from "@/components/main/stores-card"
import {
  FilterSidebar,
  SearchFilters,
  SearchTab,
} from "@/components/search/filter-sidebar"
import { ResultStatCard } from "@/components/search/result-stat-card"
import { SearchEmptyState } from "@/components/search/search-empty-state"
import { SearchNoResults } from "@/components/search/search-no-results"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockProducts } from "@/data/product"
import { mockRestaurants } from "@/data/restaurant"
import { mockStores } from "@/data/store"

type SortOption =
  | "relevant"
  | "newest"
  | "highest-rated"
  | "price-low-high"
  | "price-high-low"

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

const defaultFilters: SearchFilters = {
  minPrice: "",
  maxPrice: "",
  location: "all",
  productCategory: "all",
  productCondition: "all",
  productBadge: "all",
  productNight: false,
  restaurantCuisine: "all",
  restaurantOpen: false,
  restaurantFreeDelivery: false,
  restaurantMaxDelivery: "all",
  storeCategory: "all",
  storeOpen: false,
  storeMinProducts: "all",
}

function normalizeTab(tab: string | null): SearchTab {
  if (tab === "products" || tab === "restaurants" || tab === "stores") return tab
  return "all"
}

function normalizeSort(sort: string | null): SortOption {
  if (
    sort === "newest" ||
    sort === "highest-rated" ||
    sort === "price-low-high" ||
    sort === "price-high-low"
  ) {
    return sort
  }
  return "relevant"
}

function parseDeliveryMin(deliveryTime: string) {
  const match = deliveryTime.match(/\d+/)
  return match ? Number.parseInt(match[0], 10) : Number.POSITIVE_INFINITY
}

function toNumber(value: string) {
  const parsed = Number.parseFloat(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

function parseState(params: URLSearchParams) {
  return {
    query: params.get("q") ?? "",
    tab: normalizeTab(params.get("type")),
    sort: normalizeSort(params.get("sort")),
    filters: {
      minPrice: params.get("minPrice") ?? "",
      maxPrice: params.get("maxPrice") ?? "",
      location: params.get("location") ?? "all",
      productCategory: params.get("pCategory") ?? "all",
      productCondition: params.get("pCondition") ?? "all",
      productBadge: params.get("pBadge") ?? "all",
      productNight: params.get("pNight") === "1",
      restaurantCuisine: params.get("rCuisine") ?? "all",
      restaurantOpen: params.get("rOpen") === "1",
      restaurantFreeDelivery: params.get("rFree") === "1",
      restaurantMaxDelivery: params.get("rMax") ?? "all",
      storeCategory: params.get("sCategory") ?? "all",
      storeOpen: params.get("sOpen") === "1",
      storeMinProducts: params.get("sMinProducts") ?? "all",
    } satisfies SearchFilters,
  }
}

function scoreMatch(value: string, query: string) {
  if (!query) return 0
  return value.includes(query) ? 1 : 0
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
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  const initial = parseState(new URLSearchParams(searchParams.toString()))

  const [query, setQuery] = React.useState(initial.query)
  const [activeTab, setActiveTab] = React.useState<SearchTab>(initial.tab)
  const [sort, setSort] = React.useState<SortOption>(initial.sort)
  const [filters, setFilters] = React.useState<SearchFilters>(initial.filters)
  const [isInputFocused, setIsInputFocused] = React.useState(false)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = React.useState(false)
  const [recentSearches, setRecentSearches] = React.useState<string[]>(() => {
    if (typeof window === "undefined") return DEFAULT_RECENT_SEARCHES
    try {
      const stored = window.localStorage.getItem(RECENT_SEARCHES_KEY)
      if (!stored) return DEFAULT_RECENT_SEARCHES
      const parsed = JSON.parse(stored) as string[]
      if (Array.isArray(parsed) && parsed.length > 0) return parsed.slice(0, 5)
      return DEFAULT_RECENT_SEARCHES
    } catch {
      return DEFAULT_RECENT_SEARCHES
    }
  })
  const [debouncedQuery, setDebouncedQuery] = React.useState(query.trim())

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      const nextQuery = query.trim()
      setDebouncedQuery(nextQuery)
      if (nextQuery) {
        setRecentSearches((current) => {
          const next = [nextQuery, ...current.filter((item) => item !== nextQuery)]
          return next.slice(0, 5)
        })
      }
    }, 200)
    return () => window.clearTimeout(timer)
  }, [query])

  React.useEffect(() => {
    try {
      window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches.slice(0, 5)))
    } catch {}
  }, [recentSearches])

  const isDebouncing = query.trim() !== debouncedQuery

  const serializedParams = React.useMemo(() => {
    const params = new URLSearchParams()
    if (query.trim()) params.set("q", query.trim())
    if (activeTab !== "all") params.set("type", activeTab)
    if (sort !== "relevant") params.set("sort", sort)

    if (filters.minPrice) params.set("minPrice", filters.minPrice)
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice)
    if (filters.location !== "all") params.set("location", filters.location)

    if (filters.productCategory !== "all") params.set("pCategory", filters.productCategory)
    if (filters.productCondition !== "all") params.set("pCondition", filters.productCondition)
    if (filters.productBadge !== "all") params.set("pBadge", filters.productBadge)
    if (filters.productNight) params.set("pNight", "1")

    if (filters.restaurantCuisine !== "all") params.set("rCuisine", filters.restaurantCuisine)
    if (filters.restaurantOpen) params.set("rOpen", "1")
    if (filters.restaurantFreeDelivery) params.set("rFree", "1")
    if (filters.restaurantMaxDelivery !== "all") params.set("rMax", filters.restaurantMaxDelivery)

    if (filters.storeCategory !== "all") params.set("sCategory", filters.storeCategory)
    if (filters.storeOpen) params.set("sOpen", "1")
    if (filters.storeMinProducts !== "all") params.set("sMinProducts", filters.storeMinProducts)

    return params.toString()
  }, [query, activeTab, sort, filters])

  React.useEffect(() => {
    const current = searchParams.toString()
    if (serializedParams === current) return
    const target = serializedParams ? `${pathname}?${serializedParams}` : pathname
    router.replace(target, { scroll: false })
  }, [serializedParams, pathname, router, searchParams])

  const hasQuery = debouncedQuery.length > 0
  const queryLower = debouncedQuery.toLowerCase()
  const minPrice = filters.minPrice ? Number.parseFloat(filters.minPrice) : null
  const maxPrice = filters.maxPrice ? Number.parseFloat(filters.maxPrice) : null
  const locationLower = filters.location.toLowerCase()

  const products = React.useMemo(() => {
    if (!hasQuery) return []
    return mockProducts.filter((product) => {
      const haystack = [
        product.title,
        product.description,
        product.category.name,
        product.badges,
        product.location,
        product.seller.name,
      ]
        .join(" ")
        .toLowerCase()

      if (!haystack.includes(queryLower)) return false

      const price = toNumber(product.price)
      if (minPrice !== null && price < minPrice) return false
      if (maxPrice !== null && price > maxPrice) return false
      if (filters.location !== "all" && !product.location.toLowerCase().includes(locationLower)) return false

      if (activeTab === "products") {
        if (filters.productCategory !== "all" && product.category.name !== filters.productCategory) return false
        if (filters.productCondition !== "all" && product.condition !== filters.productCondition) return false
        if (
          filters.productBadge !== "all" &&
          !product.badges.toLowerCase().includes(filters.productBadge.toLowerCase())
        ) {
          return false
        }
        if (filters.productNight && !product.isNightShop) return false
      }

      return true
    })
  }, [activeTab, filters, hasQuery, locationLower, maxPrice, minPrice, queryLower])

  const restaurants = React.useMemo(() => {
    if (!hasQuery) return []
    return mockRestaurants.filter((restaurant) => {
      const haystack = `${restaurant.name} ${restaurant.category}`.toLowerCase()
      if (!haystack.includes(queryLower)) return false

      if (minPrice !== null && restaurant.minOrder < minPrice) return false
      if (maxPrice !== null && restaurant.minOrder > maxPrice) return false

      if (activeTab === "restaurants") {
        if (
          filters.restaurantCuisine !== "all" &&
          !restaurant.category.toLowerCase().includes(filters.restaurantCuisine.toLowerCase())
        ) {
          return false
        }
        if (filters.restaurantOpen && !restaurant.isOpen) return false
        if (filters.restaurantFreeDelivery && restaurant.deliveryFee !== "0") return false
        if (
          filters.restaurantMaxDelivery !== "all" &&
          parseDeliveryMin(restaurant.deliveryTime) > Number.parseInt(filters.restaurantMaxDelivery, 10)
        ) {
          return false
        }
      }

      return true
    })
  }, [activeTab, filters, hasQuery, maxPrice, minPrice, queryLower])

  const stores = React.useMemo(() => {
    if (!hasQuery) return []
    return mockStores.filter((store) => {
      const haystack = `${store.name} ${store.category}`.toLowerCase()
      if (!haystack.includes(queryLower)) return false

      if (activeTab === "stores") {
        if (filters.storeCategory !== "all" && store.category !== filters.storeCategory) return false
        if (filters.storeOpen && !store.isOpen) return false
        if (
          filters.storeMinProducts !== "all" &&
          store.totalProducts < Number.parseInt(filters.storeMinProducts, 10)
        ) {
          return false
        }
      }

      return true
    })
  }, [activeTab, filters, hasQuery, queryLower])

  const productRelevance = React.useCallback(
    (item: (typeof products)[number]) => {
      return (
        scoreMatch(item.title.toLowerCase(), queryLower) * 4 +
        scoreMatch(item.description.toLowerCase(), queryLower) * 2 +
        scoreMatch(item.category.name.toLowerCase(), queryLower) +
        scoreMatch(item.seller.name.toLowerCase(), queryLower)
      )
    },
    [queryLower]
  )

  const restaurantRelevance = React.useCallback(
    (item: (typeof restaurants)[number]) => {
      return scoreMatch(item.name.toLowerCase(), queryLower) * 3 + scoreMatch(item.category.toLowerCase(), queryLower)
    },
    [queryLower]
  )

  const storeRelevance = React.useCallback(
    (item: (typeof stores)[number]) => {
      return scoreMatch(item.name.toLowerCase(), queryLower) * 3 + scoreMatch(item.category.toLowerCase(), queryLower)
    },
    [queryLower]
  )

  const sortedProducts = React.useMemo(() => {
    const sorted = [...products]
    sorted.sort((a, b) => {
      if (sort === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sort === "highest-rated") return toNumber(b.seller.rating) - toNumber(a.seller.rating)
      if (sort === "price-low-high") return toNumber(a.price) - toNumber(b.price)
      if (sort === "price-high-low") return toNumber(b.price) - toNumber(a.price)
      return productRelevance(b) - productRelevance(a)
    })
    return sorted
  }, [products, sort, productRelevance])

  const sortedRestaurants = React.useMemo(() => {
    const sorted = [...restaurants]
    sorted.sort((a, b) => {
      if (sort === "newest") return b.id.localeCompare(a.id)
      if (sort === "highest-rated") return toNumber(b.rating) - toNumber(a.rating)
      if (sort === "price-low-high") return a.minOrder - b.minOrder
      return restaurantRelevance(b) - restaurantRelevance(a)
    })
    return sorted
  }, [restaurants, sort, restaurantRelevance])

  const sortedStores = React.useMemo(() => {
    const sorted = [...stores]
    sorted.sort((a, b) => {
      if (sort === "newest") return b.id.localeCompare(a.id)
      if (sort === "highest-rated") return toNumber(b.rating) - toNumber(a.rating)
      if (sort === "price-low-high") return a.totalProducts - b.totalProducts
      return storeRelevance(b) - storeRelevance(a)
    })
    return sorted
  }, [stores, sort, storeRelevance])

  const counts = {
    products: products.length,
    restaurants: restaurants.length,
    stores: stores.length,
  }

  const totalResults = counts.products + counts.restaurants + counts.stores

  const activeFilterCount = React.useMemo(
    () =>
      Number(filters.minPrice !== "") +
      Number(filters.maxPrice !== "") +
      Number(filters.location !== "all") +
      Number(filters.productCategory !== "all") +
      Number(filters.productCondition !== "all") +
      Number(filters.productBadge !== "all") +
      Number(filters.productNight) +
      Number(filters.restaurantCuisine !== "all") +
      Number(filters.restaurantOpen) +
      Number(filters.restaurantFreeDelivery) +
      Number(filters.restaurantMaxDelivery !== "all") +
      Number(filters.storeCategory !== "all") +
      Number(filters.storeOpen) +
      Number(filters.storeMinProducts !== "all"),
    [filters]
  )

  const filterOptions = React.useMemo(
    () => ({
      locations: Array.from(new Set(mockProducts.map((item) => item.location))).sort(),
      productCategories: Array.from(new Set(mockProducts.map((item) => item.category.name))).sort(),
      productConditions: Array.from(new Set(mockProducts.map((item) => item.condition))).sort(),
      productBadges: Array.from(new Set(mockProducts.map((item) => item.badges).filter(Boolean))).sort(),
      restaurantCuisines: Array.from(new Set(mockRestaurants.map((item) => item.category.split("·")[0].trim()))).sort(),
      storeCategories: Array.from(new Set(mockStores.map((item) => item.category))).sort(),
    }),
    []
  )

  const clearFilters = () => setFilters(defaultFilters)

  const handleFilterChange = (updates: Partial<SearchFilters>) =>
    setFilters((current) => ({ ...current, ...updates }))

  const handleTabChange = (tab: SearchTab) => {
    setActiveTab(tab)
    if (tab !== "products" && sort === "price-high-low") {
      setSort("relevant")
    }
  }

  const skeletonItems = Array.from({ length: activeTab === "products" ? 8 : 6 })
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "relevant", label: "Most Relevant" },
    { value: "newest", label: "Newest" },
    { value: "highest-rated", label: "Highest Rated" },
    { value: "price-low-high", label: "Price (Low-High)" },
    ...(activeTab === "products" ? [{ value: "price-high-low" as const, label: "Price (High-Low)" }] : []),
  ]

  return (
    <main className="pb-8">
      <section className="sticky top-0 z-40 bg-background/95 px-4 pt-4 pb-3 backdrop-blur-sm">
        <div className="mx-auto max-w-8xl space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => {
                window.setTimeout(() => setIsInputFocused(false), 100)
              }}
              placeholder="Search products, restaurants, stores..."
              className="h-14 rounded-md bg-card px-4 pl-12 pr-12 text-lg ring-1 ring-muted focus-visible:ring-2 focus-visible:ring-vm-tangerine"
            />
            {query.length > 0 && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </button>
            )}
          </div>

          {hasQuery && (
            <button
              type="button"
              onClick={() => inputRef.current?.focus()}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Showing results for <span className="font-semibold text-foreground">&quot;{debouncedQuery}&quot;</span>
            </button>
          )}

          {isInputFocused && query.trim() === "" && (
            <div className="flex flex-wrap gap-2">
              {recentSearches.slice(0, 5).map((item) => (
                <button
                  key={item}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => setQuery(item)}
                  className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-vm-tangerine hover:text-vm-tangerine-foreground"
                >
                  {item}
                </button>
              ))}
            </div>
          )}

          {hasQuery && (
            <div className="grid grid-cols-3 gap-2">
              <ResultStatCard
                label="Products"
                count={counts.products}
                active={activeTab === "products"}
                onClick={() => handleTabChange("products")}
              />
              <ResultStatCard
                label="Restaurants"
                count={counts.restaurants}
                active={activeTab === "restaurants"}
                onClick={() => handleTabChange("restaurants")}
              />
              <ResultStatCard
                label="Stores"
                count={counts.stores}
                active={activeTab === "stores"}
                onClick={() => handleTabChange("stores")}
              />
            </div>
          )}

          {hasQuery && (
            <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as SearchTab)}>
              <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <TabsList className="min-w-max bg-muted">
                  <TabsTrigger
                    value="all"
                    className="data-active:bg-vm-tangerine data-active:text-vm-tangerine-foreground"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="products"
                    className="data-active:bg-vm-tangerine data-active:text-vm-tangerine-foreground"
                  >
                    Products ({counts.products})
                  </TabsTrigger>
                  <TabsTrigger
                    value="restaurants"
                    className="data-active:bg-vm-tangerine data-active:text-vm-tangerine-foreground"
                  >
                    Restaurants ({counts.restaurants})
                  </TabsTrigger>
                  <TabsTrigger
                    value="stores"
                    className="data-active:bg-vm-tangerine data-active:text-vm-tangerine-foreground"
                  >
                    Stores ({counts.stores})
                  </TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-8xl px-4">
        {!hasQuery ? (
          <SearchEmptyState
            trendingSearches={TRENDING_SEARCHES}
            onSelectTrending={setQuery}
            recentlyViewed={mockProducts.slice(0, 4)}
          />
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="lg:hidden">
              <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="rounded-md bg-card">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters ({activeFilterCount})
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85vw] max-w-sm bg-card">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <FilterSidebar
                      activeTab={activeTab}
                      filters={filters}
                      onChange={handleFilterChange}
                      onClearFilters={clearFilters}
                      activeFilterCount={activeFilterCount}
                      options={filterOptions}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <FilterSidebar
              activeTab={activeTab}
              filters={filters}
              onChange={handleFilterChange}
              onClearFilters={clearFilters}
              activeFilterCount={activeFilterCount}
              options={filterOptions}
              className="hidden lg:block lg:sticky lg:top-50 lg:h-fit"
            />

            <div className="space-y-6">
              {activeTab !== "all" && (
                <div className="flex justify-end">
                  <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
                    <SelectTrigger className="h-10 w-52 rounded-md bg-card px-3">
                      <SelectValue placeholder="Sort results" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {isDebouncing ? (
                <div
                  className={
                    activeTab === "products"
                      ? "grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4"
                      : activeTab === "restaurants"
                        ? "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
                        : activeTab === "stores"
                          ? "grid grid-cols-1 gap-3 lg:grid-cols-2"
                          : "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
                  }
                >
                  {skeletonItems.map((_, index) => (
                    <div key={index} className="h-48 animate-pulse rounded-lg bg-muted" />
                  ))}
                </div>
              ) : totalResults === 0 ? (
                <SearchNoResults
                  query={debouncedQuery}
                  popularProducts={[...mockProducts].sort((a, b) => b.likes - a.likes).slice(0, 4)}
                  onBrowseProducts={() => {
                    setQuery("")
                    handleTabChange("products")
                  }}
                />
              ) : activeTab === "all" ? (
                <div className="space-y-12">
                  {[
                    {
                      key: "products" as const,
                      title: "Products",
                      count: sortedProducts.length,
                      content: (
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                          {sortedProducts.slice(0, 6).map((item) => (
                            <ProductCard key={item.id} product={item} />
                          ))}
                        </div>
                      ),
                    },
                    {
                      key: "restaurants" as const,
                      title: "Restaurants",
                      count: sortedRestaurants.length,
                      content: (
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                          {sortedRestaurants.slice(0, 4).map((item) => (
                            <RestaurantCard key={item.id} restaurant={item} />
                          ))}
                        </div>
                      ),
                    },
                    {
                      key: "stores" as const,
                      title: "Stores",
                      count: sortedStores.length,
                      content: (
                        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                          {sortedStores.slice(0, 4).map((item) => (
                            <StoreCard key={item.id} store={item} />
                          ))}
                        </div>
                      ),
                    },
                  ]
                    .filter((section) => section.count > 0)
                    .sort((a, b) => b.count - a.count)
                    .map((section, index) => (
                      <section key={section.key} className="space-y-4">
                        {index > 0 && <div className="h-px bg-muted" />}
                        <div className="flex items-center justify-between">
                          <h2 className="font-heading text-2xl font-bold text-foreground">
                            {section.title}
                          </h2>
                          <button
                            type="button"
                            onClick={() => handleTabChange(section.key)}
                            className="text-sm font-semibold text-vm-tangerine hover:underline"
                          >
                            View all {section.count} →
                          </button>
                        </div>
                        {section.content}
                      </section>
                    ))}
                </div>
              ) : activeTab === "products" ? (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                  {sortedProducts.map((item) => (
                    <ProductCard key={item.id} product={item} />
                  ))}
                </div>
              ) : activeTab === "restaurants" ? (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {sortedRestaurants.map((item) => (
                    <RestaurantCard key={item.id} restaurant={item} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  {sortedStores.map((item) => (
                    <StoreCard key={item.id} store={item} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
