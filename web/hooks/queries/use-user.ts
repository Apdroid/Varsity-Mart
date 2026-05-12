"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { usersApi, notificationsApi, type UpdateProfileRequest } from "@/lib/api/users"

export const userKeys = {
  all: ["users"] as const,
  me: () => [...userKeys.all, "me"] as const,
  profile: (userId: string) => [...userKeys.all, "profile", userId] as const,
}

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (page?: number) => [...notificationKeys.all, "list", page] as const,
  detail: (id: string) => [...notificationKeys.all, "detail", id] as const,
  settings: () => [...notificationKeys.all, "settings"] as const,
}

export function useCurrentUser(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: () => usersApi.me(),
    enabled: options?.enabled ?? true,
  })
}

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: userKeys.profile(userId),
    queryFn: () => usersApi.getPublicProfile(userId),
    enabled: !!userId,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => usersApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
    },
  })
}

export function useUploadAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) => usersApi.uploadAvatar(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
    },
  })
}

export function useNotifications(page = 1, limit = 20, unreadOnly = false) {
  return useQuery({
    queryKey: notificationKeys.list(page),
    queryFn: () => notificationsApi.list(page, limit, unreadOnly),
  })
}

export function useNotification(notificationId: string) {
  return useQuery({
    queryKey: notificationKeys.detail(notificationId),
    queryFn: () => notificationsApi.get(notificationId),
    enabled: !!notificationId,
  })
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: string) => notificationsApi.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })
}

export function useNotificationSettings() {
  return useQuery({
    queryKey: notificationKeys.settings(),
    queryFn: () => notificationsApi.getSettings(),
  })
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Parameters<typeof notificationsApi.updateSettings>[0]) =>
      notificationsApi.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.settings() })
    },
  })
}
