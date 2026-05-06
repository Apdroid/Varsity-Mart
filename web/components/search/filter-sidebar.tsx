"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

export type SearchTab = "all" | "products" | "restaurants" | "stores"

export type SearchFilters = {
  minPrice: string
  maxPrice: string
  location: string
  productCategory: string
  productCondition: string
  productBadge: string
  productNight: boolean
  restaurantCuisine: string
  restaurantOpen: boolean
  restaurantFreeDelivery: boolean
  restaurantMaxDelivery: string
  storeCategory: string
  storeOpen: boolean
  storeMinProducts: string
}

type FilterSidebarProps = {
  activeTab: SearchTab
  filters: SearchFilters
  onChange: (updates: Partial<SearchFilters>) => void
  onClearFilters: () => void
  activeFilterCount: number
  options: {
    locations: string[]
    productCategories: string[]
    productConditions: string[]
    productBadges: string[]
    restaurantCuisines: string[]
    storeCategories: string[]
  }
  className?: string
}

export function FilterSidebar({
  activeTab,
  filters,
  onChange,
  onClearFilters,
  activeFilterCount,
  options,
  className,
}: FilterSidebarProps) {
  return (
    <aside className={cn("rounded-lg bg-card p-4", className)}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Filters</h2>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-xs font-semibold text-vm-tangerine hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["shared", "type"]}>
        <AccordionItem value="shared">
          <AccordionTrigger>Shared filters</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Min price"
                  inputMode="numeric"
                  value={filters.minPrice}
                  onChange={(event) => onChange({ minPrice: event.target.value })}
                  className="h-9 rounded-md bg-muted px-3"
                />
                <Input
                  placeholder="Max price"
                  inputMode="numeric"
                  value={filters.maxPrice}
                  onChange={(event) => onChange({ maxPrice: event.target.value })}
                  className="h-9 rounded-md bg-muted px-3"
                />
              </div>
              <Select value={filters.location} onValueChange={(value) => onChange({ location: value })}>
                <SelectTrigger className="h-9 w-full rounded-md bg-muted px-3">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All locations</SelectItem>
                  {options.locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        {activeTab === "products" && (
          <AccordionItem value="type">
            <AccordionTrigger>Product filters</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <Select
                  value={filters.productCategory}
                  onValueChange={(value) => onChange({ productCategory: value })}
                >
                  <SelectTrigger className="h-9 w-full rounded-md bg-muted px-3">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {options.productCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filters.productCondition}
                  onValueChange={(value) => onChange({ productCondition: value })}
                >
                  <SelectTrigger className="h-9 w-full rounded-md bg-muted px-3">
                    <SelectValue placeholder="Condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All conditions</SelectItem>
                    {options.productConditions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filters.productBadge}
                  onValueChange={(value) => onChange({ productBadge: value })}
                >
                  <SelectTrigger className="h-9 w-full rounded-md bg-muted px-3">
                    <SelectValue placeholder="Badge" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All badges</SelectItem>
                    {options.productBadges.map((badge) => (
                      <SelectItem key={badge} value={badge}>
                        {badge}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant={filters.productNight ? "default" : "outline"}
                  className={cn(
                    "h-9 w-full rounded-md",
                    filters.productNight && "bg-vm-tangerine text-vm-tangerine-foreground hover:bg-vm-tangerine/90"
                  )}
                  onClick={() => onChange({ productNight: !filters.productNight })}
                >
                  Night shop only
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {activeTab === "restaurants" && (
          <AccordionItem value="type">
            <AccordionTrigger>Restaurant filters</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <Select
                  value={filters.restaurantCuisine}
                  onValueChange={(value) => onChange({ restaurantCuisine: value })}
                >
                  <SelectTrigger className="h-9 w-full rounded-md bg-muted px-3">
                    <SelectValue placeholder="Cuisine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All cuisines</SelectItem>
                    {options.restaurantCuisines.map((cuisine) => (
                      <SelectItem key={cuisine} value={cuisine}>
                        {cuisine}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant={filters.restaurantOpen ? "default" : "outline"}
                  className={cn(
                    "h-9 w-full rounded-md",
                    filters.restaurantOpen && "bg-vm-tangerine text-vm-tangerine-foreground hover:bg-vm-tangerine/90"
                  )}
                  onClick={() => onChange({ restaurantOpen: !filters.restaurantOpen })}
                >
                  Open now
                </Button>
                <Button
                  type="button"
                  variant={filters.restaurantFreeDelivery ? "default" : "outline"}
                  className={cn(
                    "h-9 w-full rounded-md",
                    filters.restaurantFreeDelivery &&
                      "bg-vm-tangerine text-vm-tangerine-foreground hover:bg-vm-tangerine/90"
                  )}
                  onClick={() =>
                    onChange({ restaurantFreeDelivery: !filters.restaurantFreeDelivery })
                  }
                >
                  Free delivery
                </Button>
                <Select
                  value={filters.restaurantMaxDelivery}
                  onValueChange={(value) => onChange({ restaurantMaxDelivery: value })}
                >
                  <SelectTrigger className="h-9 w-full rounded-md bg-muted px-3">
                    <SelectValue placeholder="Max delivery time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any delivery time</SelectItem>
                    <SelectItem value="15">Under 15 min</SelectItem>
                    <SelectItem value="30">Under 30 min</SelectItem>
                    <SelectItem value="45">Under 45 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {activeTab === "stores" && (
          <AccordionItem value="type">
            <AccordionTrigger>Store filters</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <Select
                  value={filters.storeCategory}
                  onValueChange={(value) => onChange({ storeCategory: value })}
                >
                  <SelectTrigger className="h-9 w-full rounded-md bg-muted px-3">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {options.storeCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant={filters.storeOpen ? "default" : "outline"}
                  className={cn(
                    "h-9 w-full rounded-md",
                    filters.storeOpen && "bg-vm-tangerine text-vm-tangerine-foreground hover:bg-vm-tangerine/90"
                  )}
                  onClick={() => onChange({ storeOpen: !filters.storeOpen })}
                >
                  Open now
                </Button>
                <Select
                  value={filters.storeMinProducts}
                  onValueChange={(value) => onChange({ storeMinProducts: value })}
                >
                  <SelectTrigger className="h-9 w-full rounded-md bg-muted px-3">
                    <SelectValue placeholder="Min product count" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any product count</SelectItem>
                    <SelectItem value="50">50+ products</SelectItem>
                    <SelectItem value="100">100+ products</SelectItem>
                    <SelectItem value="200">200+ products</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </aside>
  )
}
