"use client"

import { cn } from "@/lib/utils"

export type SearchType = "all" | "products" | "stores" | "food"

const OPTIONS: { value: SearchType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "products", label: "Products" },
  { value: "stores", label: "Stores" },
  { value: "food", label: "Food" },
]

type TypeSegmentedControlProps = {
  value: SearchType
  onChange: (type: SearchType) => void
}

export function TypeSegmentedControl({ value, onChange }: TypeSegmentedControlProps) {
  return (
    <div className="flex gap-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            value === opt.value
              ? "bg-vm-tangerine text-vm-tangerine-foreground"
              : "bg-muted text-foreground hover:bg-muted/70"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
