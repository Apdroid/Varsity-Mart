"use client"

import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Props = {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
  disabled?: boolean
  compact?: boolean
  className?: string
}

export function QuantityStepper({ value, min = 1, max = 99, onChange, disabled, compact, className }: Props) {
  const atMin = value <= min
  const atMax = value >= max
  const h = compact ? "h-9" : "h-10"
  const w = compact ? "w-9" : "w-10"
  const wDisplay = compact ? "w-12" : "w-14"

  return (
    <TooltipProvider>
      <div className={cn("inline-flex", className)}>
        <div className={cn("flex items-stretch rounded-md border border-border overflow-hidden", disabled && "opacity-50 pointer-events-none")}>
          <button
            type="button"
            disabled={disabled || atMin}
            onClick={() => onChange(Math.max(min, value - 1))}
            className={cn(
              "flex items-center justify-center border-r border-border bg-background hover:bg-muted transition-colors disabled:cursor-not-allowed disabled:opacity-40",
              h, w
            )}
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>

          <div className={cn("flex items-center justify-center text-base font-semibold select-none bg-background", h, wDisplay)}>
            {value}
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                disabled={disabled || atMax}
                onClick={() => onChange(Math.min(max, value + 1))}
                className={cn(
                  "flex items-center justify-center border-l border-border bg-background hover:bg-vm-tangerine/10 hover:text-vm-tangerine transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                  h, w
                )}
                aria-label="Increase quantity"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            {atMax && (
              <TooltipContent side="top" className="text-xs">
                Only {max} available
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
