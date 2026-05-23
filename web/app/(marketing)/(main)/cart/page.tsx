"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  ImageIcon,
  Loader2,
  Lock,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { useIsMutating } from "@tanstack/react-query"
import { useCart, useUpdateCartItem, useRemoveFromCart, useClearCart, cartKeys } from "@/hooks/queries/use-cart"
import type { NormalizedCartItem } from "@/hooks/queries/use-cart"
import { useAuth } from "@/providers/auth-provider"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

function formatGHS(n: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 2,
  }).format(n)
}

function CartSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Skeleton className="mb-8 h-7 w-32" />
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 rounded-2xl border border-border p-4">
              <Skeleton className="h-16 w-16 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    </div>
  )
}

function CartItemRow({ item }: { item: NormalizedCartItem }) {
  const { mutate: updateItem, isPending: updating } = useUpdateCartItem()
  const { mutate: removeItem, isPending: removing } = useRemoveFromCart()

  function increment() {
    updateItem({ itemId: item.id, data: { quantity: item.quantity + 1 } })
  }

  function decrement() {
    if (item.quantity <= 1) {
      removeItem(item.id, { onError: () => toast.error("Failed to remove item") })
    } else {
      updateItem({ itemId: item.id, data: { quantity: item.quantity - 1 } })
    }
  }

  const isBusy = updating || removing

  return (
    <div className={cn(
      "flex gap-4 rounded-2xl border border-border bg-card p-4 transition-opacity",
      isBusy && "opacity-60",
      !item.inStock && "opacity-70"
    )}>
      <Link href={`/products/${item.productId}`} className="shrink-0">
        <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-muted">
          {item.image ? (
            <Image src={item.image} alt={item.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
            </div>
          )}
        </div>
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/products/${item.productId}`}
            className="line-clamp-2 text-sm font-medium leading-snug hover:underline"
          >
            {item.name}
          </Link>
          <button
            type="button"
            onClick={() => removeItem(item.id, { onError: () => toast.error("Failed to remove item") })}
            disabled={removing}
            className="ml-2 shrink-0 rounded p-1 text-muted-foreground transition-colors hover:text-destructive"
            aria-label="Remove item"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        <p className="mt-0.5 text-sm text-muted-foreground">{formatGHS(item.unitPrice)}</p>

        {item.storeName && (
          <p className="text-xs text-muted-foreground">{item.storeName}</p>
        )}

        {!item.inStock && (
          <Badge variant="secondary" className="mt-1 text-[10px]">Out of stock</Badge>
        )}

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1 rounded-full border border-border bg-muted/40 px-1">
            <button
              type="button"
              onClick={decrement}
              disabled={isBusy}
              className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="min-w-[1.5rem] text-center text-sm font-medium tabular-nums">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={increment}
              disabled={isBusy || !item.inStock}
              className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <span className="text-sm font-semibold">{formatGHS(item.subtotal)}</span>
        </div>
      </div>
    </div>
  )
}

export default function CartPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: cart, isLoading: cartLoading } = useCart({ enabled: isAuthenticated })
  const router = useRouter()
  const { mutate: clearCart, isPending: clearing } = useClearCart()
  const isCartMutating = useIsMutating({ mutationKey: cartKeys.all }) > 0

  const items = cart?.items ?? []
  const subtotal = cart?.total ?? 0
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  if (authLoading || cartLoading) return <CartSkeleton />

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-vm-tangerine/10">
            <Lock className="h-6 w-6 text-vm-tangerine" />
          </div>
          <h1 className="text-xl font-bold">Sign in to view your cart</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You need to be signed in to see your saved items.
          </p>
          <Button asChild className="mt-6 w-full rounded-full bg-vm-tangerine hover:bg-vm-tangerine/90">
            <Link href="/login?redirect=/cart">Sign in</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <ShoppingCart className="h-6 w-6 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Find something you&apos;ll love and add it here.
          </p>
          <Button asChild className="mt-6 w-full rounded-full bg-vm-tangerine hover:bg-vm-tangerine/90">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold font-heading">
        Your Cart
        <span className="ml-2 text-base font-normal text-muted-foreground">
          ({items.length} {items.length === 1 ? "item" : "items"})
        </span>
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-3">
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}

          <div className="pt-1">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  disabled={clearing}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-destructive"
                >
                  {clearing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                  Clear cart
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear cart?</AlertDialogTitle>
                  <AlertDialogDescription>
                    All {items.length} items will be removed. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => clearCart(undefined, { onError: () => toast.error("Failed to clear cart") })}
                    className="bg-destructive text-white hover:bg-destructive/90"
                  >
                    Clear all items
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 text-base font-semibold">Order summary</h2>

            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Items</span>
                <span>{itemCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatGHS(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery fee</span>
                <span className="text-muted-foreground">Calculated at checkout</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service fee</span>
                <span className="text-muted-foreground">2% applied at checkout</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span>{formatGHS(subtotal)}</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">Delivery &amp; service fee added at checkout</p>

            <Button
              disabled={clearing || isCartMutating}
              onClick={() => router.push("/checkout")}
              className="mt-5 w-full h-11 bg-vm-tangerine text-white hover:bg-vm-tangerine/90"
            >
              <Lock className="h-4 w-4 mr-2" />
              Proceed to Checkout
            </Button>

            <Link
              href="/products"
              className="mt-3 block text-center text-xs text-muted-foreground hover:text-foreground"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
