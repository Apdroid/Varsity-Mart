"use client"

import { cn } from "@/lib/utils"

type CuisinePillProps = {
  label: string
  emoji: string
  active?: boolean
  onClick?: () => void
}

export function CuisinePill({
  label,
  emoji,
  active = false,
  onClick,
}: CuisinePillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/80",
        active &&
          "bg-vm-tangerine text-vm-tangerine-foreground hover:bg-vm-tangerine/90"
      )}
    >
      <span aria-hidden>{emoji}</span>
      <span>{label}</span>
    </button>
  )
}
