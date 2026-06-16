"use client"

import { use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Clock, Loader2, MapPin, Package, Phone, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/providers/auth-provider"
import { useOrder, useConfirmOrderDelivery, useCancelOrder } from "@/hooks/queries/use-orders"
import type { OrderStatus } from "@/lib/api/types"
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

const ORDER_STEPS: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: "pending_payment", label: "Order Placed", icon: Package },
  { status: "payment_confirmed", label: "Payment Confirmed", icon: Check },
  { status: "processing", label: "Processing", icon: Clock },
  { status: "shipped", label: "Shipped", icon: Truck },
  { status: "in_delivery", label: "Out for Delivery", icon: Truck },
  { status: "delivered", label: "Delivered", icon: Check },
]

function getStepIndex(status: OrderStatus): number {
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

function OrderContent({ id }: { id: string }) {
  const router = useRouter()
  const { isLoading: authLoading, isAuthenticated } = useAuth()
  const { data: orderData, isLoading, error } = useOrder(id)
  const confirmDeliveryMutation = useConfirmOrderDelivery()
  const cancelOrderMutation = useCancelOrder()

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
    router.push(`/login?redirect=/orders/${id}`)
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
  const isCancelled = order.status === "cancelled" || order.status === "refunded"
  const canConfirmDelivery = order.status === "in_delivery"
  const canCancel = ["pending_payment", "payment_confirmed", "processing"].includes(order.status)

  const handleConfirmDelivery = async () => {
    try {
      await confirmDeliveryMutation.mutateAsync(order.id)
      toast.success("Delivery confirmed!")
    } catch {
      toast.error("Failed to confirm delivery")
    }
  }

  const handleCancel = async () => {
    try {
      await cancelOrderMutation.mutateAsync({ orderId: order.id })
      toast.success("Order cancelled")
    } catch {
      toast.error("Failed to cancel order")
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
            <h1 className="text-2xl font-bold">Order #{order.order_number || order.orderNumber}</h1>
            <p className="text-muted-foreground">Placed on {formatDate(order.created_at || order.createdAt || "")}</p>
          </div>
          {canCancel && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="text-destructive hover:bg-destructive/10"
                  disabled={cancelOrderMutation.isPending}
                >
                  Cancel Order
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will cancel order #{order.order_number || order.orderNumber}. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep order</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancel}
                    className="bg-destructive text-white hover:bg-destructive/90"
                  >
                    Cancel order
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
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
            <p className="font-medium text-destructive">
              This order has been {order.status === "refunded" ? "refunded" : "cancelled"}
            </p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg bg-card p-6">
            <h2 className="mb-4 font-semibold">Order Items</h2>
            <div className="space-y-4">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="h-16 w-16 rounded-lg bg-muted" />
                    <div className="flex-1">
                      <p className="font-medium line-clamp-1">{item.product.title}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium">{formatGHS(item.subtotal)}</p>
                    </div>
                  </div>
                ))
              ) : order.product ? (
                <div className="flex gap-3">
                  {order.product.image && (
                    <img
                      src={order.product.image}
                      alt={order.product.title}
                      className="h-16 w-16 rounded-lg object-cover bg-muted"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium line-clamp-1">{order.product.title}</p>
                    <p className="text-sm text-muted-foreground">Qty: {order.quantity ?? 1}</p>
                    <p className="text-sm font-medium">{formatGHS(order.subtotal)}</p>
                  </div>
                </div>
              ) : null}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatGHS(order.subtotal)}</span>
              </div>
              {(order.delivery_fee ?? order.deliveryFee) !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>
                    {parseFloat(String(order.delivery_fee ?? order.deliveryFee ?? 0)) === 0
                      ? "Free"
                      : formatGHS(order.delivery_fee ?? order.deliveryFee ?? 0)}
                  </span>
                </div>
              )}
              {(order.service_fee ?? order.serviceFee) !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span>{formatGHS(order.service_fee ?? order.serviceFee ?? 0)}</span>
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
                      {(order.delivery_method ?? order.deliveryMethod) === "pickup" ? "Pickup" : "Delivery Address"}
                    </p>
                    <p className="text-muted-foreground">
                      {order.delivery_address || order.deliveryAddress || "Pickup from seller"}
                    </p>
                  </div>
                </div>
                {(order.delivery_instructions || order.deliveryInstructions) && (
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Instructions</p>
                      <p className="text-muted-foreground">{order.delivery_instructions || order.deliveryInstructions}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg bg-card p-6">
              <h2 className="mb-4 font-semibold">Seller</h2>
                <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-muted" />
                <div>
                  <p className="font-medium">
                    {[order.seller.firstName, order.seller.lastName].filter(Boolean).join(" ").trim() || order.seller.name}
                  </p>
                  <Link
                    href={`/messages?user=${order.seller.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    Contact seller
                  </Link>
                </div>
              </div>
            </div>

            {(order.timeline?.length ?? 0) > 0 && (
              <div className="rounded-lg bg-card p-6">
                <h2 className="mb-4 font-semibold">Timeline</h2>
                <div className="space-y-4">
                  {(order.timeline ?? []).map((entry, idx) => (
                    <div key={idx} className="flex gap-3 text-sm">
                      <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                      <div>
                        <p className="font-medium capitalize">{entry.status.replace(/_/g, " ")}</p>
                        <p className="text-muted-foreground">{formatDate(entry.timestamp)}</p>
                        {(entry.description || entry.note) && (
                          <p className="mt-1 text-muted-foreground">{entry.description || entry.note}</p>
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

export default function OrderPage({ params }: Props) {
  const { id } = use(params)
  return <OrderContent id={id} />
}
