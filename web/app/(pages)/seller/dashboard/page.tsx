"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { DollarSign, Loader2, Package, ShoppingBag, Star, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/providers/auth-provider"
import { useMyStore } from "@/hooks/queries/use-stores"
import { useMyProducts } from "@/hooks/queries/use-products"
import { useSellerOrders } from "@/hooks/queries/use-orders"

function formatGHS(n: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(n)
}

function StatCard({ title, value, icon: Icon, description }: {
  title: string
  value: string | number
  icon: React.ElementType
  description?: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  )
}

export default function SellerDashboardPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const { data: storeData, isLoading: storeLoading } = useMyStore()
  const { data: productsData, isLoading: productsLoading } = useMyProducts()
  const { data: ordersData, isLoading: ordersLoading } = useSellerOrders({ limit: 10 })

  const store = storeData
  const products = productsData?.products || []
  const orders = ordersData?.results || []
  const isLoading = authLoading || storeLoading || productsLoading || ordersLoading

  if (authLoading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isAuthenticated) {
    router.push("/login?redirect=/seller/dashboard")
    return null
  }

  if (!user?.hasStore && !storeLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-md rounded-lg bg-card p-8 text-center">
          <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Start Selling on VarsityMart</h1>
          <p className="mt-2 text-muted-foreground">
            Create your store and start reaching students on campus
          </p>
          <Button asChild className="mt-4 w-full">
            <Link href="/seller/create-store">Create Your Store</Link>
          </Button>
        </div>
      </div>
    )
  }

  const totalRevenue = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + o.total, 0)

  const pendingOrders = orders.filter((o) =>
    ["pending_payment", "payment_confirmed", "processing", "shipped"].includes(o.status)
  ).length

  const activeProducts = products.filter((p) => p.status.toLowerCase() === "active").length

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Seller Dashboard</h1>
          <p className="text-muted-foreground">{store?.storeName || "Your Store"}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/seller/products">Manage Products</Link>
          </Button>
          <Button asChild>
            <Link href="/seller/products/new">Add Product</Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Revenue"
              value={formatGHS(totalRevenue)}
              icon={DollarSign}
              description="From delivered orders"
            />
            <StatCard
              title="Pending Orders"
              value={pendingOrders}
              icon={Package}
              description="Awaiting action"
            />
            <StatCard
              title="Active Products"
              value={activeProducts}
              icon={ShoppingBag}
              description={`${products.length} total`}
            />
            <StatCard
              title="Store Rating"
              value={store ? Number.parseFloat(store.rating).toFixed(1) : "N/A"}
              icon={Star}
              description={`${store?.totalReviews || 0} reviews`}
            />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your latest customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    No orders yet. When customers purchase your products, they&apos;ll appear here.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div>
                          <p className="font-medium">Order #{order.orderNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} item{order.items.length !== 1 ? "s" : ""} • {formatGHS(order.total)}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/seller/orders/${order.id}`}>View</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Your best performing products</CardDescription>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    No products yet. Add your first product to start selling.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {products
                      .sort((a, b) => b.views - a.views)
                      .slice(0, 5)
                      .map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded bg-muted" />
                            <div>
                              <p className="font-medium line-clamp-1">{product.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {product.views} views • {product.likes} likes
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-medium">{formatGHS(Number(product.price))}</span>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {store && store.subscriptionStatus !== "active" && (
            <Card className="mt-6 border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-yellow-800">Subscription Expired</CardTitle>
                <CardDescription className="text-yellow-700">
                  Your store subscription has expired. Renew to keep your store visible to customers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="default">Renew Subscription</Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
