import apiClient, { type ApiResponse } from "../client"
import { ENDPOINTS } from "../endpoints"
import type { PaginatedResponse } from "@/types/api"
import type { Store, Product } from "@/types/models"

interface StoreFilters {
  page?: number
  limit?: number
  isOpen?: boolean
  isVerified?: boolean
  search?: string
}

interface CreateStoreRequest {
  name: string
  description: string
  logo?: string
  banner?: string
  operatingHours?: Store["operatingHours"]
}

export const storesService = {
  async getStores(filters: StoreFilters = {}): Promise<PaginatedResponse<Store>> {
    const response = await apiClient.get(ENDPOINTS.STORES.LIST, { params: filters })
    return response.data
  },

  async getStoreById(id: string): Promise<ApiResponse<Store>> {
    const response = await apiClient.get(ENDPOINTS.STORES.DETAIL(id))
    return response.data
  },

  async createStore(data: CreateStoreRequest): Promise<ApiResponse<Store>> {
    const response = await apiClient.post(ENDPOINTS.STORES.CREATE, data)
    return response.data
  },

  async updateStore(id: string, data: Partial<CreateStoreRequest>): Promise<ApiResponse<Store>> {
    const response = await apiClient.patch(ENDPOINTS.STORES.UPDATE(id), data)
    return response.data
  },

  async getStoreProducts(
    storeId: string,
    filters: { page?: number; limit?: number } = {},
  ): Promise<PaginatedResponse<Product>> {
    const response = await apiClient.get(ENDPOINTS.STORES.PRODUCTS(storeId), { params: filters })
    return response.data
  },

  async getMyStore(): Promise<ApiResponse<Store>> {
    const response = await apiClient.get(ENDPOINTS.STORES.MY_STORE)
    return response.data
  },
}
