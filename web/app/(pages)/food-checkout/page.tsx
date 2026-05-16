"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Check,
  CreditCard,
  Loader2,
  Lock,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  Smartphone,
  Store,
  Truck,
  UtensilsCrossed,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useCartStore, useCartTotal } from "@/store/cart-store"
import { useCreateFoodOrder } from "@/hooks/queries/use-orders"
import { useRestaurant } from "@/hooks/queries/use-restaurants"
import { useAuth } from "@/providers/auth-provider"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { CartLine } from "@/store/cart-store"
import type { CreateFoodOrderRequest } from "@/lib/api/types"

function formatGHS(n: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 2,
  }).format(n)
}

function StepHeader({ step, label }: { step: number; label: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-vm-tangerine text-xs font-bold text-white">
        {step}
      </div>
      <h2 className="text-base font-semibold">{label}</h2>
    </div>
  )
}

const MOMO_PROVIDERS = [
  {
    value: "mtn",
    label: "MTN MoMo",
    activeClass: "border-yellow-400 bg-yellow-50 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400",
  },
  {
    value: "vodafone",
    label: "Vodafone",
    activeClass: "border-red-400 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400",
  },
  {
    value: "airteltigo",
    label: "AirtelTigo",
    activeClass: "border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  },
]

function LineCustomizations({ line }: { line: CartLine }) {
  const tags: string[] = [
    ...(line.selectedSize ? [`${line.selectedSize.name}`] : []),
    ...(line.selectedProtein ? [`${line.selectedProtein.name}`] : []),
    ...line.selectedSides.map((s) => s.name),
    ...line.selectedModifiers,
  ]
  if (tags.length === 0 && !line.notes) return null
  return (
    <div className="mt-1 space-y-1">
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {line.notes && (
        <p className="text-[11px] italic text-muted-foreground">
          &ldquo;{line.notes}&rdquo;
        </p>
      )}
    </div>
  )
}

export default function FoodCheckoutPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const lines = useCartStore((s) => s.lines)
  const clearCart = useCartStore((s) => s.clearCart)
  const subtotal = useCartTotal()
  const createFoodOrder = useCreateFoodOrder()

  const restaurantId = lines[0]?.restaurantId ?? ""
  const restaurantName = lines[0]?.restaurantName ?? "Restaurant"

  const { data: restaurant } = useRestaurant(restaurantId)

  const [deliveryMethod, setDeliveryMethod] = useState<"campus_delivery" | "pickup">("campus_delivery")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [deliveryInstructions, setDeliveryInstructions] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"momo" | "card">("momo")
  const [momoNumber, setMomoNumber] = useState("")
  const [momoProvider, setMomoProvider] = useState("mtn")

  const restaurantDeliveryFee = restaurant?.deliveryFee ? Number(restaurant.deliveryFee) : 5
  const deliveryFee = deliveryMethod === "campus_delivery" ? restaurantDeliveryFee : 0
  const serviceFee = Math.round(subtotal * 0.02 * 100) / 100
  const total = subtotal + deliveryFee + serviceFee

  const minOrder = restaurant?.minOrder ?? 0
  const belowMinOrder = deliveryMethod === "campus_delivery" && subtotal < minOrder

  useEffect(() => {
    if (!authLoading && isAuthenticated && lines.length === 0) {
      router.push("/restaurants")
    }
  }, [lines.length, authLoading, isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (lines.length === 0) return

    if (deliveryMethod === "campus_delivery" && !deliveryAddress.trim()) {
      toast.error("Please enter a delivery address")
      return
    }
    if (deliveryMethod === "campus_delivery" && belowMinOrder) {
      toast.error(`Minimum order for delivery is ${formatGHS(minOrder)}`)
      return
    }
    if (paymentMethod === "momo" && !momoNumber.trim()) {
      toast.error("Please enter your mobile money number")
      return
    }

    try {
      const payload = {
        restaurantId,
        items: lines
          .filter((l) => l.restaurantId === restaurantId)
          .map((line) => ({
            itemId: line.itemId,
            quantity: line.quantity,
            selected_size: line.selectedSize ?? undefined,
            selected_protein: line.selectedProtein ?? undefined,
            selected_sides: line.selectedSides.length ? line.selectedSides : undefined,
            selected_modifiers: line.selectedModifiers.length ? line.selectedModifiers : undefined,
            notes: line.notes || undefined,
          })),
        deliveryAddress: deliveryMethod === "campus_delivery" ? deliveryAddress : undefined,
        deliveryInstructions: deliveryInstructions || undefined,
        paymentMethod: paymentMethod,
				deliveryMethod:deliveryMethod,
        // Passed through; backend uses these for MoMo prompt
        momoNumber: paymentMethod === "momo" ? momoNumber : undefined,
        momoProvider: paymentMethod === "momo" ? momoProvider : undefined,
      }

      const result = await createFoodOrder.mutateAsync(payload as unknown as CreateFoodOrderRequest)
      clearCart()

      if (result.data?.paymentUrl) {
        window.location.href = result.data.paymentUrl
      } else {
        toast.success("Order placed! Your food is being prepared.")
        router.push(`/food-orders/${result.data?.orderId}`)
      }
    } catch {
      toast.error("Failed to place order. Please try again.")
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-vm-tangerine/10">
            <Lock className="h-6 w-6 text-vm-tangerine" />
          </div>
          <h1 className="text-xl font-bold">Sign in to order food</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You need to be signed in to place a food order
          </p>
          <Button asChild className="mt-6 w-full rounded-full bg-vm-tangerine hover:bg-vm-tangerine/90">
            <Link href="/login?redirect=/food-checkout">Sign in</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (lines.length === 0) return null

  const SubmitButton = ({ className }: { className?: string }) => (
    <Button
      type="submit"
      disabled={createFoodOrder.isPending || belowMinOrder}
      className={cn(
        "w-full rounded-full bg-vm-tangerine py-6 text-base font-semibold text-white hover:bg-vm-tangerine/90 disabled:opacity-50",
        className
      )}
    >
      {createFoodOrder.isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Lock className="mr-2 h-4 w-4" />
      )}
      Place Order · {formatGHS(total)}
    </Button>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">

        {/* Back + title */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/restaurants"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Restaurants
          </Link>
          <span className="text-sm text-muted-foreground">
            {lines.length} item{lines.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Restaurant card */}
        <div className="mb-8 flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
            {restaurant?.logo ? (
              <Image src={restaurant.logo} alt={restaurantName} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <UtensilsCrossed className="h-6 w-6 text-muted-foreground/50" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Ordering from
            </p>
            <h1 className="truncate text-lg font-bold">{restaurantName}</h1>
            {restaurant?.category && (
              <p className="text-xs text-muted-foreground">{restaurant.category}</p>
            )}
          </div>
          {restaurant?.isOpen === false && (
            <span className="ml-auto shrink-0 rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
              Closed
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">

            {/* ── LEFT: Steps ── */}
            <div className="space-y-5">

              {/* Step 1 — Delivery Method */}
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <StepHeader step={1} label="Delivery Method" />
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      value: "campus_delivery" as const,
                      icon: Truck,
                      title: "Campus Delivery",
                      desc: restaurant?.deliveryTime
                        ? `Estimated ${restaurant.deliveryTime}`
                        : "Delivered to your hostel or campus location",
                      badge: formatGHS(restaurantDeliveryFee),
                      badgeClass: "text-vm-tangerine",
                    },
                    {
                      value: "pickup" as const,
                      icon: Store,
                      title: "Pickup",
                      desc: "Collect from the restaurant counter",
                      badge: "Free",
                      badgeClass: "text-emerald-600",
                    },
                  ].map(({ value, icon: Icon, title, desc, badge, badgeClass }) => {
                    const selected = deliveryMethod === value
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setDeliveryMethod(value)}
                        className={cn(
                          "relative flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all",
                          selected
                            ? "border-vm-tangerine bg-vm-tangerine/5"
                            : "border-border hover:border-vm-tangerine/40 hover:bg-muted/40"
                        )}
                      >
                        <div className={cn(
                          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                          selected ? "bg-vm-tangerine/15 text-vm-tangerine" : "bg-muted text-muted-foreground"
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold">{title}</span>
                            <span className={cn("shrink-0 text-xs font-bold", badgeClass)}>{badge}</span>
                          </div>
                          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{desc}</p>
                        </div>
                        {selected && (
                          <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-vm-tangerine">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Min order warning */}
                {belowMinOrder && (
                  <div className="mt-3 rounded-xl bg-amber-50 px-4 py-3 dark:bg-amber-950/30">
                    <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                      Minimum order for delivery is {formatGHS(minOrder)}. Add {formatGHS(minOrder - subtotal)} more to qualify.
                    </p>
                  </div>
                )}
              </div>

              {/* Step 2 — Delivery Details (conditional) */}
              {deliveryMethod === "campus_delivery" && (
                <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                  <StepHeader step={2} label="Delivery Details" />
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address" className="flex items-center gap-1.5 text-sm font-medium">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        Delivery Address
                      </Label>
                      <Input
                        id="address"
                        placeholder="e.g., Room 205, Unity Hall, KNUST"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="mt-1.5 h-11 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="instructions" className="flex items-center gap-1.5 text-sm font-medium">
                        <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                        Instructions
                        <span className="ml-1 font-normal text-muted-foreground">(optional)</span>
                      </Label>
                      <Textarea
                        id="instructions"
                        placeholder="e.g., Call when you arrive, leave at the gate…"
                        value={deliveryInstructions}
                        onChange={(e) => setDeliveryInstructions(e.target.value)}
                        className="mt-1.5 min-h-[80px] resize-none rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 — Payment */}
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <StepHeader step={deliveryMethod === "campus_delivery" ? 3 : 2} label="Payment Method" />

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      value: "momo" as const,
                      icon: Smartphone,
                      title: "Mobile Money",
                      desc: "MTN MoMo, Vodafone Cash, or AirtelTigo",
                    },
                    {
                      value: "card" as const,
                      icon: CreditCard,
                      title: "Debit / Credit Card",
                      desc: "Visa, Mastercard, and more",
                    },
                  ].map(({ value, icon: Icon, title, desc }) => {
                    const selected = paymentMethod === value
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setPaymentMethod(value)}
                        className={cn(
                          "relative flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all",
                          selected
                            ? "border-vm-tangerine bg-vm-tangerine/5"
                            : "border-border hover:border-vm-tangerine/40 hover:bg-muted/40"
                        )}
                      >
                        <div className={cn(
                          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                          selected ? "bg-vm-tangerine/15 text-vm-tangerine" : "bg-muted text-muted-foreground"
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{title}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
                        </div>
                        {selected && (
                          <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-vm-tangerine">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>

                {paymentMethod === "momo" && (
                  <div className="mt-5 space-y-4">
                    <div>
                      <p className="mb-2 text-sm font-medium">Network Provider</p>
                      <div className="grid grid-cols-3 gap-2">
                        {MOMO_PROVIDERS.map(({ value, label, activeClass }) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setMomoProvider(value)}
                            className={cn(
                              "rounded-xl border-2 py-2.5 text-xs font-semibold transition-all",
                              momoProvider === value
                                ? activeClass
                                : "border-border text-muted-foreground hover:bg-muted/40"
                            )}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="momoNumber" className="flex items-center gap-1.5 text-sm font-medium">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        Mobile Money Number
                      </Label>
                      <div className="relative mt-1.5">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                          +233
                        </span>
                        <Input
                          id="momoNumber"
                          type="tel"
                          placeholder="20 123 4567"
                          value={momoNumber}
                          onChange={(e) => setMomoNumber(e.target.value)}
                          className="h-11 rounded-xl pl-14"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile submit */}
              <div className="lg:hidden">
                <SubmitButton />
              </div>
            </div>

            {/* ── RIGHT: Order Summary ── */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold">Your Order</h2>
                  <Link
                    href="/restaurants"
                    className="text-xs font-medium text-vm-tangerine hover:underline"
                  >
                    Edit
                  </Link>
                </div>

                {/* Items */}
                <div className="max-h-72 space-y-3 overflow-y-auto pr-1 [scrollbar-width:thin]">
                  {lines.map((line) => (
                    <div key={line.lineId} className="flex gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                        {line.itemImage ? (
                          <Image
                            src={line.itemImage}
                            alt={line.itemName}
                            width={56}
                            height={56}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <UtensilsCrossed className="h-5 w-5 text-muted-foreground/40" />
                          </div>
                        )}
                        <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-vm-tangerine text-[10px] font-bold text-white">
                          {line.quantity}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <p className="line-clamp-1 text-sm font-medium">{line.itemName}</p>
                        <LineCustomizations line={line} />
                      </div>
                      <p className="shrink-0 pt-0.5 text-sm font-semibold">
                        {formatGHS(line.lineTotal)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Fee breakdown */}
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatGHS(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery fee</span>
                    <span className={cn("font-medium", deliveryFee === 0 && "text-emerald-600")}>
                      {deliveryFee === 0 ? "Free" : formatGHS(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service fee (2%)</span>
                    <span className="font-medium">{formatGHS(serviceFee)}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between">
                  <span className="font-bold">Total</span>
                  <span className="text-lg font-bold text-vm-tangerine">{formatGHS(total)}</span>
                </div>

                {/* Estimated delivery time */}
                {deliveryMethod === "campus_delivery" && restaurant?.deliveryTime && (
                  <div className="mt-3 flex items-center gap-2 rounded-xl bg-vm-tangerine/8 px-3.5 py-2.5">
                    <Truck className="h-4 w-4 shrink-0 text-vm-tangerine" />
                    <p className="text-xs font-medium text-vm-tangerine">
                      Estimated delivery: {restaurant.deliveryTime}
                    </p>
                  </div>
                )}

                {/* Desktop submit */}
                <div className="mt-5 hidden lg:block">
                  <SubmitButton />
                </div>

                {/* Trust badge */}
                <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-muted/60 px-3.5 py-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Payment is secured and your order starts immediately after confirmation.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  )
}
