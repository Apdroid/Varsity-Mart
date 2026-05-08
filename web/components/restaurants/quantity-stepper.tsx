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

export function QuantityStepper({ value, min = 1, max = 99, onChange, size = "md", className }: Props) {
  const btnCls = size === "sm"
    ? "h-7 w-7 text-xs"
    : "h-9 w-9 text-sm"
  const numCls = size === "sm" ? "w-6 text-sm" : "w-8 text-base"

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <button
        type="button"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className={cn(
          "grid place-items-center rounded-full border border-border font-medium transition-colors",
          "hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40",
          btnCls
        )}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className={cn("text-center font-semibold tabular-nums", numCls)}>{value}</span>
      <button
        type="button"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className={cn(
          "grid place-items-center rounded-full border border-border font-medium transition-colors",
          "hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40",
          btnCls
        )}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
