"use client"

import { cn } from "@/lib/utils"

const MAX = 200

type Props = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function NotesInput({
  value,
  onChange,
  placeholder = "Any special requests? e.g. \"extra shito please\" or \"no onion for the jollof\"",
  className,
}: Props) {
  const remaining = MAX - value.length
  const nearLimit = remaining <= 30

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-semibold">Special Instructions</label>
        <span className={cn("text-xs", nearLimit ? "text-destructive font-medium" : "text-muted-foreground")}>
          {remaining} left
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX))}
        rows={3}
        placeholder={placeholder}
        className={cn(
          "w-full resize-none rounded-md border border-border bg-background px-3 py-2.5 text-sm",
          "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-vm-tangerine/40",
          "transition-colors"
        )}
      />
      <p className="text-xs text-muted-foreground">
        Notes are read by the seller — they'll do their best to accommodate you.
      </p>
    </div>
  )
}
