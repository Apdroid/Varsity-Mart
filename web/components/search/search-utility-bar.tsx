"use client"

import * as React from "react"
import { LayoutGrid, List, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

type SearchUtilityBarProps = {
  query: string
  onQueryChange: (q: string) => void
  debouncedQuery: string
  totalCount: number
  sort: SortOption
  onSortChange: (sort: SortOption) => void
  view: "grid" | "list"
  onViewChange: (view: "grid" | "list") => void
  recentSearches: string[]
  isInputFocused: boolean
  onFocus: () => void
  onBlur: () => void
  hasQuery: boolean
  inputRef: React.RefObject<HTMLInputElement | null>
}

export function SearchUtilityBar({
  query,
  onQueryChange,
  debouncedQuery,
  totalCount,
  sort,
  onSortChange,
  view,
  onViewChange,
  recentSearches,
  isInputFocused,
  onFocus,
  onBlur,
  hasQuery,
  inputRef,
}: SearchUtilityBarProps) {
  return (
    <div className="space-y-3">
      {/* Search input row */}
      <div className=" rounded-lg relative flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder="Search products, stores, food..."
            className="h-12 rounded-full bg-card pl-10 pr-10 py-4 border-none  focus-visible:ring-2 focus-visible:ring-vm-tangerine"
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Clear</span>
            </button>
          )}
        </div>
        <Button
          type="button"
          onClick={() => inputRef.current?.blur()}
          className="h-12 shrink-0 rounded-full bg-vm-tangerine px-5 text-vm-tangerine-foreground hover:bg-vm-tangerine/90"
        >
          Search
        </Button>
      </div>

      {/* Recent searches (on focus, empty input) */}
      {isInputFocused && query.trim() === "" && recentSearches.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {recentSearches.slice(0, 5).map((item) => (
            <button
              key={item}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onQueryChange(item)}
              className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-vm-tangerine hover:text-vm-tangerine-foreground"
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {/* Result count + sort + view toggle */}
      {hasQuery && (
        <div className="flex items-center justify-between gap-4">
          <p className="min-w-0 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{totalCount}</span>{" "}
            result{totalCount !== 1 ? "s" : ""} for{" "}
            <span className="font-semibold text-foreground">
              &quot;{debouncedQuery}&quot;
            </span>
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <Select
              value={sort}
              onValueChange={(v) => onSortChange(v as SortOption)}
            >
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
      )}
    </div>
  )
}
