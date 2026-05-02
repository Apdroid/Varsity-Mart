import apiClient, { type ApiResponse } from "../client"
import { ENDPOINTS } from "../endpoints"
import type { OrderFilters, CreateOrderRequest, UpdateOrderStatusRequest, PaginatedResponse } from "@/types/api"
import type { Order } from "@/types/models"

export const ordersService = {
  async getOrders(filters: OrderFilters = {}): Promise<PaginatedResponse<Order>> {
    const response = await apiClient.get(ENDPOINTS.ORDERS.LIST, { params: filters })
    return response.data
  },

  async getOrderById(id: string): Promise<ApiResponse<Order>> {
    const response = await apiClient.get(ENDPOINTS.ORDERS.DETAIL(id))
    return response.data
  },

  async createOrder(data: CreateOrderRequest): Promise<ApiResponse<Order>> {
    const response = await apiClient.post(ENDPOINTS.ORDERS.CREATE, data)
    return response.data
  },

  async updateOrderStatus(id: string, data: UpdateOrderStatusRequest): Promise<ApiResponse<Order>> {
    const response = await apiClient.patch(ENDPOINTS.ORDERS.UPDATE_STATUS(id), data)
    return response.data
  },

  async cancelOrder(id: string, reason: string): Promise<ApiResponse<Order>> {
    const response = await apiClient.post(ENDPOINTS.ORDERS.CANCEL(id), { reason })
    return response.data
  },

  async confirmDelivery(id: string): Promise<ApiResponse<Order>> {
    const response = await apiClient.post(ENDPOINTS.ORDERS.CONFIRM_DELIVERY(id))
    return response.data
  },

  async rateOrder(id: string, rating: number, review?: string): Promise<ApiResponse<Order>> {
    const response = await apiClient.post(ENDPOINTS.ORDERS.RATE(id), { rating, review })
    return response.data
  },

  async getMyOrders(filters: OrderFilters = {}): Promise<PaginatedResponse<Order>> {
    const response = await apiClient.get(ENDPOINTS.ORDERS.MY_ORDERS, { params: filters })
    return response.data
  },

  async getSellerOrders(filters: OrderFilters = {}): Promise<PaginatedResponse<Order>> {
    const response = await apiClient.get(ENDPOINTS.ORDERS.SELLER_ORDERS, { params: filters })
    return response.data
  },
}
