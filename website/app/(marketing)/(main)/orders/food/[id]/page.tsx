"use client"

import { use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Clock, Loader2, MapPin, ShoppingBag, Truck, UtensilsCrossed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/providers/auth-provider"
import { useFoodOrder, useConfirmFoodOrderDelivery } from "@/hooks/queries/use-orders"
import type { FoodOrderStatus } from "@/lib/api/types"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type Props = {
  params: Promise<{ id: string }>
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GH", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function formatGHS(n: number | string) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 2,
  }).format(typeof n === "string" ? parseFloat(n) : n)
}

const ORDER_STEPS: { status: FoodOrderStatus; label: string; icon: React.ElementType }[] = [
  { status: "pending_payment", label: "Order Placed", icon: ShoppingBag },
  { status: "confirmed", label: "Confirmed", icon: Check },
  { status: "preparing", label: "Preparing", icon: UtensilsCrossed },
  { status: "ready", label: "Ready", icon: Check },
  { status: "in_delivery", label: "On the Way", icon: Truck },
  { status: "delivered", label: "Delivered", icon: Check },
]

function getStepIndex(status: FoodOrderStatus): number {
  const idx = ORDER_STEPS.findIndex((s) => s.status === status)
  return idx >= 0 ? idx : 0
}

function OrderSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-32 w-full rounded-lg" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  )
}

function FoodOrderContent({ id }: { id: string }) {
  const router = useRouter()
  const { isLoading: authLoading, isAuthenticated } = useAuth()
  const { data: orderData, isLoading, error } = useFoodOrder(id)
  const confirmDeliveryMutation = useConfirmFoodOrderDelivery()

  const order = orderData?.data

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <OrderSkeleton />
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    router.push(`/login?redirect=/orders/food/${id}`)
    return null
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-md rounded-lg bg-card p-8 text-center">
          <h1 className="text-2xl font-bold">Order not found</h1>
          <p className="mt-2 text-muted-foreground">
            This order doesn&apos;t exist or you don&apos;t have permission to view it
          </p>
          <Button asChild className="mt-4">
            <Link href="/account/orders">View your orders</Link>
          </Button>
        </div>
      </div>
    )
  }

  const currentStepIndex = getStepIndex(order.status)
  const isCancelled = order.status === "cancelled"
  const canConfirmDelivery = order.status === "in_delivery"

  const restaurantName = order.restaurant?.name || order.restaurantName || "Restaurant"
  const restaurantPhone = order.restaurant?.phone
  const deliveryFee = order.delivery_fee ?? order.deliveryFee
  const createdAt = order.createdAt || order.created_at || ""

  const handleConfirmDelivery = async () => {
    try {
      await confirmDeliveryMutation.mutateAsync(order.id)
      toast.success("Delivery confirmed!")
    } catch {
      toast.error("Failed to confirm delivery")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to orders
          </Link>
        </div>

        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Order #{order.id}</h1>
            <p className="text-muted-foreground">Placed on {formatDate(createdAt)}</p>
          </div>
        </div>

        {!isCancelled && (
          <div className="mb-8 rounded-lg bg-card p-6">
            <h2 className="mb-4 font-semibold">Order Status</h2>
            <div className="relative">
              <div className="flex justify-between">
                {ORDER_STEPS.map((step, idx) => {
                  const isActive = idx <= currentStepIndex
                  const isCurrent = idx === currentStepIndex
                  return (
                    <div key={step.status} className="flex flex-col items-center">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                          isActive
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted bg-muted text-muted-foreground"
                        )}
                      >
                        <step.icon className="h-5 w-5" />
                      </div>
                      <span
                        className={cn(
                          "mt-2 text-xs text-center max-w-[60px]",
                          isCurrent ? "font-medium text-primary" : "text-muted-foreground"
                        )}
                      >
                        {step.label}
                      </span>
                    </div>
                  )
                })}
              </div>
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-muted -z-10">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${(currentStepIndex / (ORDER_STEPS.length - 1)) * 100}%` }}
                />
              </div>
            </div>

            {canConfirmDelivery && (
              <div className="mt-6">
                <Button
                  className="w-full"
                  onClick={handleConfirmDelivery}
                  disabled={confirmDeliveryMutation.isPending}
                >
                  {confirmDeliveryMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Confirm Delivery Received
                </Button>
              </div>
            )}
          </div>
        )}

        {isCancelled && (
          <div className="mb-8 rounded-lg border-destructive/20 bg-destructive/5 p-6 text-center">
            <p className="font-medium text-destructive">This order has been cancelled</p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg bg-card p-6">
            <h2 className="mb-4 font-semibold">Order Items</h2>
            <div className="space-y-4">
              {(order.items ?? []).map((item, idx) => (
                <div key={item.itemId ?? item.id ?? idx} className="flex gap-3">
                  {(item.image ?? item.menuItem?.image) ? (
                    <img
                      src={item.image ?? item.menuItem?.image}
                      alt={item.name ?? item.menuItem?.name}
                      className="h-16 w-16 rounded-lg object-cover bg-muted"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-muted" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium line-clamp-1">{item.name ?? item.menuItem?.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    {item.specialInstructions && (
                      <p className="text-xs text-muted-foreground italic">{item.specialInstructions}</p>
                    )}
                    <p className="text-sm font-medium">
                      {formatGHS(item.price ?? item.unitPrice ?? 0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2 text-sm">
              {order.subtotal !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatGHS(order.subtotal)}</span>
                </div>
              )}
              {deliveryFee !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>
                    {parseFloat(String(deliveryFee)) === 0
                      ? "Free"
                      : formatGHS(deliveryFee)}
                  </span>
                </div>
              )}
              {order.serviceFee !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span>{formatGHS(order.serviceFee)}</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatGHS(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg bg-card p-6">
              <h2 className="mb-4 font-semibold">Delivery Details</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {order.deliveryMethod === "pickup" ? "Pickup" : "Delivery Address"}
                    </p>
                    <p className="text-muted-foreground">
                      {order.deliveryAddress || "Pickup from restaurant"}
                    </p>
                  </div>
                </div>
                {order.deliveryInstructions && (
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Instructions</p>
                      <p className="text-muted-foreground">{order.deliveryInstructions}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg bg-card p-6">
              <h2 className="mb-4 font-semibold">Restaurant</h2>
              <div className="flex items-center gap-3">
                {order.restaurant?.logo || order.restaurantLogo ? (
                  <img
                    src={order.restaurant?.logo ?? order.restaurantLogo}
                    alt={restaurantName}
                    className="h-12 w-12 rounded-full object-cover bg-muted"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-muted" />
                )}
                <div>
                  <p className="font-medium">{restaurantName}</p>
                  {restaurantPhone && (
                    <p className="text-sm text-muted-foreground">{restaurantPhone}</p>
                  )}
                </div>
              </div>
            </div>

            {(order.timeline?.length ?? 0) > 0 && (
              <div className="rounded-lg bg-card p-6">
                <h2 className="mb-4 font-semibold">Timeline</h2>
                <div className="space-y-4">
                  {(order.timeline ?? []).map((entry, idx) => (
                    <div key={idx} className="flex gap-3 text-sm">
                      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <div>
                        <p className="font-medium capitalize">{entry.status.replace(/_/g, " ")}</p>
                        <p className="text-muted-foreground">{formatDate(entry.timestamp)}</p>
                        {entry.description && (
                          <p className="mt-1 text-muted-foreground">{entry.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FoodOrderPage({ params }: Props) {
  const { id } = use(params)
  return <FoodOrderContent id={id} />
}
