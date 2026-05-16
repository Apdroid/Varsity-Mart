"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, CreditCard, LogOut, Package, Settings, ShoppingBag, Store, User, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/providers/auth-provider"
import { useMyOrders, useMyFoodOrders } from "@/hooks/queries/use-orders"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function AccountPage() {
  const router = useRouter()
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const { data: ordersData } = useMyOrders({ limit: 3 })
  const { data: foodOrdersData } = useMyFoodOrders({ limit: 3 })

  const recentOrders = ordersData?.results || []
  const recentFoodOrders = foodOrdersData?.data?.orders || []

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    router.push("/login?redirect=/account")
    return null
  }

  const menuItems = [
    { href: "/account/orders", icon: Package, label: "Orders", description: "View your order history" },
    { href: "/account/settings", icon: Settings, label: "Settings", description: "Manage your account" },
    { href: "/account/notifications", icon: Bell, label: "Notifications", description: "View your notifications" },
    { href: "/account/payments", icon: CreditCard, label: "Payment Methods", description: "Manage your saved payment methods" },
    ...(user.hasStore ? [{ href: "/seller/dashboard", icon: Store, label: "Seller Dashboard", description: "Manage your store" }] : []),
    ...(user.hasRestaurant ? [{ href: "/restaurant/dashboard", icon: ShoppingBag, label: "Restaurant Dashboard", description: "Manage your restaurant" }] : []),
  ]

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar || user.avatarUrl} alt={user.firstName} />
            <AvatarFallback className="text-2xl">
              {user.firstName[0]}{user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            {user.isVerified && (
              <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                Verified
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          ))}
        </div>

        {(recentOrders.length > 0 || recentFoodOrders.length > 0) && (
          <>
            <Separator className="my-8" />
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent Orders</h2>
                <Link href="/account/orders" className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {recentOrders.slice(0, 3).map((order) => (
                  <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">Order #{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                    </div>
                    <span className="rounded-full bg-muted px-3 py-1 text-sm capitalize">
                      {order.status.replace("_", " ")}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator className="my-8" />

        <Button
          variant="outline"
          className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
