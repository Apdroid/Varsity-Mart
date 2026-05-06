"use client"

import { cn } from "@/lib/utils"

type ResultStatCardProps = {
  label: string
  count: number
  active?: boolean
  onClick?: () => void
}

export function ResultStatCard({
  label,
  count,
  active = false,
  onClick,
}: ResultStatCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-18 flex-col justify-center rounded-lg bg-card px-4 text-left transition-colors hover:bg-muted/60",
        active && "bg-vm-tangerine/10 ring-1 ring-vm-tangerine"
      )}
    >
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xl font-bold text-foreground">{count}</p>
    </button>
  )
}
