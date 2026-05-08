"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ShoppingBag, ArrowRight, Users } from "lucide-react"
import { toast } from "sonner"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { CartLine } from "./cart-line"
import { useCartStore, useCartCount, useCartTotal } from "@/store/cart-store"

function formatGHS(n: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(n)
}

export function RestaurantCart() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const lines = useCartStore((s) => s.lines)
  const count = useCartCount()
  const total = useCartTotal()

  const isEmpty = lines.length === 0

  return (
    <>
      {/* Floating cart button — always visible while browsing */}
      {count > 0 && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-4 z-50 flex items-center gap-2 rounded-full bg-vm-graphite px-4 py-3 text-white shadow-xl transition-all hover:bg-vm-graphite/90 active:scale-95 lg:bottom-8 lg:right-8"
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-vm-tangerine text-[9px] font-black">
              {count}
            </span>
          </div>
          <span className="text-sm font-semibold">{formatGHS(total)}</span>
        </button>
      )}

      {/* Cart drawer */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[90vh] bg-background">
          <DrawerHeader className="border-b border-border px-5 py-3 text-left">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-base font-bold">
                Your Order
                {count > 0 && (
                  <span className="ml-2 rounded-full bg-vm-tangerine px-2 py-0.5 text-xs font-bold text-white">
                    {count}
                  </span>
                )}
              </DrawerTitle>
              <button
                type="button"
                onClick={() => {
                  toast.info("Group order coming soon!")
                }}
                className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted"
              >
                <Users className="h-3.5 w-3.5" />
                Group order ↗
              </button>
            </div>
          </DrawerHeader>

          {isEmpty ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-muted">
                <ShoppingBag className="h-7 w-7 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold">Your order is empty</p>
                <p className="mt-1 text-sm text-muted-foreground">Browse the menu and tap + to add items.</p>
              </div>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1">
                <div className="px-5">
                  {lines.map((line, i) => (
                    <React.Fragment key={line.lineId}>
                      <CartLine line={line} />
                      {i < lines.length - 1 && <Separator />}
                    </React.Fragment>
                  ))}
                </div>
              </ScrollArea>

              <DrawerFooter className="border-t border-border bg-card px-5 py-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-bold">{formatGHS(total)}</span>
                </div>
                <p className="text-xs text-muted-foreground">Delivery fee added at checkout.</p>
                <Button
                  className="w-full bg-vm-tangerine font-semibold text-vm-tangerine-foreground hover:bg-vm-tangerine/90"
                  size="lg"
                  onClick={() => {
                    setOpen(false)
                    router.push("/checkout")
                  }}
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
                  Continue Ordering
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  )
}
