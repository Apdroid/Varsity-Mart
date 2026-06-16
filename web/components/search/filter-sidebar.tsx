"use client"

import { Check } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { CategoryFilter } from "./category-filter"
import { ConditionFilter } from "./condition-filter"
import { PRICE_RANGE_MAX, PRICE_RANGE_MIN, PriceRangeFilter } from "./price-range-filter"
import { RatingFilter } from "./rating-filter"
import { TypeSegmentedControl } from "./type-segmented-control"
import type { CategoryOption } from "./category-filter"
import type { ConditionOption } from "./condition-filter"
import type { SearchType } from "./type-segmented-control"

export type { SearchType }

export type SearchFilters = {
  type: SearchType
  category: string
  priceMin: number
  priceMax: number
  conditions: string[]
  rating: number | null
  openNow: boolean
  freeDelivery: boolean
}

type FilterSidebarProps = {
  filters: SearchFilters
  onChange: (updates: Partial<SearchFilters>) => void
  onClearFilters: () => void
  activeFilterCount: number
  categoryOptions: CategoryOption[]
  conditionOptions: ConditionOption[]
  className?: string
  /** Show the Type segmented control. Defaults to true. */
  showType?: boolean
}

export function FilterSidebar({
  filters,
  onChange,
  onClearFilters,
  activeFilterCount,
  categoryOptions,
  conditionOptions,
  className,
  showType = true,
}: FilterSidebarProps) {
  const { type } = filters
  const showCategories = type === "all" || type === "products"
  const showPrice = type === "products" || type === "food"
  const showCondition = type === "products"
  const showAvailability = type === "stores" || type === "food"
  const priceLabel = type === "food" ? "Budget" : "Price Range"

  return (
    <aside className={cn("rounded-lg bg-card p-4", className)}>
      <Accordion
        type="multiple"
        defaultValue={["type", "categories", "price", "condition", "rating", "availability"]}
      >
        {showType && (
          <AccordionItem value="type" className="border-b border-border/50">
            <AccordionTrigger className="py-2.5 text-sm font-semibold hover:no-underline">
              Type
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <TypeSegmentedControl
                value={type}
                onChange={(newType) =>
                  onChange({
                    type: newType,
                    category: "all",
                    conditions: [],
                    openNow: false,
                    freeDelivery: false,
                  })
                }
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {showCategories && (
          <AccordionItem value="categories" className="border-b border-border/50">
            <AccordionTrigger className="py-2.5 text-sm font-semibold hover:no-underline">
              Categories
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <CategoryFilter
                selected={filters.category}
                onChange={(category) => onChange({ category })}
                options={categoryOptions}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {showPrice && (
          <AccordionItem value="price" className="border-b border-border/50">
            <AccordionTrigger className="py-2.5 text-sm font-semibold hover:no-underline">
              {priceLabel}
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <PriceRangeFilter
                min={filters.priceMin}
                max={filters.priceMax}
                onChange={(priceMin, priceMax) => onChange({ priceMin, priceMax })}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {showCondition && (
          <AccordionItem value="condition" className="border-b border-border/50">
            <AccordionTrigger className="py-2.5 text-sm font-semibold hover:no-underline">
              Condition
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <ConditionFilter
                selected={filters.conditions}
                onChange={(conditions) => onChange({ conditions })}
                options={conditionOptions}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem
          value="rating"
          className={cn("border-b border-border/50", !showAvailability && "border-b-0")}
        >
          <AccordionTrigger className="py-2.5 text-sm font-semibold hover:no-underline">
            Rating
          </AccordionTrigger>
          <AccordionContent className="pb-3">
            <RatingFilter
              value={filters.rating}
              onChange={(rating) => onChange({ rating })}
            />
          </AccordionContent>
        </AccordionItem>

        {showAvailability && (
          <AccordionItem value="availability" className="border-b-0">
            <AccordionTrigger className="py-2.5 text-sm font-semibold hover:no-underline">
              Availability
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <div className="space-y-0.5">
                <CheckRow
                  label="Open Now"
                  checked={filters.openNow}
                  onToggle={() => onChange({ openNow: !filters.openNow })}
                />
                {type === "food" && (
                  <CheckRow
                    label="Free Delivery"
                    checked={filters.freeDelivery}
                    onToggle={() => onChange({ freeDelivery: !filters.freeDelivery })}
                  />
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      {activeFilterCount > 0 && (
        <div className="mt-4 border-t border-border pt-4">
          <button
            type="button"
            onClick={onClearFilters}
            className="flex items-center gap-2 text-sm text-vm-tangerine hover:underline"
          >
            Clear all filters
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-vm-tangerine px-1.5 text-[11px] font-bold text-vm-tangerine-foreground">
              {activeFilterCount}
            </span>
          </button>
        </div>
      )}
    </aside>
  )
}

function CheckRow({
  label,
  checked,
  onToggle,
}: {
  label: string
  checked: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center gap-2.5 rounded-md px-1 py-1.5 text-sm transition-colors hover:bg-muted/60"
    >
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
          checked ? "border-vm-tangerine bg-vm-tangerine" : "border-border bg-background"
        )}
      >
        {checked && <Check className="h-3 w-3 text-vm-tangerine-foreground" />}
      </span>
      <span className={cn("text-left", checked ? "font-medium text-foreground" : "text-muted-foreground")}>
        {label}
      </span>
    </button>
  )
}

export { PRICE_RANGE_MIN, PRICE_RANGE_MAX }
