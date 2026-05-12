"use client"

import * as React from "react"
import { useParams, notFound } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Star, Clock, Bike, MapPin, Leaf, Droplets } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { MenuItemCard } from "@/components/restaurants/menu-item-card"
import { CustomizationSheet } from "@/components/restaurants/customization-sheet"
import { RestaurantCart } from "@/components/restaurants/restaurant-cart"
import { cn } from "@/lib/utils"
import { useRestaurant, useMenuItems } from "@/hooks/queries/use-restaurants"
import type { RestaurantDetail, MenuItem as ApiMenuItem } from "@/lib/api/types"

function formatGHS(n: string | number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(Number(n))
}

type FilterKey = "all" | "vegetarian" | "halal" | "under30"

const FILTER_LABELS: Record<FilterKey, string> = {
  all: "All",
  vegetarian: "Vegetarian",
  halal: "Halal",
  under30: "Under GHS 30",
}

function applyFilter(items: ApiMenuItem[], filter: FilterKey): ApiMenuItem[] {
  if (filter === "all") return items
  if (filter === "vegetarian") return items.filter((i) => i.dietaryTags?.includes("vegetarian"))
  if (filter === "halal") return items.filter((i) => i.dietaryTags?.includes("halal"))
  if (filter === "under30") return items.filter((i) => i.basePrice < 30)
  return items
}

function mapMenuItemForComponent(item: ApiMenuItem) {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    basePrice: item.basePrice,
    image: item.image,
    category: item.category,
    sizeOptions: item.sizeOptions,
    proteinOptions: item.proteinOptions,
    sides: item.sides,
    modifiers: item.modifiers,
    allowsNotes: item.allowsNotes,
    isQuickAdd: item.isQuickAdd,
    isAvailable: item.isAvailable,
    dietaryTags: item.dietaryTags,
    allergens: item.allergens,
    bundleSuggestionIds: item.bundleSuggestionIds,
    restaurant: item.restaurant,
    createdAt: item.createdAt,
  }
}

function RestaurantHeaderSkeleton() {
  return (
    <div>
      <Skeleton className="h-52 w-full md:h-64" />
      <div className="relative mx-4 -mt-14 rounded-2xl border bg-card px-4 py-4 shadow-md md:mx-6">
        <div className="flex items-start gap-3">
          <Skeleton className="h-14 w-14 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>
    </div>
  )
}

function RestaurantHeader({ restaurant }: { restaurant: RestaurantDetail }) {
  return (
    <div>
      <div className="relative h-52 w-full overflow-hidden md:h-64">
        <Image
          src={restaurant.banner || restaurant.logo || "/placeholder.jpg"}
          alt={restaurant.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <Link
          href="/restaurants"
          className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>

      <div className="relative mx-4 -mt-14 rounded-2xl border border-border bg-card px-4 py-4 shadow-md md:mx-6">
        <div className="flex items-start gap-3">
          {restaurant.logo && (
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
              <Image src={restaurant.logo} alt={restaurant.name} fill className="object-cover" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h1 className="text-lg font-bold leading-tight">{restaurant.name}</h1>
                <p className="text-xs text-muted-foreground">{restaurant.category}</p>
              </div>
              {restaurant.isFeatured && (
                <Badge className="shrink-0 rounded-full bg-vm-tangerine/15 text-xs font-semibold text-vm-tangerine">
                  Featured
                </Badge>
              )}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 font-medium text-foreground">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {restaurant.rating}
                <span className="font-normal text-muted-foreground">({restaurant.totalReviews.toLocaleString()})</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {restaurant.deliveryTime}
              </span>
              <span className="flex items-center gap-1">
                <Bike className="h-3.5 w-3.5" />
                {Number(restaurant.deliveryFee) === 0 ? "Free delivery" : formatGHS(restaurant.deliveryFee) + " delivery"}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                Min {formatGHS(restaurant.minOrder)}
              </span>
            </div>
          </div>
        </div>

        {!restaurant.isOpen && (
          <div className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-center text-sm font-medium text-destructive">
            Currently closed — check back later
          </div>
        )}
      </div>
    </div>
  )
}

function MenuSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-lg" />
      ))}
    </div>
  )
}

export default function RestaurantPage() {
  const params = useParams<{ id: string }>()
  const { data: restaurantData, isLoading: restaurantLoading, error } = useRestaurant(params.id)
  const { data: menuData, isLoading: menuLoading } = useMenuItems(params.id)

  const restaurant = restaurantData
  const menuItems = menuData?.items || []
  const menuCategories = menuData?.categories || []

  const [activeCategory, setActiveCategory] = React.useState<string>("")
  const [activeFilter, setActiveFilter] = React.useState<FilterKey>("all")
  const [customizing, setCustomizing] = React.useState<ApiMenuItem | null>(null)
  const tabsRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (menuCategories.length > 0 && !activeCategory) {
      setActiveCategory(menuCategories[0])
    }
  }, [menuCategories, activeCategory])

  if (restaurantLoading) {
    return (
      <div className="max-w-7xl mx-auto min-h-screen bg-background pb-28 lg:pb-8">
        <RestaurantHeaderSkeleton />
        <div className="mx-auto max-w-7xl px-4 pt-5">
          <MenuSkeleton />
        </div>
      </div>
    )
  }

  if (error || !restaurant) {
    notFound()
  }

  const currentCategory = menuCategories.includes(activeCategory) ? activeCategory : menuCategories[0] || ""
  const categoryItems = menuItems.filter((item) => item.category === currentCategory)
  const visibleItems = applyFilter(categoryItems, activeFilter)

  const scrollToCategory = (cat: string) => {
    setActiveCategory(cat)
    const el = document.getElementById(`cat-${cat}`)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const restaurantForCart = {
    id: restaurant.id,
    name: restaurant.name,
    logo: restaurant.logo || "",
    banner: restaurant.banner || "",
    category: restaurant.category,
    cuisineType: restaurant.cuisineType || "",
    rating: String(restaurant.rating),
    totalReviews: restaurant.totalReviews,
    deliveryTime: restaurant.deliveryTime,
    deliveryFee: String(restaurant.deliveryFee),
    minOrder: restaurant.minOrder,
    isOpen: restaurant.isOpen,
    isFeatured: restaurant.isFeatured,
    tags: [],
    badge: restaurant.isFeatured ? "Featured" : undefined,
    menu: {
      categories: menuCategories,
      items: menuItems.map(mapMenuItemForComponent),
    },
  }

  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-background pb-28 lg:pb-8">
      <RestaurantHeader restaurant={restaurant} />

      <div
        ref={tabsRef}
        className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md"
      >
        <div className="flex overflow-x-auto px-4 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {menuCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => scrollToCategory(cat)}
              className={cn(
                "shrink-0 px-4 pb-2.5 text-sm font-semibold transition-colors",
                currentCategory === cat
                  ? "border-b-2 border-vm-tangerine text-vm-tangerine"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto px-4 pb-3 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(Object.keys(FILTER_LABELS) as FilterKey[]).map((key) => {
            const Icon = key === "vegetarian" ? Leaf : key === "halal" ? Droplets : null
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveFilter(key)}
                className={cn(
                  "flex shrink-0 items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                  activeFilter === key
                    ? "border-vm-tangerine bg-vm-tangerine/10 text-vm-tangerine"
                    : "border-border bg-transparent text-muted-foreground hover:bg-muted"
                )}
              >
                {Icon && <Icon className="h-3 w-3" />}
                {FILTER_LABELS[key]}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-5">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="mx-auto w-full max-w-2xl lg:max-w-none">
            {menuLoading ? (
              <MenuSkeleton />
            ) : visibleItems.length === 0 ? (
              <div className="py-16 text-center text-sm text-muted-foreground">
                No items match this filter.
              </div>
            ) : (
              <div className="space-y-8">
                {menuCategories
                  .filter((cat) => {
                    const items = menuItems.filter((i) => i.category === cat)
                    return applyFilter(items, activeFilter).length > 0
                  })
                  .map((cat, idx) => {
                    const catItems = applyFilter(
                      menuItems.filter((i) => i.category === cat),
                      activeFilter
                    )
                    if (catItems.length === 0) return null
                    return (
                      <section key={cat} id={`cat-${cat}`}>
                        {idx > 0 && <Separator className="mb-6" />}
                        <h2 className="mb-3 text-base font-bold">{cat}</h2>
                        <div className="space-y-2.5">
                          {catItems.map((item) => (
                            <MenuItemCard
                              key={item.id}
                              item={mapMenuItemForComponent(item)}
                              restaurant={restaurantForCart}
                              onCustomize={(menuItem) => {
                                const apiItem = menuItems.find((i) => i.id === menuItem.id)
                                if (apiItem) setCustomizing(apiItem)
                              }}
                            />
                          ))}
                        </div>
                      </section>
                    )
                  })}
              </div>
            )}
          </div>
          <RestaurantCart />
        </div>
      </div>

      <CustomizationSheet
        item={customizing ? mapMenuItemForComponent(customizing) : null}
        restaurant={restaurantForCart}
        open={!!customizing}
        onClose={() => setCustomizing(null)}
      />
    </div>
  )
}
