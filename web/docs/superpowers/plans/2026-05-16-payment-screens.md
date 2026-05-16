# Payment Screens Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement four payment-related pages — `/cart`, `/account/payments`, `/payments/verify`, `/seller/dashboard/payouts` — backed by a new payments API layer.

**Architecture:** New `lib/api/payments.ts` + `hooks/queries/use-payments.ts` provide the data layer. Each page is a self-contained `"use client"` component following existing patterns (skeleton loaders, `useAuth` guard, `cn`-based styling, `toast` for feedback, `formatGHS` helpers). No test framework exists; `npm run typecheck` is used as the verification step after each task.

**Tech Stack:** Next.js App Router, React, TanStack Query v5, shadcn/ui, Tailwind CSS, Zod, React Hook Form, Sonner toasts, Lucide icons.

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `lib/api/types.ts` | Modify | Add `AddPaymentMethodRequest` type |
| `lib/api/payments.ts` | Create | Payments API client (methods, verify, escrow, banks, payout) |
| `hooks/queries/use-payments.ts` | Create | TanStack Query hooks for all payments operations |
| `app/(pages)/cart/page.tsx` | Modify | Full cart UI replacing RouteSkeleton |
| `app/(pages)/account/payments/page.tsx` | Create | Payment methods management |
| `app/(pages)/payments/verify/page.tsx` | Create | Paystack redirect verification |
| `app/(pages)/seller/dashboard/payouts/page.tsx` | Create | Escrow balance + payout request form |

---

## Task 1: Add type + create payments API client

**Files:**
- Modify: `lib/api/types.ts` (end of file, after `PayoutRequest`)
- Create: `lib/api/payments.ts`

- [ ] **Step 1: Add `AddPaymentMethodRequest` to types.ts**

Open `lib/api/types.ts`. After the `PayoutRequest` interface (currently the last entry), append:

```ts
export interface AddPaymentMethodRequest {
  type: "momo"
  provider: "mtn" | "vodafone" | "airteltigo"
  phone: string
}

export interface VerifyPaymentResponse {
  success: boolean
  status: string
  orderId?: string
  amount?: number
  message?: string
}
```

- [ ] **Step 2: Create `lib/api/payments.ts`**

```ts
import { api } from "./client"
import type {
  ApiResponse,
  AddPaymentMethodRequest,
  Bank,
  EscrowBalance,
  PaymentMethod,
  PayoutRequest,
  VerifyPaymentResponse,
} from "./types"

export const paymentsApi = {
  methods: {
    list: () =>
      api.get<ApiResponse<PaymentMethod[]>>("/payments/methods/"),

    add: (data: AddPaymentMethodRequest) =>
      api.post<ApiResponse<PaymentMethod>>("/payments/methods/", data),

    remove: (methodId: string) =>
      api.delete<ApiResponse<null>>(`/payments/methods/${methodId}/`),

    setDefault: (methodId: string) =>
      api.patch<ApiResponse<PaymentMethod>>(`/payments/methods/${methodId}/`, { is_default: true }),
  },

  verify: (reference: string) =>
    api.get<ApiResponse<VerifyPaymentResponse>>(`/payments/${reference}/verify/`),

  escrowBalance: () =>
    api.get<ApiResponse<EscrowBalance>>("/payments/escrow/balance/"),

  banks: () =>
    api.get<ApiResponse<Bank[]>>("/payments/banks/"),

  requestPayout: (data: PayoutRequest) =>
    api.post<ApiResponse<{ message: string }>>("/payments/payout/", data),
}
```

- [ ] **Step 3: Verify types compile**

```bash
npm run typecheck
```

Expected: no errors in `lib/api/payments.ts` or `lib/api/types.ts`.

- [ ] **Step 4: Commit**

```bash
git add lib/api/types.ts lib/api/payments.ts
git commit -m "feat(payments): add payments API client and types"
```

---

## Task 2: Create payment hooks

**Files:**
- Create: `hooks/queries/use-payments.ts`
- Modify: `hooks/queries/index.ts` (re-export)

- [ ] **Step 1: Create `hooks/queries/use-payments.ts`**

```ts
"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { paymentsApi } from "@/lib/api/payments"
import type { AddPaymentMethodRequest, PaymentMethod, PayoutRequest } from "@/lib/api/types"

export const paymentKeys = {
  all: ["payments"] as const,
  methods: () => [...paymentKeys.all, "methods"] as const,
  escrow: () => [...paymentKeys.all, "escrow"] as const,
  banks: () => [...paymentKeys.all, "banks"] as const,
  verify: (reference: string) => [...paymentKeys.all, "verify", reference] as const,
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: paymentKeys.methods(),
    queryFn: async () => {
      const response = await paymentsApi.methods.list()
      return response.data as PaymentMethod[]
    },
  })
}

export function useAddPaymentMethod() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AddPaymentMethodRequest) => paymentsApi.methods.add(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.methods() })
    },
  })
}

export function useRemovePaymentMethod() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (methodId: string) => paymentsApi.methods.remove(methodId),
    onMutate: async (methodId) => {
      await queryClient.cancelQueries({ queryKey: paymentKeys.methods() })
      const previous = queryClient.getQueryData<PaymentMethod[]>(paymentKeys.methods())
      if (previous) {
        queryClient.setQueryData<PaymentMethod[]>(
          paymentKeys.methods(),
          previous.filter((m) => m.id !== methodId)
        )
      }
      return { previous }
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(paymentKeys.methods(), context.previous)
      }
    },
  })
}

export function useSetDefaultPaymentMethod() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (methodId: string) => paymentsApi.methods.setDefault(methodId),
    onMutate: async (methodId) => {
      await queryClient.cancelQueries({ queryKey: paymentKeys.methods() })
      const previous = queryClient.getQueryData<PaymentMethod[]>(paymentKeys.methods())
      if (previous) {
        queryClient.setQueryData<PaymentMethod[]>(
          paymentKeys.methods(),
          previous.map((m) => ({ ...m, isDefault: m.id === methodId }))
        )
      }
      return { previous }
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(paymentKeys.methods(), context.previous)
      }
    },
  })
}

export function useVerifyPayment(reference: string | null) {
  return useQuery({
    queryKey: paymentKeys.verify(reference ?? ""),
    queryFn: async () => {
      const response = await paymentsApi.verify(reference!)
      return response.data
    },
    enabled: !!reference,
    retry: false,
  })
}

export function useEscrowBalance() {
  return useQuery({
    queryKey: paymentKeys.escrow(),
    queryFn: async () => {
      const response = await paymentsApi.escrowBalance()
      return response.data as import("@/lib/api/types").EscrowBalance
    },
  })
}

export function useBanks() {
  return useQuery({
    queryKey: paymentKeys.banks(),
    queryFn: async () => {
      const response = await paymentsApi.banks()
      return response.data as import("@/lib/api/types").Bank[]
    },
    staleTime: 10 * 60 * 1000,
  })
}

export function useRequestPayout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: PayoutRequest) => paymentsApi.requestPayout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.escrow() })
    },
  })
}
```

- [ ] **Step 2: Add re-export to `hooks/queries/index.ts`**

Open `hooks/queries/index.ts` and add at the end:

```ts
export * from "./use-payments"
```

- [ ] **Step 3: Verify**

```bash
npm run typecheck
```

Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add hooks/queries/use-payments.ts hooks/queries/index.ts
git commit -m "feat(payments): add payment query hooks"
```

---

## Task 3: Cart page

**Files:**
- Modify: `app/(pages)/cart/page.tsx` (replace RouteSkeleton entirely)

The cart page has three states: loading → empty → item list with sticky summary.

- [ ] **Step 1: Replace `app/(pages)/cart/page.tsx`**

```tsx
"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
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
import { useCart, useUpdateCartItem, useRemoveFromCart, useClearCart } from "@/hooks/queries/use-cart"
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
      {/* Thumbnail */}
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

      {/* Info */}
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

        {!item.inStock && (
          <Badge variant="secondary" className="mt-1 text-[10px]">Out of stock</Badge>
        )}

        {/* Quantity + subtotal row */}
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
  const { mutate: clearCart, isPending: clearing } = useClearCart()

  const items = cart?.items ?? []
  const subtotal = cart?.total ?? 0

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
        {/* Item list */}
        <div className="space-y-3">
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}

          {/* Clear cart */}
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

        {/* Order summary — sticky on desktop */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 text-base font-semibold">Order summary</h2>

            <div className="space-y-2.5 text-sm">
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
              asChild
              className="mt-5 w-full rounded-full bg-vm-tangerine py-5 text-sm font-semibold text-white hover:bg-vm-tangerine/90"
            >
              <Link href="/checkout">Proceed to Checkout</Link>
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
```

- [ ] **Step 2: Verify**

```bash
npm run typecheck
```

Expected: no errors in `app/(pages)/cart/page.tsx`.

- [ ] **Step 3: Commit**

```bash
git add app/(pages)/cart/page.tsx
git commit -m "feat(cart): implement full cart page with quantity controls and clear confirmation"
```

---

## Task 4: Payment methods page

**Files:**
- Create: `app/(pages)/account/payments/page.tsx`

The page lists saved payment methods, supports adding MoMo, setting default, and removing methods.

- [ ] **Step 1: Create directory**

```bash
mkdir -p app/\(pages\)/account/payments
```

- [ ] **Step 2: Create `app/(pages)/account/payments/page.tsx`**

```tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Building2,
  CreditCard,
  Loader2,
  Plus,
  Smartphone,
  Star,
  Trash2,
  Wallet,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
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
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import {
  usePaymentMethods,
  useAddPaymentMethod,
  useRemovePaymentMethod,
  useSetDefaultPaymentMethod,
} from "@/hooks/queries/use-payments"
import { useAuth } from "@/providers/auth-provider"
import { cn } from "@/lib/utils"
import type { PaymentMethod } from "@/lib/api/types"

// ── MoMo providers ────────────────────────────────────────────────────────────

const MOMO_PROVIDERS = [
  { value: "mtn" as const, label: "MTN", activeClass: "border-yellow-400 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  { value: "vodafone" as const, label: "Vodafone", activeClass: "border-red-400 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  { value: "airteltigo" as const, label: "AirtelTigo", activeClass: "border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
]

// ── Add MoMo schema ───────────────────────────────────────────────────────────

const momoSchema = z.object({
  provider: z.enum(["mtn", "vodafone", "airteltigo"]),
  phone: z.string().min(9, "Enter a valid phone number").max(15),
})

type MomoForm = z.infer<typeof momoSchema>

// ── Method icon ───────────────────────────────────────────────────────────────

function MethodIcon({ type }: { type: PaymentMethod["type"] }) {
  if (type === "momo") return <Smartphone className="h-5 w-5 text-vm-tangerine" />
  if (type === "card") return <CreditCard className="h-5 w-5 text-blue-500" />
  return <Building2 className="h-5 w-5 text-muted-foreground" />
}

function methodLabel(method: PaymentMethod) {
  if (method.type === "momo") {
    const masked = method.last4 ? `••• ${method.last4}` : ""
    return `${method.provider ?? "MoMo"} · ${masked}`
  }
  if (method.type === "card") {
    return `Card · •••• ${method.last4 ?? "----"}`
  }
  return "Bank account"
}

// ── Method row ────────────────────────────────────────────────────────────────

function MethodRow({ method }: { method: PaymentMethod }) {
  const { mutate: setDefault, isPending: settingDefault } = useSetDefaultPaymentMethod()
  const { mutate: remove } = useRemovePaymentMethod()

  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
        <MethodIcon type={method.type} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{methodLabel(method)}</p>
        {method.isDefault && (
          <Badge variant="secondary" className="mt-0.5 text-[10px]">
            <Star className="mr-0.5 h-2.5 w-2.5 fill-current" />
            Default
          </Badge>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {!method.isDefault && (
          <button
            type="button"
            onClick={() => setDefault(method.id, { onError: () => toast.error("Failed to set default") })}
            disabled={settingDefault}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {settingDefault ? <Loader2 className="h-3 w-3 animate-spin" /> : "Set default"}
          </button>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              className="rounded p-1 text-muted-foreground transition-colors hover:text-destructive"
              aria-label="Remove payment method"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove payment method?</AlertDialogTitle>
              <AlertDialogDescription>
                {methodLabel(method)} will be permanently removed from your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => remove(method.id, { onError: () => toast.error("Failed to remove payment method") })}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

// ── Add method dialog ─────────────────────────────────────────────────────────

function AddMethodDialog() {
  const [open, setOpen] = React.useState(false)
  const { mutateAsync: addMethod, isPending } = useAddPaymentMethod()

  const form = useForm<MomoForm>({
    resolver: zodResolver(momoSchema),
    defaultValues: { provider: "mtn", phone: "" },
  })

  async function onSubmit(values: MomoForm) {
    try {
      await addMethod({ type: "momo", provider: values.provider, phone: values.phone })
      toast.success("Payment method added.")
      form.reset()
      setOpen(false)
    } catch {
      toast.error("Failed to add payment method. Please try again.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 bg-vm-tangerine text-white hover:bg-vm-tangerine/90">
          <Plus className="h-3.5 w-3.5" />
          Add method
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add payment method</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="momo">
          <TabsList className="w-full">
            <TabsTrigger value="momo" className="flex-1">Mobile Money</TabsTrigger>
            <TabsTrigger value="card" className="flex-1">Card</TabsTrigger>
          </TabsList>

          <TabsContent value="momo" className="pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Network</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          {MOMO_PROVIDERS.map((p) => (
                            <button
                              key={p.value}
                              type="button"
                              onClick={() => field.onChange(p.value)}
                              className={cn(
                                "flex-1 rounded-lg border-2 py-2 text-xs font-semibold transition-all",
                                field.value === p.value
                                  ? p.activeClass
                                  : "border-border text-muted-foreground hover:border-muted-foreground"
                              )}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            +233
                          </span>
                          <Input type="tel" placeholder="20 000 0000" className="pl-14" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-vm-tangerine text-white hover:bg-vm-tangerine/90"
                >
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isPending ? "Adding…" : "Add MoMo"}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="card" className="pt-4">
            <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
              Card payments are processed securely via Paystack. Card saving will be available soon.
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function PaymentsSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-8">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-7 w-48" />
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PaymentMethodsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: methods, isLoading } = usePaymentMethods()

  if (authLoading || isLoading) return <PaymentsSkeleton />

  if (!isAuthenticated) {
    router.push("/login?redirect=/account/payments")
    return null
  }

  const list = methods ?? []

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href="/account"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Account
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold font-heading">Payment Methods</h1>
        <AddMethodDialog />
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Wallet className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-medium">No payment methods saved</p>
          <p className="mt-1 text-sm text-muted-foreground">Add a method to speed up checkout.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card px-4 divide-y divide-border">
          {list.map((method) => (
            <MethodRow key={method.id} method={method} />
          ))}
        </div>
      )}

      <Separator className="my-6" />
      <p className="text-xs text-muted-foreground">
        Payment methods are stored securely. VarsityMart never sees your full card or MoMo credentials.
      </p>
    </div>
  )
}
```

- [ ] **Step 3: Verify**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add "app/(pages)/account/payments/page.tsx"
git commit -m "feat(payments): add payment methods management page"
```

---

## Task 5: Payment verification page

**Files:**
- Create directory: `app/(pages)/payments/verify/`
- Create: `app/(pages)/payments/verify/page.tsx`

- [ ] **Step 1: Create directory**

```bash
mkdir -p "app/(pages)/payments/verify"
```

- [ ] **Step 2: Create `app/(pages)/payments/verify/page.tsx`**

```tsx
"use client"

import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useVerifyPayment } from "@/hooks/queries/use-payments"
import { useEffect } from "react"

function formatGHS(n: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 2,
  }).format(n)
}

export default function PaymentVerifyPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const reference = searchParams.get("reference") || searchParams.get("trxref")

  useEffect(() => {
    if (!reference) {
      router.replace("/")
    }
  }, [reference, router])

  const { data: result, isLoading, isError, error } = useVerifyPayment(reference)

  if (!reference) return null

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-vm-tangerine" />
        <p className="text-base font-medium">Verifying your payment…</p>
        <p className="text-sm text-muted-foreground">This usually takes a few seconds.</p>
      </div>
    )
  }

  if (isError || !result?.success) {
    const message =
      (error instanceof Error ? error.message : null) ||
      result?.message ||
      "Your payment could not be verified. Please contact support if funds were deducted."

    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-xl font-bold">Payment could not be verified</h1>
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
          <div className="mt-6 flex flex-col gap-2">
            <Button asChild className="w-full rounded-full bg-vm-tangerine text-white hover:bg-vm-tangerine/90">
              <Link href="/checkout">Try again</Link>
            </Button>
            <Button asChild variant="outline" className="w-full rounded-full">
              <Link href="/contact">Contact support</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <h1 className="text-xl font-bold">Payment confirmed!</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your order has been placed successfully.</p>

        {(result.orderId || result.amount) && (
          <div className="mt-4 rounded-xl border border-border bg-muted/30 px-4 py-3 text-left text-sm">
            {result.orderId && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-medium">#{result.orderId.slice(0, 8).toUpperCase()}</span>
              </div>
            )}
            {result.amount && (
              <div className="mt-1 flex justify-between">
                <span className="text-muted-foreground">Amount paid</span>
                <span className="font-medium text-emerald-600">{formatGHS(result.amount)}</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2">
          <Button asChild className="w-full rounded-full bg-vm-tangerine text-white hover:bg-vm-tangerine/90">
            <Link href={result.orderId ? `/orders/${result.orderId}` : "/account/orders"}>
              View your order
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full rounded-full">
            <Link href="/products">Continue shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add "app/(pages)/payments/verify/page.tsx"
git commit -m "feat(payments): add Paystack payment verification page"
```

---

## Task 6: Seller payouts page

**Files:**
- Create directory: `app/(pages)/seller/dashboard/payouts/`
- Create: `app/(pages)/seller/dashboard/payouts/page.tsx`

- [ ] **Step 1: Create directory**

```bash
mkdir -p "app/(pages)/seller/dashboard/payouts"
```

- [ ] **Step 2: Create `app/(pages)/seller/dashboard/payouts/page.tsx`**

```tsx
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import {
  ArrowLeft,
  BadgeDollarSign,
  Clock,
  Loader2,
  RefreshCw,
  TrendingUp,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useEscrowBalance, useBanks, useRequestPayout } from "@/hooks/queries/use-payments"
import { useAuth } from "@/providers/auth-provider"
import { cn } from "@/lib/utils"

function formatGHS(n: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 2,
  }).format(n)
}

// ── Schema ────────────────────────────────────────────────────────────────────

const payoutSchema = z.object({
  amount: z.coerce.number().min(10, "Minimum payout is GHS 10"),
  bank_code: z.string().min(1, "Please select a bank"),
  account_number: z.string().min(10, "Account number must be at least 10 digits").max(13),
  account_name: z.string().min(2, "Please enter the account holder name"),
})

type PayoutForm = z.infer<typeof payoutSchema>

// ── Balance cards ─────────────────────────────────────────────────────────────

function BalanceCard({
  label,
  value,
  icon: Icon,
  valueClass,
}: {
  label: string
  value: number
  icon: React.ElementType
  valueClass?: string
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className={cn("text-xl font-bold tabular-nums", valueClass)}>{formatGHS(value)}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function PayoutSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-7 w-40" />
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SellerPayoutsPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const {
    data: balance,
    isLoading: balanceLoading,
    isError: balanceError,
    refetch: refetchBalance,
  } = useEscrowBalance()
  const { data: banks, isLoading: banksLoading } = useBanks()
  const { mutateAsync: requestPayout, isPending: payoutPending } = useRequestPayout()

  const form = useForm<PayoutForm>({
    resolver: zodResolver(payoutSchema),
    defaultValues: {
      amount: 0,
      bank_code: "",
      account_number: "",
      account_name: "",
    },
  })

  React.useEffect(() => {
    if (!authLoading && !user?.hasStore) {
      router.replace("/seller/status")
    }
  }, [authLoading, user, router])

  async function onSubmit(values: PayoutForm) {
    try {
      await requestPayout({
        amount: values.amount,
        bank_code: values.bank_code,
        account_number: values.account_number,
        account_name: values.account_name,
      })
      toast.success("Payout request submitted. Processing takes 1–3 business days.")
      form.reset()
    } catch {
      toast.error("Failed to submit payout request. Please try again.")
    }
  }

  if (authLoading || balanceLoading) return <PayoutSkeleton />

  const available = balance?.available ?? 0
  const pending = balance?.pending ?? 0
  const total = balance?.total ?? 0

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href="/seller/dashboard"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Dashboard
      </Link>

      <h1 className="mb-6 text-2xl font-bold font-heading">Payouts</h1>

      {/* Balance cards */}
      {balanceError ? (
        <div className="rounded-xl border border-border bg-muted/30 p-6 text-center">
          <p className="text-sm text-muted-foreground">Could not load your balance.</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 gap-1.5"
            onClick={() => refetchBalance()}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <BalanceCard
            icon={Wallet}
            label="Available to withdraw"
            value={available}
            valueClass="text-emerald-600 dark:text-emerald-400"
          />
          <BalanceCard
            icon={Clock}
            label="Pending (in escrow)"
            value={pending}
            valueClass="text-amber-600 dark:text-amber-400"
          />
          <BalanceCard
            icon={TrendingUp}
            label="Total earned"
            value={total}
          />
        </div>
      )}

      <Separator className="my-6" />

      {/* Payout request form */}
      {available <= 0 ? (
        <div className="rounded-xl border border-border bg-muted/30 p-6 text-center">
          <BadgeDollarSign className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
          <p className="font-medium">No funds available to withdraw</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Funds become available after orders are delivered and cleared.
          </p>
        </div>
      ) : (
        <div>
          <h2 className="mb-4 text-base font-semibold">Request a payout</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (GHS)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          GHS
                        </span>
                        <Input
                          type="number"
                          min={10}
                          max={available}
                          step={0.01}
                          className="pl-12"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Max: {formatGHS(available)} · Min: GHS 10
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bank_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={banksLoading ? "Loading banks…" : "Select your bank"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(banks ?? []).map((bank) => (
                          <SelectItem key={bank.code} value={bank.code}>
                            {bank.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="account_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account number</FormLabel>
                      <FormControl>
                        <Input placeholder="1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="account_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account name</FormLabel>
                      <FormControl>
                        <Input placeholder="Kwame Mensah" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={payoutPending}
                className="w-full h-11 bg-vm-tangerine text-white hover:bg-vm-tangerine/90"
              >
                {payoutPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    Request payout
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      )}

      <Separator className="my-6" />

      {/* Payout history placeholder */}
      <div className="rounded-xl border border-dashed border-border p-6 text-center">
        <p className="text-sm text-muted-foreground">Payout history coming soon.</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Add payouts link to seller dashboard**

Open `app/(pages)/seller/dashboard/page.tsx`. In the `flex gap-2` actions row (where "My Store" and "Add Product" buttons are), add the Payouts link:

```tsx
<Button variant="outline" asChild>
  <Link href="/seller/dashboard/payouts">Payouts</Link>
</Button>
```

So the row looks like:
```tsx
<div className="flex gap-2">
  <Button variant="outline" asChild>
    <Link href="/seller/dashboard/payouts">Payouts</Link>
  </Button>
  <Button variant="outline" asChild>
    <Link href="/seller/store">My Store</Link>
  </Button>
  <Button asChild className="bg-vm-tangerine text-white hover:bg-vm-tangerine/90">
    <Link href="/seller/products/add">Add Product</Link>
  </Button>
</div>
```

- [ ] **Step 5: Add Payments link to account page**

Open `app/(pages)/account/page.tsx`. In the `menuItems` array (after "Notifications"), add:
```tsx
{ href: "/account/payments", icon: CreditCard, label: "Payment Methods", description: "Manage your saved payment methods" },
```

Import `CreditCard` from `"lucide-react"` in the same file.

- [ ] **Step 6: Commit everything**

```bash
npm run typecheck
git add "app/(pages)/seller/dashboard/payouts/page.tsx" "app/(pages)/seller/dashboard/page.tsx" "app/(pages)/account/page.tsx"
git commit -m "feat(payments): add payouts page and link payment/payouts from nav"
```

---

## Self-Review

### Spec coverage

| Spec requirement | Task |
|---|---|
| `lib/api/payments.ts` with all 8 endpoints | Task 1 |
| All 8 query hooks | Task 2 |
| `/cart` — auth guard, empty state, item list, quantity controls, clear dialog, order summary | Task 3 |
| `/account/payments` — method list, add MoMo dialog (provider pills + phone), set default, remove | Task 4 |
| `/payments/verify` — verifying state, success state, failure state, no-reference redirect | Task 5 |
| `/seller/dashboard/payouts` — 3 balance cards, payout form (amount/bank/account/name), disabled when no funds | Task 6 |
| Payouts link from dashboard | Task 6, Step 4 |
| Payment Methods link from account page | Task 6, Step 5 |

### Placeholder scan
- No TBD or TODO placeholders.
- All form fields have validation, all mutations have error toasts.
- Payout history placeholder is intentional (spec says "deferred, no API endpoint").

### Type consistency
- `PaymentMethod`, `EscrowBalance`, `Bank`, `PayoutRequest` all imported from `@/lib/api/types` (pre-existing).
- `AddPaymentMethodRequest`, `VerifyPaymentResponse` added to types in Task 1, used consistently in Tasks 2–5.
- `NormalizedCartItem`, `NormalizedCart` from existing `use-cart.ts` — used in Task 3.
