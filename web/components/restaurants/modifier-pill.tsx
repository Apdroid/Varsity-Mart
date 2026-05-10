import { cn } from "@/lib/utils"

type Props = {
  label: string
  active: boolean
  onToggle: () => void
}

export function ModifierPill({ label, active, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
        active
          ? "border-vm-tangerine bg-vm-tangerine/10 text-vm-tangerine"
          : "border-border bg-transparent text-foreground hover:bg-muted"
      )}
    >
      {label}
    </button>
  )
}
