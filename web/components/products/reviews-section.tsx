"use client"

import * as React from "react"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RatingDistribution } from "./rating-distribution"
import { ReviewCard } from "./review-card"
import type { Review } from "@/data/reviews"
import type { ProductSeller } from "@/components/main/product-card"

type Props = {
  productId: string
  seller: ProductSeller
  allReviews: Review[]
}

type SortKey = "newest" | "highest" | "lowest"

function filterAndSort(reviews: Review[], sort: SortKey): Review[] {
  const sorted = [...reviews]
  if (sort === "newest") sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  if (sort === "highest") sorted.sort((a, b) => b.rating - a.rating)
  if (sort === "lowest") sorted.sort((a, b) => a.rating - b.rating)
  return sorted
}

function EmptyReviews() {
  return (
    <div className="py-10 text-center">
      <p className="text-sm text-muted-foreground">No reviews yet. Be the first!</p>
    </div>
  )
}

type TabPanelProps = {
  reviews: Review[]
}

function TabPanel({ reviews }: TabPanelProps) {
  const [sort, setSort] = React.useState<SortKey>("newest")
  const sorted = filterAndSort(reviews, sort)

  return (
    <div>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        <RatingDistribution reviews={reviews} className="flex-1" />
        <div className="shrink-0">
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="w-36 rounded-full text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="highest">Highest rated</SelectItem>
              <SelectItem value="lowest">Lowest rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {sorted.length === 0 ? (
        <EmptyReviews />
      ) : (
        <div>
          {sorted.map((review, i) => (
            <React.Fragment key={review.id}>
              <ReviewCard review={review} />
              {i < sorted.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  )
}

export function ReviewsSection({ productId, seller, allReviews }: Props) {
  const productReviews = allReviews.filter((r) => r.productId === productId)
  const storeReviews = allReviews.filter((r) => r.storeId === seller.id)

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-bold">Reviews</h2>
      <Tabs defaultValue="product">
        <TabsList className="mb-6 h-10 rounded-full bg-muted p-1">
          <TabsTrigger value="product" className="rounded-full px-5 text-sm font-medium">
            Product Reviews
            {productReviews.length > 0 && (
              <span className="ml-1.5 rounded-full bg-vm-tangerine px-1.5 py-0.5 text-[10px] font-bold text-white">
                {productReviews.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="store" className="rounded-full px-5 text-sm font-medium">
            Store Reviews
            {storeReviews.length > 0 && (
              <span className="ml-1.5 rounded-full bg-vm-tangerine px-1.5 py-0.5 text-[10px] font-bold text-white">
                {storeReviews.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="product">
          <TabPanel reviews={productReviews} />
        </TabsContent>
        <TabsContent value="store">
          <TabPanel reviews={storeReviews} />
        </TabsContent>
      </Tabs>
    </section>
  )
}
