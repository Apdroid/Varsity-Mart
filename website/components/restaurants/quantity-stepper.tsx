import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
  size?: "sm" | "md"
  className?: string
}

// Shared styling for cart quantity +/- buttons across the app.
// Active = tangerine-tinted (clearly tappable); inactive = muted/greyed.
export const qtyButtonClass = (active: boolean) =>
  cn(
    "grid place-items-center rounded-full border font-medium transition-colors",
    active
      ? "border-vm-tangerine/40 text-vm-tangerine hover:bg-vm-tangerine/10"
      : "border-border text-muted-foreground/40 cursor-not-allowed"
  )

export function QuantityStepper({ value, min = 1, max = 99, onChange, size = "md", className }: Props) {
  const btnCls = size === "sm"
    ? "h-7 w-7 text-xs"
    : "h-9 w-9 text-sm"
  const numCls = size === "sm" ? "w-6 text-sm" : "w-8 text-base"

  const canDecrement = value > min
  const canIncrement = value < max

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <button
        type="button"
        disabled={!canDecrement}
        onClick={() => onChange(value - 1)}
        className={cn(qtyButtonClass(canDecrement), btnCls)}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className={cn("text-center font-semibold tabular-nums", numCls)}>{value}</span>
      <button
        type="button"
        disabled={!canIncrement}
        onClick={() => onChange(value + 1)}
        className={cn(qtyButtonClass(canIncrement), btnCls)}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
