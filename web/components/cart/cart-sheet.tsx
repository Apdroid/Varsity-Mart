"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

type CartItem = {
  id: string
  name: string
  store: string
  price: number
  quantity: number
  image: string
}

const MOCK_ITEMS: CartItem[] = [
  {
    id: "1",
    name: "KNUST Classic Hoodie",
    store: "Campus Threads",
    price: 85,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop",
  },
  {
    id: "2",
    name: "Engineering Mathematics",
    store: "Akosua's Bookstore",
    price: 120,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=200&fit=crop",
  },
  {
    id: "3",
    name: "Wireless Earbuds Pro",
    store: "Tech Hub KNUST",
    price: 199,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop",
  },
]

function formatGHS(amount: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function CartSheet() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [items, setItems] = React.useState<CartItem[]>(MOCK_ITEMS)

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    )
  }

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((item) => item.id !== id))

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10" aria-label="Cart">
          <ShoppingCart className="size-6" strokeWidth={2.5} />
          {itemCount > 0 && (
            <Badge className="absolute -right-0.5 -top-0.5 h-5 min-w-5 rounded-full border-2 border-background bg-vm-tangerine p-0 text-[10px] font-bold leading-none text-white">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="flex items-center gap-2 text-base">
            Your Cart
            {itemCount > 0 && (
              <Badge className="h-5 rounded-full bg-vm-tangerine px-1.5 text-[10px] font-bold text-white">
                {itemCount}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          /* ── Empty state ── */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-10 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-muted">
              <ShoppingBag className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse the marketplace and add items to get started.
              </p>
            </div>
            <Button
              className="bg-vm-tangerine text-vm-tangerine-foreground hover:bg-vm-tangerine/90"
              onClick={() => { setOpen(false); router.push("/search") }}
            >
              Browse products
            </Button>
          </div>
        ) : (
          <>
            {/* ── Items ── */}
            <ScrollArea className="flex-1">
              <div className="space-y-0 px-5 py-4">
                {items.map((item, i) => (
                  <React.Fragment key={item.id}>
                    <div className="flex gap-3 py-1">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium leading-snug">
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{item.store}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold">
                            {formatGHS(item.price * item.quantity)}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, -1)}
                              className="grid h-6 w-6 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-4 text-center text-sm font-medium tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, 1)}
                              className="grid h-6 w-6 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {i < items.length - 1 && <Separator className="my-3" />}
                  </React.Fragment>
                ))}
              </div>
            </ScrollArea>

            {/* ── Footer ── */}
            <div className="space-y-3 border-t border-border bg-card px-5 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})
                </span>
                <span className="text-base font-bold">{formatGHS(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Delivery fee calculated at checkout.
              </p>
              <Button
                className="w-full bg-vm-tangerine font-semibold text-vm-tangerine-foreground hover:bg-vm-tangerine/90"
                onClick={() => { setOpen(false); router.push("/checkout") }}
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
