"use client"

import { LayoutGrid, List } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export type SortOption =
  | "relevance"
  | "newest"
  | "price-low"
  | "price-high"
  | "highest-rated"

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Most Relevant" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low–High" },
  { value: "price-high", label: "Price: High–Low" },
  { value: "highest-rated", label: "Highest Rated" },
]

type Props = {
  query: string
  totalCount: number
  sort: SortOption
  onSortChange: (sort: SortOption) => void
  view: "grid" | "list"
  onViewChange: (view: "grid" | "list") => void
}

export function SearchUtilityBar({ query, totalCount, sort, onSortChange, view, onViewChange }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="min-w-0 truncate text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{totalCount.toLocaleString()}</span>{" "}
        result{totalCount !== 1 ? "s" : ""} for{" "}
        <span className="font-semibold text-foreground">&ldquo;{query}&rdquo;</span>
      </p>
      <div className="flex shrink-0 items-center gap-2">
        <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
          <SelectTrigger className="h-9 w-44 rounded-md bg-card px-3 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex overflow-hidden rounded-md border border-border">
          <button
            type="button"
            onClick={() => onViewChange("grid")}
            className={cn(
              "flex h-9 w-9 items-center justify-center transition-colors",
              view === "grid"
                ? "bg-vm-tangerine text-vm-tangerine-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="sr-only">Grid view</span>
          </button>
          <button
            type="button"
            onClick={() => onViewChange("list")}
            className={cn(
              "flex h-9 w-9 items-center justify-center border-l border-border transition-colors",
              view === "list"
                ? "bg-vm-tangerine text-vm-tangerine-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <List className="h-4 w-4" />
            <span className="sr-only">List view</span>
          </button>
        </div>
      </div>
    </div>
  )
}
