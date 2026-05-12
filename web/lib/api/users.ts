import { api, apiClientFormData } from "./client"
import type {
  ApiResponse,
  Notification,
  NotificationSettings,
  PaginatedList,
  PublicUser,
  User,
} from "./types"

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  phone?: string
  university?: string
  campus?: string
  isStudent?: boolean
  studentId?: string
  bio?: string
}

export const usersApi = {
  me: () =>
    api.get<ApiResponse<User>>("/users/me/"),

  update: (data: UpdateProfileRequest) =>
    api.patch<ApiResponse<User>>("/users/me/", data),

  updateWithAvatar: (formData: FormData) =>
    apiClientFormData<ApiResponse<User>>("/users/me/", formData, { method: "PUT" }),

  uploadAvatar: (formData: FormData) =>
    apiClientFormData<ApiResponse<{
      avatarUrl: string
      publicId: string
      width: number
      height: number
      format: string
      bytes: number
      folder: string
      uploadedAt: string
    }>>("/users/me/avatar/", formData, { method: "POST" }),

  getPublicProfile: (userId: string, fields?: "basic" | "extended" | "all") =>
    api.get<ApiResponse<PublicUser>>(`/users/${userId}/${fields ? `?fields=${fields}` : ""}`),
}

export const notificationsApi = {
  list: (page = 1, limit = 20, unreadOnly = false) =>
    api.get<PaginatedList<Notification>>(`/notifications/?page=${page}&limit=${limit}${unreadOnly ? "&unreadOnly=true" : ""}`),

  get: (notificationId: string) =>
    api.get<ApiResponse<Notification>>(`/notifications/${notificationId}/`),

  markAsRead: (notificationId: string) =>
    api.post<ApiResponse<null>>(`/notifications/${notificationId}/read/`),

  markAllAsRead: () =>
    api.post<ApiResponse<{ markedCount: number }>>("/notifications/read-all/"),

  getSettings: () =>
    api.get<ApiResponse<NotificationSettings>>("/notifications/settings/"),

  updateSettings: (data: Partial<NotificationSettings>) =>
    api.put<ApiResponse<NotificationSettings>>("/notifications/settings/", data),
}
