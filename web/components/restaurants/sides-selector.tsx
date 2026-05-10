import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MenuItemOption, SideConfig } from "@/data/restaurant"

type Props = {
  config: SideConfig
  selected: MenuItemOption[]
  onChange: (sides: MenuItemOption[]) => void
}

function formatMod(mod: number): string {
  if (mod === 0) return ""
  return mod > 0 ? `+GHS ${mod}` : `-GHS ${Math.abs(mod)}`
}

export function SidesSelector({ config, selected, onChange }: Props) {
  const toggle = (opt: MenuItemOption) => {
    const isSelected = selected.some((s) => s.name === opt.name)
    if (isSelected) {
      onChange(selected.filter((s) => s.name !== opt.name))
    } else if (selected.length < config.max) {
      onChange([...selected, opt])
    }
  }

  const atMax = selected.length >= config.max

  return (
    <div>
      <div className="mb-2 flex items-baseline gap-1.5">
        <span className="text-sm font-semibold">Add-ons</span>
        <span className="text-xs text-muted-foreground">
          Choose up to {config.max}
          {selected.length > 0 && ` · ${selected.length} selected`}
        </span>
      </div>
      <div className="space-y-1.5">
        {config.options.map((opt) => {
          const isSelected = selected.some((s) => s.name === opt.name)
          const disabled = !isSelected && atMax
          return (
            <button
              key={opt.name}
              type="button"
              disabled={disabled}
              onClick={() => toggle(opt)}
              className={cn(
                "flex w-full items-center justify-between rounded-md border px-3 py-2.5 text-sm transition-colors",
                isSelected
                  ? "border-vm-tangerine bg-vm-tangerine/5"
                  : disabled
                  ? "cursor-not-allowed border-border opacity-40"
                  : "border-border bg-transparent hover:bg-muted/50"
              )}
            >
              <span className="font-medium">{opt.name}</span>
              <div className="flex items-center gap-2">
                {opt.priceMod !== 0 && (
                  <span className="text-xs text-muted-foreground">{formatMod(opt.priceMod)}</span>
                )}
                <div
                  className={cn(
                    "grid h-4 w-4 place-items-center rounded border-2 transition-colors",
                    isSelected ? "border-vm-tangerine bg-vm-tangerine" : "border-border"
                  )}
                >
                  {isSelected && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
