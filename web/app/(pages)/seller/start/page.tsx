"use client"

import Link from "next/link"
import { Store, UtensilsCrossed, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const choices = [
  {
    href: "/seller/store/create",
    icon: Store,
    title: "Sell products",
    description:
      "List physical products — clothing, electronics, books, and more — for students on your campus.",
  },
  {
    href: "/seller/restaurant/create",
    icon: UtensilsCrossed,
    title: "Sell food",
    description:
      "Open a campus restaurant or food vendor and take delivery or pickup orders from hungry students.",
  },
]

export default function StartSellingPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-bold font-heading">Start selling on VarsityMart</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose what you&apos;d like to sell. You can always add the other later.
        </p>
      </div>

      <div className="grid gap-4">
        {choices.map(({ href, icon: Icon, title, description }) => (
          <Link key={href} href={href} className="group block">
            <Card className="transition-colors border-none outline- shadow-md ring-0 hover:border-vm-tangerine/60 hover:bg-vm-tangerine/5">
              <CardContent className="flex items-start gap-4 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-accent group-hover:bg-vm-tangerine/20 transition-colors">
                  <Icon className="h-6 w-6 text-vm-tangerine" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold leading-tight">{title}</p>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-vm-tangerine transition-colors" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
