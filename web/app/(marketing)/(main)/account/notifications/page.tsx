"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Bell, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/providers/auth-provider"
import { useNotifications, useMarkAllNotificationsAsRead, useMarkNotificationAsRead } from "@/hooks/queries/use-user"
import type { NotificationType } from "@/lib/api/types"
import { cn } from "@/lib/utils"

function formatTimeAgo(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "order_update":
      return "📦"
    case "new_message":
      return "💬"
    case "promotion":
      return "🎉"
    case "price_drop":
      return "💰"
    case "new_follower":
      return "👋"
    case "review":
      return "⭐"
    default:
      return "🔔"
  }
}

function NotificationsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-lg" />
      ))}
    </div>
  )
}

export default function NotificationsPage() {
  const router = useRouter()
  const { isLoading: authLoading, isAuthenticated } = useAuth()
  const { data: notificationsData, isLoading } = useNotifications()
  const markAllAsReadMutation = useMarkAllNotificationsAsRead()
  const markAsReadMutation = useMarkNotificationAsRead()

  const notifications = notificationsData?.results || []
  const unreadCount = notifications.filter((n) => !n.isRead).length

  if (authLoading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isAuthenticated) {
    router.push("/login?redirect=/account/notifications")
    return null
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsReadMutation.mutateAsync()
  }

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsReadMutation.mutateAsync(notificationId)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to account
          </Link>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground">
                {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
            >
              <Check className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>

        {isLoading ? (
          <NotificationsSkeleton />
        ) : notifications.length === 0 ? (
          <div className="rounded-lg bg-card p-8 text-center">
            <Bell className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="text-lg font-semibold">No notifications yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You&apos;ll see notifications about orders, messages, and more here
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                className={cn(
                  "w-full rounded-lg bg-card p-4 text-left transition-colors hover:bg-muted/50",
                  !notification.isRead && "border-primary/20 bg-primary/5"
                )}
              >
                <div className="flex gap-3">
                  <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("font-medium", !notification.isRead && "text-primary")}>
                        {notification.title}
                      </p>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
