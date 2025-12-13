"use client"

import Link from "next/link"
import { ChevronRight, Package, MessageCircle, CreditCard, Bell, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const mockNotifications = [
  {
    id: "1",
    type: "order_update",
    title: "Order Shipped",
    body: "Your order VM-2024-002 has been shipped and is on its way!",
    time: "2 minutes ago",
    isRead: false,
    icon: Package,
    iconColor: "text-blue-600 bg-blue-100 dark:bg-blue-950",
  },
  {
    id: "2",
    type: "new_message",
    title: "New Message",
    body: "John M. sent you a message about MacBook Pro",
    time: "15 minutes ago",
    isRead: false,
    icon: MessageCircle,
    iconColor: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950",
  },
  {
    id: "3",
    type: "payment",
    title: "Payment Received",
    body: "You received GH₵650 for your order VM-2024-001",
    time: "1 hour ago",
    isRead: true,
    icon: CreditCard,
    iconColor: "text-green-600 bg-green-100 dark:bg-green-950",
  },
  {
    id: "4",
    type: "order_update",
    title: "Order Delivered",
    body: "Your order VM-2024-001 has been delivered successfully",
    time: "2 hours ago",
    isRead: true,
    icon: CheckCircle,
    iconColor: "text-green-600 bg-green-100 dark:bg-green-950",
  },
  {
    id: "5",
    type: "system",
    title: "Complete Your Profile",
    body: "Add a profile photo and verify your phone number to increase trust",
    time: "1 day ago",
    isRead: true,
    icon: AlertCircle,
    iconColor: "text-yellow-600 bg-yellow-100 dark:bg-yellow-950",
  },
]

export function NotificationsPageContent() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Notifications</span>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
        <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700">
          Mark all as read
        </Button>
      </div>

      {mockNotifications.length > 0 ? (
        <div className="space-y-2">
          {mockNotifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "flex items-start gap-4 p-4 rounded-xl border border-border transition-colors cursor-pointer",
                notification.isRead
                  ? "bg-background"
                  : "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900",
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full shrink-0",
                  notification.iconColor,
                )}
              >
                <notification.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-foreground">{notification.title}</h3>
                  {!notification.isRead && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{notification.body}</p>
                <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg text-foreground mb-2">No notifications</h3>
          <p className="text-muted-foreground">You&apos;re all caught up!</p>
        </div>
      )}
    </div>
  )
}
