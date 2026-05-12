import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MenuItemOption } from "@/lib/api/types"

type Props = {
  label: string
  required?: boolean
  options: MenuItemOption[]
  selected: MenuItemOption | null
  onChange: (option: MenuItemOption) => void
}

function formatMod(mod: number): string {
  if (mod === 0) return ""
  return mod > 0 ? `+GHS ${mod}` : `-GHS ${Math.abs(mod)}`
}

export function OptionGroup({ label, required = false, options, selected, onChange }: Props) {
  return (
    <div>
      <div className="mb-2 flex items-baseline gap-1.5">
        <span className="text-sm font-semibold">{label}</span>
        {required && (
          <span className="rounded-full bg-vm-tangerine/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-vm-tangerine">
            Required
          </span>
        )}
      </div>
      <div className="space-y-1.5">
        {options.map((opt) => {
          const active = selected?.name === opt.name
          return (
            <button
              key={opt.name}
              type="button"
              onClick={() => onChange(opt)}
              className={cn(
                "flex w-full items-center justify-between rounded-md border px-3 py-2.5 text-sm transition-colors",
                active
                  ? "border-vm-tangerine bg-vm-tangerine/5 text-foreground"
                  : "border-border bg-transparent hover:bg-muted/50"
              )}
            >
              <span className="font-medium">{opt.name}</span>
              <div className="flex items-center gap-2">
                {opt.priceMod !== 0 && (
                  <span className={cn("text-xs", opt.priceMod > 0 ? "text-muted-foreground" : "text-emerald-600")}>
                    {formatMod(opt.priceMod)}
                  </span>
                )}
                <div
                  className={cn(
                    "grid h-4 w-4 place-items-center rounded-full border-2 transition-colors",
                    active ? "border-vm-tangerine bg-vm-tangerine" : "border-border"
                  )}
                >
                  {active && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
