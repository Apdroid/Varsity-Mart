"use client"

import Link from "next/link"
import { ProductCard } from "@/components/main/product-card"
import { RestaurantCard } from "@/components/main/restaurant-card"
import { ShopByStoreSection } from "@/components/main/shop-by-store-section"
import { StoreCard } from "@/components/main/stores-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useFeaturedRestaurants } from "@/hooks/queries/use-restaurants"
import { useFeaturedStores, useStoreProducts } from "@/hooks/queries/use-stores"
import { useProducts, useFeaturedProducts } from "@/hooks/queries/use-products"
import type { StoreListItem, Product as ApiProduct, RestaurantListItem } from "@/lib/api/types"

type SectionHeaderProps = {
  title: string
  subtitle?: string
  href?: string
  linkLabel?: string
}

function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel = "View all →",
}: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="shrink-0 text-sm font-semibold text-vm-tangerine transition-opacity hover:opacity-80"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  )
}

function mapApiProductToCard(product: ApiProduct) {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: String(product.price),
    originalPrice: product.originalPrice ? String(product.originalPrice) : undefined,
    images: product.images,
    category: {
      id: product.category.id,
      name: product.category.name,
      icon: product.category.icon,
      count: product.category.count ?? 0,
    },
    condition:
      product.condition === "like_new"
        ? "Like New"
        : product.condition === "new"
          ? "New"
          : product.condition.charAt(0).toUpperCase() + product.condition.slice(1),
    location: product.location,
    seller: {
      id: product.seller.id,
      name: product.seller.name,
      email: product.seller.email ?? "",
      avatar: product.seller.avatar,
      rating: String(product.seller.rating),
    },
    badges: product.badges,
    status: product.status,
    views: product.views,
    likes: product.likes,
    isNightShop: product.isNightShop,
    createdAt: product.createdAt,
  }
}

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
    <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="w-72.5 shrink-0 sm:w-[320px] md:w-auto">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="mt-2 h-4 w-3/4" />
          <Skeleton className="mt-2 h-4 w-1/2" />
        </div>
      ))}
    </div>
  )
}

function StoresSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-32 w-full rounded-lg" />
      ))}
    </div>
  )
}

function ProductsSkeleton() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="w-40 shrink-0 sm:w-45 lg:w-47.5">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="mt-2 h-4 w-3/4" />
          <Skeleton className="mt-1 h-4 w-1/2" />
        </div>
      ))}
    </div>
  )
}

function StoreProductsSection({ store }: { store: StoreListItem }) {
  const { data: productsData } = useStoreProducts(store.id, 1, 8)
  const products = productsData?.products || []

  if (products.length === 0) return null

  return (
    <ShopByStoreSection
      store={mapApiStoreToCard(store)}
      products={products.map(mapApiProductToCard)}
    />
  )
}

export function HomepageContent() {
  const { data: restaurantsData, isLoading: restaurantsLoading } = useFeaturedRestaurants(6)
  const { data: storesData, isLoading: storesLoading } = useFeaturedStores(6)
  const { data: featuredProductsData, isLoading: productsLoading } = useFeaturedProducts(12)
  const { data: hostelProductsData } = useProducts({ category: "hostel-supplies", limit: 12 })

  const restaurants = restaurantsData || []
  const stores = storesData || []
  const trendingProducts = featuredProductsData || []
  const hostelProducts = hostelProductsData?.products || []
  const spotlightStores = stores.slice(0, 3)

  return (
    <>
      <section className="container mx-auto px-4 py-8">
        <SectionHeader
          title="Featured Restaurants"
          subtitle="Quick bites, late-night chops, and campus favorites."
          href="/restaurants"
        />
        {restaurantsLoading ? (
          <RestaurantsSkeleton />
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-2 md:overflow-visible xl:grid-cols-4 [&::-webkit-scrollbar]:hidden">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={mapApiRestaurantToCard(restaurant)}
                className="w-72.5 shrink-0 sm:w-[320px] md:w-auto"
              />
            ))}
          </div>
        )}
      </section>

      <section className="container mx-auto px-4 py-8">
        <SectionHeader
          title="Discover campus vendors"
          subtitle="Trusted student sellers and store owners across campus."
          href="/stores"
          linkLabel="Browse all →"
        />
        {storesLoading ? (
          <StoresSkeleton />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <StoreCard key={store.id} store={mapApiStoreToCard(store)} />
            ))}
          </div>
        )}
      </section>

      <section className="container mx-auto px-4 py-8">
        <SectionHeader
          title="Trending on Campus"
          subtitle="What students are buying this week."
          href="/products"
        />
        {productsLoading ? (
          <ProductsSkeleton />
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {trendingProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={mapApiProductToCard(product)}
                className="w-40 shrink-0 sm:w-45 lg:w-47.5"
              />
            ))}
          </div>
        )}
      </section>

      {spotlightStores.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <SectionHeader
            title="Shop by Store"
            subtitle="Pick a vendor and browse their latest campus drops."
            href="/stores"
          />
          <div className="space-y-8">
            {spotlightStores.map((store) => (
              <StoreProductsSection key={store.id} store={store} />
            ))}
          </div>
        </section>
      )}

      {hostelProducts.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <SectionHeader
            title="Hostel Essentials"
            subtitle="Must-haves for room setup and everyday hostel life."
            href="/products?category=hostel-supplies"
          />
          <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {hostelProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={mapApiProductToCard(product)}
                className="w-40 shrink-0 sm:w-45 lg:w-47.5"
              />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
