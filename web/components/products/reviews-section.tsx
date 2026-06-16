"use client"

import * as React from "react"
import { MessageSquareOff, Star } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { RatingDistribution } from "./rating-distribution"
import { ReviewCard } from "./review-card"
import type { Review } from "@/components/products/product-detail-view"
import { cn } from "@/lib/utils"
import { ComponentProps } from "react"

type Props = {
	productId: string
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
		<div className="flex flex-col items-center gap-3 py-12 text-center">
			<MessageSquareOff className="h-12 w-12 text-muted-foreground/40" />
			<div>
				<p className="text-sm font-semibold text-foreground">No reviews yet</p>
				<p className="mt-0.5 text-xs text-muted-foreground">Be the first to review this product</p>
			</div>
			<Button variant="outline" size="sm" className="mt-1 rounded-full">
				Write a review
			</Button>
		</div>
	)
}

type TabPanelProps = {
	reviews: Review[]
}

function TabPanel({ reviews }: TabPanelProps) {
	const [sort, setSort] = React.useState<SortKey>("newest")
	const sorted = filterAndSort(reviews, sort)

	if (reviews.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center gap-8 py-10 sm:flex-row">
				<div className="flex flex-col items-center">
					<span className="text-5xl font-extrabold leading-none">0.0</span>
					<div className="mt-1.5 flex gap-0.5">
						{[1, 2, 3, 4, 5].map((s) => (
							<Star key={s} className="h-4 w-4 fill-muted text-muted" />
						))}
					</div>
					<span className="mt-1 text-xs text-muted-foreground">0 reviews</span>
				</div>
				<div className="hidden h-16 w-px bg-border sm:block" />
				<EmptyReviews />
			</div>
		)
	}

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
			<div className="max-h-[480px] overflow-y-auto pr-1">
				{sorted.map((review, i) => (
					<React.Fragment key={review.id}>
						<ReviewCard review={review} />
						{i < sorted.length - 1 && <Separator />}
					</React.Fragment>
				))}
			</div>
		</div>
	)
}

export function ReviewsSection({ productId, allReviews, className }: Props & ComponentProps<"div">) {
	const productReviews = allReviews.filter((r) => r.productId === productId)

	return (
		<section className={cn(className)}>
			<h2 className="mb-6 text-xl font-bold font-heading">
				Reviews
				{productReviews.length > 0 && (
					<span className="ml-2 text-base font-normal text-muted-foreground">
						({productReviews.length})
					</span>
				)}
			</h2>
			<TabPanel reviews={productReviews} />
		</section>
	)
}
