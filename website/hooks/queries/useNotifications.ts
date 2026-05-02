"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/api/query-keys"
import { notificationsService } from "@/lib/api/services/notifications.service"

export function useNotifications(filters: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: queryKeys.notifications.list(),
    queryFn: () => notificationsService.getNotifications(filters),
    refetchInterval: 1000 * 60, // poll every minute
  })
}

export function useUnreadNotificationCount() {
  const { data } = useNotifications()
  return data?.data?.filter((n) => !n.isRead).length ?? 0
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (notificationId: string) => notificationsService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => notificationsService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all })
    },
  })
}

export function useNotificationSettings() {
  return useQuery({
    queryKey: [...queryKeys.notifications.all, "settings"],
    queryFn: () => notificationsService.getSettings(),
    staleTime: 1000 * 60 * 10,
  })
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (settings: Parameters<typeof notificationsService.updateSettings>[0]) =>
      notificationsService.updateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.notifications.all, "settings"] })
    },
  })
}
