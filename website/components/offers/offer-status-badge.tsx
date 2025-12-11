import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Offer } from "@/types/models"

interface OfferStatusBadgeProps {
  status: Offer["status"]
  className?: string
}

export function OfferStatusBadge({ status, className }: OfferStatusBadgeProps) {
  const variants = {
    pending: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    countered: {
      label: "Countered",
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    },
    accepted: {
      label: "Accepted",
      className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    },
    declined: {
      label: "Declined",
      className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    },
    expired: {
      label: "Expired",
      className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    },
  }

  const variant = variants[status]

  return (
    <Badge variant="secondary" className={cn(variant.className, "font-medium", className)}>
      {variant.label}
    </Badge>
  )
}
