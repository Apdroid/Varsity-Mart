import apiClient, { type ApiResponse } from "../client"
import { ENDPOINTS } from "../endpoints"
import type { PaginatedResponse } from "@/types/api"
import type { Notification } from "@/types/models"

interface NotificationSettings {
  email: boolean
  push: boolean
  orderUpdates: boolean
  messages: boolean
  promotions: boolean
}

export const notificationsService = {
  async getNotifications(filters: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<Notification>> {
    const response = await apiClient.get(ENDPOINTS.NOTIFICATIONS.LIST, { params: filters })
    return response.data
  },

  async markAsRead(notificationId: string): Promise<ApiResponse<Notification>> {
    const response = await apiClient.post(ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId))
    return response.data
  },

  async markAllAsRead(): Promise<ApiResponse<null>> {
    const response = await apiClient.post(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ)
    return response.data
  },

  async getSettings(): Promise<ApiResponse<NotificationSettings>> {
    const response = await apiClient.get(ENDPOINTS.NOTIFICATIONS.SETTINGS)
    return response.data
  },

  async updateSettings(settings: Partial<NotificationSettings>): Promise<ApiResponse<NotificationSettings>> {
    const response = await apiClient.patch(ENDPOINTS.NOTIFICATIONS.SETTINGS, settings)
    return response.data
  },
}
