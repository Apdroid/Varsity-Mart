import { create } from "zustand"
import type { Notification } from "@/types/models"

interface NotificationState {
  notifications: Notification[]
  unreadCount: number

  // Actions
  setNotifications: (notifications: Notification[]) => void
  addNotification: (notification: Notification) => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  clearAll: () => void
  setUnreadCount: (count: number) => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
    })),

  markAsRead: (notificationId) =>
    set((state) => {
      const notification = state.notifications.find((n) => n.id === notificationId)
      const wasUnread = notification && !notification.isRead

      return {
        notifications: state.notifications.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
        unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount,
      }
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),

  clearAll: () => set({ notifications: [], unreadCount: 0 }),

  setUnreadCount: (count) => set({ unreadCount: count }),
}))
