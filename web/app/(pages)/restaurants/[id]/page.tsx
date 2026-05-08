"use client"

import * as React from "react"
import { useParams, notFound } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Star, Clock, Bike, MapPin, Leaf, Droplets } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { mockRestaurants } from "@/data/restaurant"
import type { MenuItem, RestaurantWithMenu } from "@/data/restaurant"
import { MenuItemCard } from "@/components/restaurants/menu-item-card"
import { CustomizationSheet } from "@/components/restaurants/customization-sheet"
import { RestaurantCart } from "@/components/restaurants/restaurant-cart"
import { cn } from "@/lib/utils"

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

function applyFilter(items: MenuItem[], filter: FilterKey): MenuItem[] {
  if (filter === "all") return items
  if (filter === "vegetarian") return items.filter((i) => i.dietaryTags?.includes("vegetarian"))
  if (filter === "halal") return items.filter((i) => i.dietaryTags?.includes("halal"))
  if (filter === "under30") return items.filter((i) => i.basePrice < 30)
  return items
}

function RestaurantHeader({ restaurant }: { restaurant: RestaurantWithMenu }) {
  return (
    <div >
      {/* Banner */}
      <div className="relative h-52 w-full overflow-hidden md:h-64">
        <Image
          src={restaurant.banner}
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

      {/* Info card */}
      <div className="relative mx-4 -mt-14 rounded-2xl border border-border bg-card px-4 py-4 shadow-md md:mx-6">
        <div className="flex items-start gap-3">
          {/* Logo */}
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
            <Image src={restaurant.logo} alt={restaurant.name} fill className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h1 className="text-lg font-bold leading-tight">{restaurant.name}</h1>
                <p className="text-xs text-muted-foreground">{restaurant.category}</p>
              </div>
              {restaurant.badge && (
                <Badge className="shrink-0 rounded-full bg-vm-tangerine/15 text-xs font-semibold text-vm-tangerine">
                  {restaurant.badge}
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

export default function RestaurantPage() {
  const params = useParams<{ id: string }>()
  const restaurant = mockRestaurants.find((r) => r.id === params.id)

  const [activeCategory, setActiveCategory] = React.useState<string>("")
  const [activeFilter, setActiveFilter] = React.useState<FilterKey>("all")
  const [customizing, setCustomizing] = React.useState<MenuItem | null>(null)
  const tabsRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (restaurant) setActiveCategory(restaurant.menu.categories[0])
  }, [restaurant?.id])

  if (!restaurant) notFound()

  const { categories, items } = restaurant.menu

  const visibleItems = applyFilter(
    activeCategory ? items.filter((i) => i.category === activeCategory) : items,
    activeFilter
  )

  const scrollToCategory = (cat: string) => {
    setActiveCategory(cat)
    const el = document.getElementById(`cat-${cat}`)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-background pb-28">
      <RestaurantHeader restaurant={restaurant} />

      {/* Sticky tab bar */}
      <div
        ref={tabsRef}
        className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md"
      >
        {/* Category tabs */}
        <div className="flex overflow-x-auto px-4 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => scrollToCategory(cat)}
              className={cn(
                "shrink-0 px-4 pb-2.5 text-sm font-semibold transition-colors",
                activeCategory === cat
                  ? "border-b-2 border-vm-tangerine text-vm-tangerine"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter chips */}
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

      {/* Menu */}
      <div className="mx-auto max-w-2xl px-4 pt-5">
        {visibleItems.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No items match this filter.
          </div>
        ) : (
          <div className="space-y-8">
            {categories
              .filter((cat) => visibleItems.some((i) => i.category === cat))
              .map((cat, idx) => {
                const catItems = visibleItems.filter((i) => i.category === cat)
                if (catItems.length === 0) return null
                return (
                  <section key={cat} id={`cat-${cat}`}>
                    {idx > 0 && <Separator className="mb-6" />}
                    <h2 className="mb-3 text-base font-bold">{cat}</h2>
                    <div className="space-y-2.5">
                      {catItems.map((item) => (
                        <MenuItemCard
                          key={item.id}
                          item={item}
                          restaurant={restaurant}
                          onCustomize={setCustomizing}
                        />
                      ))}
                    </div>
                  </section>
                )
              })}
          </div>
        )}
      </div>

      {/* Customization sheet */}
      <CustomizationSheet
        item={customizing}
        restaurant={restaurant}
        open={!!customizing}
        onClose={() => setCustomizing(null)}
      />

      {/* Floating cart */}
      <RestaurantCart />
    </div>
  )
}
