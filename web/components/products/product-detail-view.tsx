"use client"

import * as React from "react"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Clock, Tag } from "lucide-react"
import { ProductGallery } from "./product-gallery"
import { ActionsCard } from "./actions-card"
import { SellerCard } from "./seller-card"
import { ReviewsSection } from "./reviews-section"
import { SimilarProducts } from "./similar-products"
import { MobileBuyBar } from "./mobile-buy-bar"
import { ProductCard } from "@/components/main/product-card"
import type { Product } from "@/components/main/product-card"
import type { Review } from "@/data/reviews"

type Props = {
  product: Product
  related: Product[]
  recommended: Product[]
  reviews: Review[]
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}

function RecommendedSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )
}

function RecommendedSection({ products }: { products: Product[] }) {
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    const id = setTimeout(() => setReady(true), 800)
    return () => clearTimeout(id)
  }, [])

  if (!ready) return <RecommendedSkeleton />

  if (products.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {products.slice(0, 4).map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}

export function ProductDetailView({ product, related, recommended, reviews }: Props) {
  return (
    <>
      <div className="container mx-auto max-w-6xl px-4 py-6 pb-24 lg:pb-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/search">{product.category.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[200px] truncate">{product.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Main grid — 60/40 */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Left — gallery + info + reviews */}
          <div className="lg:col-span-3">
            <ProductGallery images={product.images} title={product.title} views={product.views} />

            {/* Product info */}
            <div className="mt-6">
              {/* Badges + meta */}
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {product.badges && (
                  <Badge className="rounded-full bg-vm-tangerine/15 px-2.5 py-0.5 text-xs font-semibold text-vm-tangerine">
                    {product.badges}
                  </Badge>
                )}
                <Badge variant="outline" className="rounded-full text-xs">
                  {product.condition}
                </Badge>
                {product.isNightShop && (
                  <Badge className="rounded-full bg-indigo-500/15 text-xs font-semibold text-indigo-500">
                    Night Shop
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl font-bold leading-snug md:text-3xl">{product.title}</h1>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {product.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {timeAgo(product.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5" />
                  {product.category.name}
                </span>
              </div>

              <Separator className="my-4" />

              <p className="text-sm leading-relaxed text-foreground/80">{product.description}</p>
            </div>

            {/* Reviews */}
            <ReviewsSection
              productId={product.id}
              seller={product.seller}
              allReviews={reviews}
            />
          </div>

          {/* Right — sticky actions + seller */}
          <div className="lg:col-span-2">
            <div className="space-y-4 lg:sticky lg:top-20">
              <ActionsCard
                price={product.price}
                originalPrice={product.originalPrice}
                status={product.status}
                title={product.title}
              />
              <SellerCard seller={product.seller} location={product.location} />
            </div>
          </div>
        </div>

        {/* Similar products */}
        <SimilarProducts products={related} />

        {/* Recommended — 800ms skeleton */}
        {recommended.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-5 text-xl font-bold">Recommended for You</h2>
            <RecommendedSection products={recommended} />
          </section>
        )}
      </div>

      {/* Mobile sticky buy bar */}
      <MobileBuyBar price={product.price} title={product.title} status={product.status} />
    </>
  )
}
