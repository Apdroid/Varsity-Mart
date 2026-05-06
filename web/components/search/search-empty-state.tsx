"use client"

import Link from "next/link"
import {
  BookOpen,
  Coffee,
  Cpu,
  Home,
  Shirt,
  Sparkles,
  SprayCan,
} from "lucide-react"

import { Product, ProductCard } from "@/components/main/product-card"
import { cn } from "@/lib/utils"

type SearchEmptyStateProps = {
  trendingSearches: string[]
  onSelectTrending: (value: string) => void
  recentlyViewed: Product[]
}

const categoryItems = [
  { label: "Fashion", icon: Shirt, href: "/products?category=fashion" },
  { label: "Electronics", icon: Cpu, href: "/products?category=electronics" },
  { label: "Food", icon: Coffee, href: "/restaurants" },
  { label: "Books", icon: BookOpen, href: "/products?category=books" },
  { label: "Beauty", icon: SprayCan, href: "/products?category=beauty" },
  { label: "Hostel Supplies", icon: Home, href: "/products?category=hostel-supplies" },
]

export function SearchEmptyState({
  trendingSearches,
  onSelectTrending,
  recentlyViewed,
}: SearchEmptyStateProps) {
  return (
    <div className="space-y-10 py-10">
      <div className="space-y-2 text-center">
        <h2 className="font-heading text-3xl font-bold text-foreground">
          What are you looking for?
        </h2>
        <p className="text-muted-foreground">
          Search once and discover products, restaurants, and stores together.
        </p>
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Trending searches</h3>
        <div className="flex flex-wrap gap-2">
          {trendingSearches.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onSelectTrending(item)}
              className="rounded-full bg-muted px-4 py-2 text-sm text-foreground transition-colors hover:bg-vm-tangerine hover:text-vm-tangerine-foreground"
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Popular categories</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {categoryItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/60"
              )}
            >
              <item.icon className="h-4 w-4 text-vm-tangerine" />
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Recently viewed</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {recentlyViewed.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-vm-tangerine" />
        Unified search works across marketplace and food court
      </div>
    </div>
  )
}
