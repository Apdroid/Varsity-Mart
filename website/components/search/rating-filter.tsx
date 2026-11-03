"use client"

import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

const RATINGS = [4, 3, 2] as const

type RatingFilterProps = {
  value: number | null
  onChange: (rating: number | null) => void
}

export function RatingFilter({ value, onChange }: RatingFilterProps) {
  return (
    <div className="space-y-0.5">
      {RATINGS.map((rating) => {
        const isActive = value === rating
        return (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(isActive ? null : rating)}
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-1 py-1.5 text-sm transition-colors hover:bg-muted/60",
              isActive && "bg-vm-tangerine/10"
            )}
          >
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5",
                    i < rating
                      ? "fill-vm-tangerine text-vm-tangerine"
                      : "fill-none text-muted-foreground/40"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">& up</span>
            {isActive && (
              <span className="ml-auto text-xs font-semibold text-vm-tangerine">✓</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
