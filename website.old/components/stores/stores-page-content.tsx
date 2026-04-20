"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, Star, ChevronRight, BadgeCheck, Store, ShoppingBag } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StoresCarousel } from "@/components/home/stores-carousel"
import { useStores } from "@/hooks/queries/useStores"
import type { Store as StoreType } from "@/types/models"

// Store Card Component
function StoreCard({ store }: { store: StoreType }) {
  return (
    <Link
      href={`/stores/${store.id}`}
      className="group block rounded-xl border border-border/50 bg-card overflow-hidden hover:shadow-lg hover:border-border transition-all duration-300"
    >
      {/* Banner */}
      <div className="relative h-32 sm:h-36 bg-linear-to-br from-primary/20 to-primary/5 overflow-hidden">
        {store.banner && (
          <Image
            src={store.banner}
            alt={store.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        {!store.isOpen && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <Badge variant="secondary">Currently Closed</Badge>
          </div>
        )}

        {/* Products count badge */}
        <div className="absolute bottom-3 right-3 z-10">
          <Badge className="bg-background/90 backdrop-blur-sm text-foreground shadow-md">
            <ShoppingBag className="h-3 w-3 mr-1" />
            {store.productsCount} products
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <div className="flex items-start gap-3 -mt-10 relative">
          <div className="w-16 h-16 rounded-xl border-4 border-card bg-background overflow-hidden shrink-0 shadow-lg">
            <Image
              src={store.logo || "/placeholder.svg?height=64&width=64&query=store logo"}
              alt={store.name}
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <div className="pt-8 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {store.name}
              </h3>
              {store.isVerified && <BadgeCheck className="h-4 w-4 text-primary shrink-0" />}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{store.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-foreground">{store.rating}</span>
            <span className="text-sm text-muted-foreground">({store.reviewsCount} reviews)</span>
          </div>
          {store.isOpen && (
            <Badge variant="outline" className="text-green-600 border-green-600/30 bg-green-500/5">
              Open
            </Badge>
          )}
        </div>
      </CardContent>
    </Link>
  )
}

export function StoresPageContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("rating")
  const [filterVerified, setFilterVerified] = useState<string>("all")

  const { data, isLoading } = useStores({ search: searchQuery || undefined } as any)
  const allStores: StoreType[] = (data as any)?.data ?? []

  const filteredStores = allStores
    .filter((store) => {
      const matchesVerified =
        filterVerified === "all" ||
        (filterVerified === "verified" && store.isVerified) ||
        (filterVerified === "unverified" && !store.isVerified)
      return matchesVerified
    })
    .sort((a, b) => {
      if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0)
      if (sortBy === "products") return (b.productsCount ?? 0) - (a.productsCount ?? 0)
      if (sortBy === "reviews") return (b.reviewsCount ?? 0) - (a.reviewsCount ?? 0)
      return 0
    })

  const verifiedStores = allStores.filter((s) => s.isVerified)
  const topRatedStores = allStores.filter((s) => (s.rating ?? 0) >= 4.5)

  return (
    <div className="py-8">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Stores</span>
        </nav>
      </div>

      {/* Verified Stores Carousel */}
      {verifiedStores.length > 0 && (
        <section className="py-6 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="mx-auto max-w-7xl">
            <StoresCarousel
              stores={verifiedStores.slice(0, 10)}
              title="✓ Verified Stores"
              subtitle="Trusted student-run businesses on campus"
              viewAllLink="/stores?filter=verified"
              viewAllText="See All Verified"
            />
          </div>
        </section>
      )}

      {/* Top Rated Carousel */}
      {topRatedStores.length > 0 && (
        <section className="py-6 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="mx-auto max-w-7xl">
            <StoresCarousel
              stores={topRatedStores.slice(0, 10)}
              title="⭐ Top Rated Stores"
              subtitle="Highest rated stores by students"
              viewAllLink="/stores?sort=rating"
              viewAllText="See All Top Rated"
            />
          </div>
        </section>
      )}

      {/* All Stores Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          {/* Header with Search and Filters */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">All Stores</h2>
                <p className="text-muted-foreground text-sm">
                  {filteredStores.length} stores available
                </p>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search stores..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>

              <div className="flex gap-2">
                <Select value={filterVerified} onValueChange={setFilterVerified}>
                  <SelectTrigger className="w-[130px] h-10">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stores</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="unverified">Unverified</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px] h-10">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Top Rated</SelectItem>
                    <SelectItem value="products">Most Products</SelectItem>
                    <SelectItem value="reviews">Most Reviews</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Stores Grid */}
          {filteredStores.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredStores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Store className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No stores found</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Try adjusting your search or filters
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setFilterVerified("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
