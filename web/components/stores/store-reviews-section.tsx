"use client"

import * as React from "react"
import { Loader2, MessageSquareOff, Star } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { RatingDistribution } from "@/components/products/rating-distribution"
import { ReviewCard } from "@/components/products/review-card"
import type { Review as ComponentReview } from "@/components/products/product-detail-view"
import type { Review as ApiReview } from "@/lib/api/types"
import { useStoreReviews } from "@/hooks/queries/use-stores"

type SortKey = "newest" | "highest" | "lowest"

function mapReview(r: ApiReview): ComponentReview {
	const name = `${r.author.firstName ?? ""} ${r.author.lastName ?? ""}`.trim() || "Anonymous"
	return {
		id: r.id,
		user: {
			id: r.author.id,
			name,
			avatar:
				r.author.avatar ||
				`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
		},
		rating: r.rating,
		comment: r.review,
		createdAt: r.createdAt,
		helpful: r.helpfulCount,
		verified: r.author.isVerified,
	}
}

function sortReviews(reviews: ComponentReview[], sort: SortKey): ComponentReview[] {
	const sorted = [...reviews]
	if (sort === "newest") sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
	if (sort === "highest") sorted.sort((a, b) => b.rating - a.rating)
	if (sort === "lowest") sorted.sort((a, b) => a.rating - b.rating)
	return sorted
}

export function StoreReviewsSection({ storeId }: { storeId: string }) {
	const [sort, setSort] = React.useState<SortKey>("newest")
	const { data, isLoading } = useStoreReviews(storeId)

	const reviews = React.useMemo(() => (data?.reviews ?? []).map(mapReview), [data?.reviews])
	const sorted = sortReviews(reviews, sort)

	return (
		<div>
			<h2 className="mb-3 font-heading text-lg font-bold text-foreground">
				Reviews
				{reviews.length > 0 && (
					<span className="ml-1.5 text-base font-normal text-muted-foreground">
						({reviews.length})
					</span>
				)}
			</h2>

			{isLoading ? (
				<div className="flex items-center justify-center py-10 text-muted-foreground">
					<Loader2 className="h-5 w-5 animate-spin" />
				</div>
			) : reviews.length === 0 ? (
				<div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card py-12 text-center">
					<MessageSquareOff className="h-12 w-12 text-muted-foreground/40" />
					<div>
						<p className="text-sm font-semibold text-foreground">No reviews yet</p>
						<p className="mt-0.5 text-xs text-muted-foreground">
							This store hasn&apos;t been reviewed yet.
						</p>
					</div>
				</div>
			) : (
				<div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
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
			)}
		</div>
	)
}
