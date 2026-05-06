"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type CategoryPillProps = {
  label: string
  active?: boolean
  onClick?: () => void
}

export function CategoryPill({
  label,
  active = false,
  onClick,
}: CategoryPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full  bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/80",
        active &&
          "border-vm-tangerine/20 bg-vm-tangerine text-vm-tangerine-foreground hover:bg-vm-tangerine/90"
      )}
      aria-pressed={active}
    >
      <span>{label}</span>
    </button>
  )
}
