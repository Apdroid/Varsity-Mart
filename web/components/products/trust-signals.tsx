import { ShieldCheck, RotateCcw, Smartphone } from "lucide-react"

const SIGNALS = [
  { icon: ShieldCheck, text: "Verified KNUST seller" },
  { icon: RotateCcw, text: "7-day returns on most items" },
  { icon: Smartphone, text: "Pay with MoMo or card" },
] as const

export function TrustSignals() {
  return (
    <div className="space-y-2.5 rounded-xl bg-muted/50 px-3 py-3">
      {SIGNALS.map(({ icon: Icon, text }) => (
        <div key={text} className="flex items-center gap-2.5">
          <Icon className="h-4 w-4 shrink-0 text-vm-tangerine" />
          <span className="text-xs text-muted-foreground">{text}</span>
        </div>
      ))}
    </div>
  )
}
