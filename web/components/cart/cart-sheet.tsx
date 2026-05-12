"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShoppingCart, Loader2 } from "lucide-react"
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
import { useAuth } from "@/providers/auth-provider"
import { normalizeCartData, useCart, useRemoveFromCart, useUpdateCartItem } from "@/hooks/queries/use-cart"
import { toast } from "sonner"

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
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: cartData, isLoading: cartLoading } = useCart({ enabled: isAuthenticated })
  const updateCartItem = useUpdateCartItem()
  const removeFromCart = useRemoveFromCart()

  const cart = normalizeCartData(cartData?.data)
  const items = cart.items

  const updateQty = async (id: string, nextQuantity: number) => {
    if (nextQuantity < 1) return
    try {
      await updateCartItem.mutateAsync({
        itemId: id,
        data: { quantity: nextQuantity },
      })
    } catch {
      toast.error("Failed to update cart item")
    }
  }

  const removeItem = async (id: string) => {
    try {
      await removeFromCart.mutateAsync(id)
    } catch {
      toast.error("Failed to remove item from cart")
    }
  }

  const subtotal = cart.total
  const itemCount = cart.itemCount

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10" aria-label="Cart">
          <ShoppingCart className="size-6" strokeWidth={2.5} />
          {!authLoading && itemCount > 0 && (
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

        {!authLoading && !isAuthenticated ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-10 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-muted">
              <ShoppingBag className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">Sign in to view your cart</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Access your saved cart items and checkout quickly.
              </p>
            </div>
            <Button
              className="bg-vm-tangerine text-vm-tangerine-foreground hover:bg-vm-tangerine/90"
              onClick={() => { setOpen(false); router.push("/login?redirect=/checkout") }}
            >
              Sign in
            </Button>
          </div>
        ) : authLoading || cartLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
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
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-muted-foreground">
                            <ShoppingBag className="h-5 w-5" />
                          </div>
                        )}
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium leading-snug">
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.inStock ? "In stock" : "Out of stock"}
                            </p>
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
                            {formatGHS(item.subtotal)}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updateCartItem.isPending}
                              className="grid h-6 w-6 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-4 text-center text-sm font-medium tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, item.quantity + 1)}
                              disabled={updateCartItem.isPending}
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
