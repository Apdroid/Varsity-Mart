"use client"

import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const CONDITION_ORDER = ["New", "Like New", "Good", "Fair"] as const

export type ConditionOption = {
  label: string
  count: number
}

type ConditionFilterProps = {
  selected: string[]
  onChange: (conditions: string[]) => void
  options: ConditionOption[]
}

export function ConditionFilter({ selected, onChange, options }: ConditionFilterProps) {
  const toggle = (condition: string) => {
    if (selected.includes(condition)) {
      onChange(selected.filter((c) => c !== condition))
    } else {
      onChange([...selected, condition])
    }
  }

  return (
    <div className="space-y-0.5">
      {CONDITION_ORDER.map((condition) => {
        const opt = options.find((o) => o.label === condition)
        const count = opt?.count ?? 0
        const isActive = selected.includes(condition)

        return (
          <button
            key={condition}
            type="button"
            onClick={() => toggle(condition)}
            className="flex w-full items-center gap-2.5 rounded-md px-1 py-1.5 text-sm transition-colors hover:bg-muted/60"
          >
            <span
              className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                isActive
                  ? "border-vm-tangerine bg-vm-tangerine"
                  : "border-border bg-background"
              )}
            >
              {isActive && <Check className="h-3 w-3 text-vm-tangerine-foreground" />}
            </span>
            <span
              className={cn(
                "flex-1 text-left",
                isActive ? "font-medium text-foreground" : "text-muted-foreground"
              )}
            >
              {condition}
            </span>
            {count > 0 && (
              <span className="text-xs text-muted-foreground">{count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
