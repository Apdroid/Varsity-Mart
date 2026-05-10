import Link from "next/link"
import HeroSlider from "@/components/main/hero"
import Newsletter from "@/components/main/newsletter"
import { ProductCard, type Product } from "@/components/main/product-card"
import { RestaurantCard } from "@/components/main/restaurant-card"
import { ShopByStoreSection } from "@/components/main/shop-by-store-section"
import { StoreCard, type Store } from "@/components/main/stores-card"
import { mockProducts } from "@/data/product"
import { mockRestaurants } from "@/data/restaurant"
import { mockStores } from "@/data/store"

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

function getStoreProducts(store: Store, limit = 9): Product[] {
  const category = store.category.toLowerCase()
  const tokens: string[] = []

  if (
    category.includes("electronics") ||
    category.includes("laptop") ||
    category.includes("phone")
  ) {
    tokens.push("electronics", "laptop", "phone", "tech")
  }
  if (
    category.includes("fashion") ||
    category.includes("sneaker") ||
    category.includes("streetwear")
  ) {
    tokens.push("fashion", "shirt", "sneaker", "streetwear", "jacket")
  }
  if (
    category.includes("book") ||
    category.includes("stationery") ||
    category.includes("print")
  ) {
    tokens.push("books", "book", "stationery", "exam")
  }
  if (category.includes("hostel") || category.includes("home")) {
    tokens.push("hostel", "supplies", "desk", "fridge", "home")
  }
  if (category.includes("beauty")) {
    tokens.push("beauty")
  }
  if (tokens.length === 0) {
    tokens.push(store.category.split(" ")[0].toLowerCase())
  }

  const matches = mockProducts.filter((product) => {
    const haystack =
      `${product.category.name} ${product.title} ${product.description}`.toLowerCase()
    return tokens.some((token) => haystack.includes(token))
  })

  if (matches.length >= limit) {
    return matches.slice(0, limit)
  }

  const fallback = mockProducts.filter(
    (product) => !matches.some((candidate) => candidate.id === product.id)
  )

  return [...matches, ...fallback].slice(0, limit)
}

export default function Page() {
  const featuredRestaurants = mockRestaurants.slice(0, 6)
  const topStores = mockStores.slice(0, 6)
  const trendingProducts = mockProducts.slice(0, 12)
  const spotlightStores = [mockStores[0], mockStores[1], mockStores[4]]
  const hostelEssentials = mockProducts.filter((product) => {
    const haystack =
      `${product.category.name} ${product.title} ${product.description}`.toLowerCase()
    return ["hostel", "supplies", "desk", "fridge", "home"].some((token) =>
      haystack.includes(token)
    )
  })

  return (
    <div className="max-w-8xl mx-auto min-h-svh">
      <HeroSlider />

      <section className="container mx-auto px-4 py-8">
        <SectionHeader
          title="Featured Restaurants"
          subtitle="Quick bites, late-night chops, and campus favorites."
          href="/restaurants"
        />
        <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-2 md:overflow-visible xl:grid-cols-4 [&::-webkit-scrollbar]:hidden">
          {featuredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              className="w-72.5 shrink-0 sm:w-[320px] md:w-auto"
            />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <SectionHeader
          title="Discover campus vendors"
          subtitle="Trusted student sellers and store owners across campus."
          href="/stores"
          linkLabel="Browse all →"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {topStores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <SectionHeader
          title="Trending on Campus"
          subtitle="What students are buying this week."
          href="/products"
        />
        <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {trendingProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              className="w-40 shrink-0 sm:w-45 lg:w-47.5"
            />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <SectionHeader
          title="Shop by Store"
          subtitle="Pick a vendor and browse their latest campus drops."
          href="/stores"
        />
        <div className="space-y-8">
          {spotlightStores.map((store) => (
            <ShopByStoreSection
              key={store.id}
              store={store}
              products={getStoreProducts(store, 8)}
            />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <SectionHeader
          title="Hostel Essentials"
          subtitle="Must-haves for room setup and everyday hostel life."
          href="/products?category=hostel-supplies"
        />
        <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(hostelEssentials.length
            ? hostelEssentials
            : mockProducts.slice(4, 12)
          ).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              className="w-40 shrink-0 sm:w-45 lg:w-47.5"
            />
          ))}
        </div>
      </section>
      <Newsletter />
    </div>
  )
}
