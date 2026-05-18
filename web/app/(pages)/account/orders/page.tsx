"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/providers/auth-provider"
import { useMyOrders, useMyFoodOrders } from "@/hooks/queries/use-orders"
import type { OrderStatus, FoodOrderStatus } from "@/lib/api/types"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatGHS(n: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 2,
  }).format(n)
}

function toNumber(value: number | string | undefined) {
  if (typeof value === "number") return value
  if (typeof value === "string") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

function getStatusColor(status: OrderStatus | FoodOrderStatus) {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-700"
    case "cancelled":
    case "refunded":
      return "bg-red-100 text-red-700"
    case "in_delivery":
    case "ready":
    case "preparing":
      return "bg-blue-100 text-blue-700"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function OrdersSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-lg" />
      ))}
    </div>
  )
}

export default function OrdersPage() {
  const router = useRouter()
  const { isLoading: authLoading, isAuthenticated } = useAuth()
  const [tab, setTab] = useState("products")

  const { data: ordersData, isLoading: ordersLoading } = useMyOrders()
  const { data: foodOrdersData, isLoading: foodOrdersLoading } = useMyFoodOrders()

  const orders = ordersData?.results || []
  const foodOrders = foodOrdersData?.data?.orders || []

  if (authLoading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isAuthenticated) {
    router.push("/login?redirect=/account/orders")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to account
          </Link>
        </div>

        <h1 className="mb-6 text-2xl font-bold">Your Orders</h1>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6 w-full">
            <TabsTrigger value="products" className="flex-1">
              Product Orders
            </TabsTrigger>
            <TabsTrigger value="food" className="flex-1">
              Food Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            {ordersLoading ? (
              <OrdersSkeleton />
            ) : orders.length === 0 ? (
              <div className="rounded-lg border bg-card p-8 text-center">
                <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h2 className="text-lg font-semibold">No orders yet</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  When you place an order, it will appear here
                </p>
                <Button asChild className="mt-4">
                  <Link href="/products">Browse Products</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  (() => {
                    const orderNumber = order.order_number || order.orderNumber || order.id
                    const createdAt = order.created_at || order.createdAt || new Date().toISOString()
                    const itemCount = order.quantity ?? order.items?.length ?? 1
                    const total = toNumber(order.total)
                    return (
                  <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className="block rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">Order #{orderNumber}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(createdAt)}</p>
                        <p className="mt-1 text-sm">
                          {itemCount} item{itemCount !== 1 ? "s" : ""} • {formatGHS(total)}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </div>
                  </Link>
                    )
                  })()
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="food">
            {foodOrdersLoading ? (
              <OrdersSkeleton />
            ) : foodOrders.length === 0 ? (
              <div className="rounded-lg border bg-card p-8 text-center">
                <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h2 className="text-lg font-semibold">No food orders yet</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  When you order from a restaurant, it will appear here
                </p>
                <Button asChild className="mt-4">
                  <Link href="/restaurants">Browse Restaurants</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {foodOrders.map((order) => (
                  (() => {
                    const orderId = order.id || order.orderId
                    const createdAt = order.createdAt || order.created_at || new Date().toISOString()
                    const restaurantName = order.restaurantName || order.restaurant?.name || "Restaurant"
                    const orderNumber = order.orderNumber || order.order_number || order.orderId
                    const total = toNumber(order.total)
                    return (
                  <Link
                    key={orderId}
                    href={`/orders/food/${orderId}`}
                    className="block rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{restaurantName}</p>
                        <p className="text-sm text-muted-foreground">
                          Order #{orderNumber} • {formatDate(createdAt)}
                        </p>
                        <p className="mt-1 text-sm">{formatGHS(total)}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </div>
                  </Link>
                    )
                  })()
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
