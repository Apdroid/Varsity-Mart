"use client"

import Link from "next/link"
import { ChevronRight, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useNotifications } from "@/hooks/queries/useNotifications"

export function NotificationsPageContent() {
  const { data, isLoading } = useNotifications()
  const mockNotifications = (data as any)?.data ?? []
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
        <Button variant="ghost" className="text-primary hover:text-primary/80">
          Mark all as read
        </Button>
      </div>

      {mockNotifications.length > 0 ? (
        <div className="space-y-2">
          {mockNotifications.map((notification: any) => (
            <div
              key={notification.id}
              className={cn(
                "flex items-start gap-4 p-4 rounded-xl border border-border transition-colors cursor-pointer",
                notification.isRead
                  ? "bg-background"
                  : "bg-primary/10 dark:bg-primary/20 border-primary/20 dark:border-primary/30",
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
                  {!notification.isRead && <span className="w-2 h-2 rounded-full bg-primary" />}
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
