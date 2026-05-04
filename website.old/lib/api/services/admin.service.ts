import apiClient, { type ApiResponse } from "../client"
import { ENDPOINTS } from "../endpoints"
import type { UserFilters, ListingFilters, DisputeFilters, ResolveDisputeRequest, PaginatedResponse } from "@/types/api"
import type { User, Product, DashboardStats, Dispute } from "@/types/models"

export const adminService = {
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    const response = await apiClient.get(ENDPOINTS.ADMIN.DASHBOARD)
    return response.data
  },

  async getUsers(filters: UserFilters = {}): Promise<PaginatedResponse<User>> {
    const response = await apiClient.get(ENDPOINTS.ADMIN.USERS, { params: filters })
    return response.data
  },

  async getUserById(id: string): Promise<ApiResponse<User>> {
    const response = await apiClient.get(ENDPOINTS.ADMIN.USER(id))
    return response.data
  },

  async suspendUser(userId: string, reason: string): Promise<ApiResponse<User>> {
    const response = await apiClient.post(ENDPOINTS.ADMIN.SUSPEND_USER(userId), { reason })
    return response.data
  },

  async unsuspendUser(userId: string): Promise<ApiResponse<User>> {
    const response = await apiClient.post(`${ENDPOINTS.ADMIN.USER(userId)}/unsuspend`)
    return response.data
  },

  async getListings(filters: ListingFilters = {}): Promise<PaginatedResponse<Product>> {
    const response = await apiClient.get(ENDPOINTS.ADMIN.LISTINGS, { params: filters })
    return response.data
  },

  async reviewListing(listingId: string, action: "approve" | "reject", reason?: string): Promise<ApiResponse<Product>> {
    const response = await apiClient.post(ENDPOINTS.ADMIN.REVIEW_LISTING(listingId), { action, reason })
    return response.data
  },

  async getDisputes(filters: DisputeFilters = {}): Promise<PaginatedResponse<Dispute>> {
    const response = await apiClient.get(ENDPOINTS.ADMIN.DISPUTES, { params: filters })
    return response.data
  },

  async getDisputeById(id: string): Promise<ApiResponse<Dispute>> {
    const response = await apiClient.get(`${ENDPOINTS.ADMIN.DISPUTES}/${id}`)
    return response.data
  },

  async resolveDispute(disputeId: string, data: ResolveDisputeRequest): Promise<ApiResponse<Dispute>> {
    const response = await apiClient.post(ENDPOINTS.ADMIN.RESOLVE_DISPUTE(disputeId), data)
    return response.data
  },
}
