import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Review } from "@/components/products/product-detail-view"

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

type Props = {
  review: Review
  className?: string
}

export function ReviewCard({ review, className }: Props) {
  return (
    <div className={cn("py-4", className)}>
      <div className="flex items-start gap-3">
        <img
          src={review.user.avatar}
          alt={review.user.name}
          className="h-9 w-9 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-1">
            <span className="text-sm font-semibold">{review.user.name}</span>
            <span className="text-xs text-muted-foreground">{timeAgo(review.createdAt)}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={cn(
                  "h-3.5 w-3.5",
                  s <= review.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
                )}
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-foreground/80 leading-relaxed">{review.comment}</p>
        </div>
      </div>
    </div>
  )
}
