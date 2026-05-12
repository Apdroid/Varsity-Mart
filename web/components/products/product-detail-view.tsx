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
import { Separator } from "@/components/ui/separator"
import { ProductGallery } from "./product-gallery"
import { ActionsCard } from "./actions-card"
import { SellerCard } from "./seller-card"
import { ReviewsSection } from "./reviews-section"
import { SimilarProducts } from "./similar-products"
import { MoreFromSeller } from "./more-from-seller"
import { RecentlyViewed, saveRecentlyViewed } from "./recently-viewed"
import { QuantityStepper } from "./quantity-stepper"
import { TrustSignals } from "./trust-signals"
import { MobileBuyBar } from "./mobile-buy-bar"
import type { Product } from "@/components/main/product-card"

export type Review = {
  id: string
  productId?: string
  storeId?: string
  user: {
    id: string
    name: string
    avatar: string
  }
  rating: number
  comment: string
  createdAt: string
  helpful: number
  verified?: boolean
}

type Props = {
  product: Product
  related: Product[]
  sellerProducts: Product[]
  reviews: Review[]
}

function formatGHS(amount: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(amount)
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}

// ── Stock pill ─────────────────────────────────────────────────────────────────
function StockPill({ stock, quantity }: { stock?: number; quantity: number }) {
  if (stock === undefined) return null

  if (stock <= 0) {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
        <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
        Out of stock
      </div>
    )
  }

  const label =
    quantity >= stock
      ? "Maximum quantity selected"
      : quantity > 1
        ? `${stock} in stock · adding ${quantity}`
        : `In stock (${stock} available)`

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {label}
    </div>
  )
}

// ── Price block ────────────────────────────────────────────────────────────────
function PriceBlock({ price, originalPrice }: { price: string; originalPrice?: string }) {
  const hasDiscount = originalPrice && Number(originalPrice) > Number(price)
  const discountPct = hasDiscount
    ? Math.round((1 - Number(price) / Number(originalPrice)) * 100)
    : 0

  return (
    <div className="flex flex-wrap items-end gap-2">
      <span className="text-3xl font-bold tracking-tight">{formatGHS(Number(price))}</span>
      {hasDiscount && (
        <>
          <span className="mb-0.5 text-base text-muted-foreground line-through">
            {formatGHS(Number(originalPrice))}
          </span>
          <span className="mb-0.5 rounded-full bg-vm-tangerine px-2 py-0.5 text-xs font-bold text-vm-tangerine-foreground">
            -{discountPct}%
          </span>
        </>
      )}
    </div>
  )
}

// ── Description section ────────────────────────────────────────────────────────
function DescriptionSection({ description }: { description: string }) {
  const [expanded, setExpanded] = React.useState(false)
  const isLong = description.length > 200

  return (
    <div>
      <h3 className="mb-1.5 text-sm font-semibold text-foreground">Description</h3>
      <p
        className={`text-sm leading-relaxed text-foreground/80 ${!expanded && isLong ? "line-clamp-4" : ""}`}
      >
        {description}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-1.5 text-xs font-medium text-vm-tangerine hover:underline"
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  )
}

// ── Product details grid ───────────────────────────────────────────────────────
function ProductDetailsGrid({ product }: { product: Product }) {
  const rows = [
    { label: "Condition", value: product.condition },
    { label: "Location", value: product.location },
    { label: "Posted", value: timeAgo(product.createdAt) },
    { label: "Views", value: product.views?.toLocaleString() },
    { label: "Likes", value: product.likes?.toLocaleString() },
  ].filter((r) => r.value)

  return (
    <div>
      <h3 className="mb-2.5 text-sm font-semibold text-foreground">Product Details</h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {rows.map(({ label, value }) => (
          <div key={label}>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Right column (ProductInfo) ─────────────────────────────────────────────────
type ProductInfoProps = {
  product: Product
  quantity: number
  onQuantityChange: (v: number) => void
  actionsRef: React.RefObject<HTMLDivElement | null>
}

function ProductInfo({ product, quantity, onQuantityChange, actionsRef }: ProductInfoProps) {
  const hasStock = product.stock !== undefined && product.stock > 0
  const maxQty = product.stock ? Math.min(product.stock, 99) : 99
  const showStepper = hasStock && product.stock! > 1

  return (
    <div className="space-y-5">
      {/* a. Category badge */}
      <div>
        <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
          {product.category.name}
        </span>
      </div>

      {/* b. Title */}
      <h1 className="text-2xl font-bold font-heading leading-snug md:text-[1.6rem]">
        {product.title}
      </h1>

      {/* c. Condition badge */}
      <span className="inline-flex rounded-full border border-vm-tangerine/20 bg-vm-tangerine/10 px-2.5 py-0.5 text-xs font-medium text-vm-tangerine">
        {product.condition}
      </span>

      {/* d. Price block */}
      <PriceBlock price={product.price} originalPrice={product.originalPrice} />

      {/* e. Stock pill */}
      <StockPill stock={product.stock} quantity={quantity} />

      <Separator />

      {/* f. Description */}
      {product.description && <DescriptionSection description={product.description} />}

      {/* g. Product details */}
      <ProductDetailsGrid product={product} />

      <Separator />

      {/* h. Quantity stepper */}
      {showStepper && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Quantity</p>
          <QuantityStepper
            value={quantity}
            min={1}
            max={maxQty}
            onChange={onQuantityChange}
          />
          {quantity > 1 && (
            <p className="text-sm text-muted-foreground">
              {quantity} × {formatGHS(Number(product.price))} ={" "}
              <span className="font-semibold text-foreground">
                {formatGHS(quantity * Number(product.price))}
              </span>
            </p>
          )}
        </div>
      )}

      {/* i. Actions card */}
      <div ref={actionsRef}>
        <ActionsCard
          price={product.price}
          stock={product.stock}
          title={product.title}
          quantity={quantity}
        />
      </div>

      {/* j. Trust signals */}
      <TrustSignals />

      {/* k. Seller card */}
      <SellerCard
        seller={product.seller}
        location={product.location}
        productId={product.id}
        productTitle={product.title}
        productImage={product.images?.[0]?.thumbnail_url}
      />
    </div>
  )
}

// ── Main export ────────────────────────────────────────────────────────────────
export function ProductDetailView({ product, related, sellerProducts, reviews }: Props) {
  const [quantity, setQuantity] = React.useState(1)
  const [actionsVisible, setActionsVisible] = React.useState(true)
  const actionsRef = React.useRef<HTMLDivElement>(null)

  // Save to recently viewed
  React.useEffect(() => {
    saveRecentlyViewed(product)
  }, [product.id])

  // Hide mobile bar when actions card is visible
  React.useEffect(() => {
    const el = actionsRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setActionsVisible(entry.isIntersecting),
      { threshold: 0 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const categoryId =
    typeof product.category === "object" ? product.category.id : undefined

  return (
    <>
      <div className="container mx-auto max-w-6xl px-4 py-6 pb-24 lg:pb-12">
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
                <Link href={`/search?category=${categoryId ?? ""}`}>
                  {product.category.name}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-52 truncate">{product.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero grid — gallery left, info right */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Left — gallery */}
          <div className="lg:col-span-3">
            <ProductGallery
              images={product.images}
              title={product.title}
              views={product.views}
            />
          </div>

          {/* Right — info */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto lg:pr-1">
              <ProductInfo
                product={product}
                quantity={quantity}
                onQuantityChange={setQuantity}
                actionsRef={actionsRef}
              />
            </div>
          </div>
        </div>

        {/* ── Below the fold ─────────────────────────────────────── */}

        {/* Reviews (moved below fold) */}
        <div className="mt-12 border-t border-border pt-12">
          <ReviewsSection
            productId={product.id}
            seller={product.seller}
            allReviews={reviews}
          />
        </div>

        {/* Similar products */}
        <SimilarProducts products={related} categoryId={categoryId} />

        {/* More from seller */}
        <MoreFromSeller
          seller={product.seller}
          products={sellerProducts}
          currentProductId={product.id}
        />

        {/* Recently viewed */}
        <RecentlyViewed currentProductId={product.id} />
      </div>

      {/* Mobile sticky buy bar */}
      <MobileBuyBar
        price={product.price}
        title={product.title}
        stock={product.stock}
        quantity={quantity}
        onQuantityChange={setQuantity}
        actionsVisible={actionsVisible}
      />
    </>
  )
}
