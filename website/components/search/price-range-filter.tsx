"use client"

import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"

export const PRICE_RANGE_MIN = 0
export const PRICE_RANGE_MAX = 5000

type PriceRangeFilterProps = {
  min: number
  max: number
  onChange: (min: number, max: number) => void
}

export function PriceRangeFilter({ min, max, onChange }: PriceRangeFilterProps) {
  return (
    <div className="space-y-4 px-1">
      <div className="[&_[data-slot='slider-range']]:bg-vm-tangerine [&_[data-slot='slider-thumb']]:border-vm-tangerine">
        <Slider
          min={PRICE_RANGE_MIN}
          max={PRICE_RANGE_MAX}
          step={50}
          value={[min, max]}
          onValueChange={(vals: number[]) => onChange(vals[0], vals[1])}
        />
      </div>
      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-1">
          <p className="text-xs text-muted-foreground">Min (GHS)</p>
          <Input
            type="number"
            inputMode="numeric"
            value={min}
            min={PRICE_RANGE_MIN}
            max={max}
            onChange={(e) => {
              const val = Math.max(PRICE_RANGE_MIN, Math.min(Number(e.target.value), max))
              onChange(Number.isNaN(val) ? PRICE_RANGE_MIN : val, max)
            }}
            className="h-8 rounded-md bg-muted px-2 text-sm"
          />
        </div>
        <span className="pb-1.5 text-muted-foreground">—</span>
        <div className="flex-1 space-y-1">
          <p className="text-xs text-muted-foreground">Max (GHS)</p>
          <Input
            type="number"
            inputMode="numeric"
            value={max}
            min={min}
            max={PRICE_RANGE_MAX}
            onChange={(e) => {
              const val = Math.min(PRICE_RANGE_MAX, Math.max(Number(e.target.value), min))
              onChange(min, Number.isNaN(val) ? PRICE_RANGE_MAX : val)
            }}
            className="h-8 rounded-md bg-muted px-2 text-sm"
          />
        </div>
      </div>
    </div>
  )
}
