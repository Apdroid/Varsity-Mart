"use client"

import { cn } from "@/lib/utils"

export type CategoryOption = {
  label: string
  count: number
}

type CategoryFilterProps = {
  selected: string
  onChange: (category: string) => void
  options: CategoryOption[]
}

export function CategoryFilter({ selected, onChange, options }: CategoryFilterProps) {
  return (
    <div className="space-y-0.5">
      <button
        type="button"
        onClick={() => onChange("all")}
        className="flex w-full items-center gap-2.5 rounded-md px-1 py-1.5 text-sm transition-colors hover:bg-muted/60"
      >
        <span
          className={cn(
            "h-2 w-2 shrink-0 rounded-full transition-colors",
            selected === "all" ? "bg-vm-tangerine" : "bg-border"
          )}
        />
        <span
          className={cn(
            "flex-1 text-left",
            selected === "all" ? "font-medium text-foreground" : "text-muted-foreground"
          )}
        >
          All Categories
        </span>
      </button>
      {options.map((opt) => {
        const isActive = selected === opt.label
        return (
          <button
            key={opt.label}
            type="button"
            onClick={() => onChange(opt.label)}
            className="flex w-full items-center gap-2.5 rounded-md px-1 py-1.5 text-sm transition-colors hover:bg-muted/60"
          >
            <span
              className={cn(
                "h-2 w-2 shrink-0 rounded-full transition-colors",
                isActive ? "bg-vm-tangerine" : "bg-border"
              )}
            />
            <span
              className={cn(
                "flex-1 text-left",
                isActive ? "font-medium text-foreground" : "text-muted-foreground"
              )}
            >
              {opt.label}
            </span>
            <span className="text-xs text-muted-foreground">{opt.count}</span>
          </button>
        )
      })}
    </div>
  )
}
