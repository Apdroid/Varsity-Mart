"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Star, Clock, ChevronRight, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Restaurant } from "@/types/models"

const cuisineFilters = [
  { id: "all", label: "All" },
  { id: "local", label: "Local" },
  { id: "fast-food", label: "Fast Food" },
  { id: "continental", label: "Continental" },
  { id: "drinks", label: "Drinks & Smoothies" },
  { id: "snacks", label: "Snacks" },
  { id: "night-shop", label: "Night Shop" },
]

const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Mama's Kitchen",
    description: "Authentic Ghanaian dishes made with love",
    logo: "/african-restaurant-logo.png",
    banner: "/jollof-rice-restaurant.jpg",
    cuisine: ["Local", "Ghanaian"],
    rating: 4.8,
    reviewsCount: 234,
    deliveryTime: "20-30 min",
    deliveryFee: 5,
    minimumOrder: 15,
    isOpen: true,
    ownerId: "1",
    owner: {} as any,
    location: {} as any,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "2",
    name: "Campus Bites",
    description: "Quick bites and snacks for students",
    logo: "/snack-shop-logo.png",
    banner: "/snack-food-banner.jpg",
    cuisine: ["Fast Food", "Snacks"],
    rating: 4.5,
    reviewsCount: 156,
    deliveryTime: "15-25 min",
    deliveryFee: 3,
    minimumOrder: 10,
    isOpen: true,
    ownerId: "2",
    owner: {} as any,
    location: {} as any,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "3",
    name: "Juice Bar & Smoothies",
    description: "Fresh fruits, smoothies, and healthy drinks",
    logo: "/smoothie-bar-logo.png",
    banner: "/smoothie-drinks-banner.jpg",
    cuisine: ["Drinks", "Smoothies", "Healthy"],
    rating: 4.9,
    reviewsCount: 312,
    deliveryTime: "10-20 min",
    deliveryFee: 2,
    minimumOrder: 8,
    isOpen: true,
    ownerId: "3",
    owner: {} as any,
    location: {} as any,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "4",
    name: "Night Owl Essentials",
    description: "Late-night snacks and essentials",
    logo: "/night-shop-logo.png",
    banner: "/night-shop-banner.jpg",
    cuisine: ["Night Shop", "Snacks", "Essentials"],
    rating: 4.6,
    reviewsCount: 89,
    deliveryTime: "15-30 min",
    deliveryFee: 5,
    minimumOrder: 20,
    isOpen: true,
    ownerId: "4",
    owner: {} as any,
    location: {} as any,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "5",
    name: "Shawarma Express",
    description: "Best shawarma on campus",
    logo: "/shawarma-restaurant-logo.png",
    banner: "/shawarma-food-banner.jpg",
    cuisine: ["Fast Food", "Middle Eastern"],
    rating: 4.7,
    reviewsCount: 201,
    deliveryTime: "20-35 min",
    deliveryFee: 4,
    minimumOrder: 15,
    isOpen: false,
    ownerId: "5",
    owner: {} as any,
    location: {} as any,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "6",
    name: "Continental Kitchen",
    description: "Pizza, pasta, and international cuisine",
    logo: "/continental-restaurant-logo.png",
    banner: "/pizza-pasta-banner.jpg",
    cuisine: ["Continental", "Italian", "Pizza"],
    rating: 4.4,
    reviewsCount: 145,
    deliveryTime: "30-45 min",
    deliveryFee: 8,
    minimumOrder: 25,
    isOpen: true,
    ownerId: "6",
    owner: {} as any,
    location: {} as any,
    createdAt: "",
    updatedAt: "",
  },
]

export function FoodPageContent() {
  const [selectedCuisine, setSelectedCuisine] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredRestaurants =
    selectedCuisine === "all"
      ? mockRestaurants
      : mockRestaurants.filter((r) => r.cuisine.some((c) => c.toLowerCase().includes(selectedCuisine)))

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Food & Restaurants</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Food & Restaurants</h1>
        <p className="text-muted-foreground">Order from student-run restaurants and night shops on campus</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search restaurants or dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2 bg-transparent md:hidden">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Cuisine Filters */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
        {cuisineFilters.map((cuisine) => (
          <Button
            key={cuisine.id}
            variant={selectedCuisine === cuisine.id ? "default" : "outline"}
            size="sm"
            className={cn(
              "rounded-full whitespace-nowrap shrink-0",
              selectedCuisine === cuisine.id
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-transparent hover:bg-emerald-50 dark:hover:bg-emerald-950",
            )}
            onClick={() => setSelectedCuisine(cuisine.id)}
          >
            {cuisine.label}
          </Button>
        ))}
      </div>

      {/* Restaurants Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <Link
            key={restaurant.id}
            href={`/food/${restaurant.id}`}
            className="group block rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Banner */}
            <div className="relative h-40">
              <Image
                src={restaurant.banner || "/placeholder.svg?height=160&width=320&query=restaurant food"}
                alt={restaurant.name}
                fill
                className="object-cover"
              />
              {!restaurant.isOpen && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <Badge variant="secondary" className="text-sm">
                    Currently Closed
                  </Badge>
                </div>
              )}
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div className="flex items-center gap-1 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-foreground">{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-1 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium text-foreground">{restaurant.rating}</span>
                  <span className="text-xs text-muted-foreground">({restaurant.reviewsCount})</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                  <Image
                    src={restaurant.logo || "/placeholder.svg?height=48&width=48&query=restaurant logo"}
                    alt={restaurant.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground group-hover:text-emerald-600 transition-colors">
                    {restaurant.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{restaurant.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mt-3">
                {restaurant.cuisine.slice(0, 3).map((c) => (
                  <Badge key={c} variant="secondary" className="text-xs">
                    {c}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-sm text-muted-foreground">
                <span>GH₵{restaurant.deliveryFee} delivery</span>
                <span>Min. GH₵{restaurant.minimumOrder}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
