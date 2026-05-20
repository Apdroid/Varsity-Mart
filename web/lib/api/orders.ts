import { api } from "./client"
import type {
  ApiResponse,
  CreateFoodOrderRequest,
  CreateOrderRequest,
  FoodOrder,
  Order,
  OrderFilters,
  Pagination,
  PaginatedList,
  RateFoodOrderRequest,
} from "./types"

function buildQueryString(params: object): string {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value))
    }
  })
  const query = searchParams.toString()
  return query ? `?${query}` : ""
}

export const ordersApi = {
  myOrders: (filters?: OrderFilters) =>
    api.get<ApiResponse<{ orders: Order[]; pagination: Pagination }>>(`/orders/my-orders/${buildQueryString(filters || {})}`),

  get: (orderId: string) =>
    api.get<ApiResponse<Order>>(`/orders/${orderId}/`),

  create: (data: CreateOrderRequest) =>
    api.post<ApiResponse<{
      orderId: string
      orderNumber: string
      total: number
      paymentUrl?: string
    }>>("/orders/", data),

  updateStatus: (orderId: string, status: string, notes?: string) =>
    api.patch<ApiResponse<Order>>(`/orders/${orderId}/status/`, { status, notes }),

  cancel: (orderId: string, reason?: string) =>
    api.post<ApiResponse<Order>>(`/orders/${orderId}/cancel/`, { reason }),

  confirmDelivery: (orderId: string) =>
    api.post<ApiResponse<Order>>(`/orders/${orderId}/confirm-delivery/`),

  rate: (orderId: string, rating: number, review?: string) =>
    api.post<ApiResponse<{ reviewId: string }>>(`/orders/${orderId}/rate/`, { rating, review }),

  sellerOrders: (filters?: OrderFilters) =>
    api.get<PaginatedList<Order>>(`/orders/seller-orders/${buildQueryString(filters || {})}`),
}

export const foodOrdersApi = {
  myOrders: (filters?: OrderFilters) =>
    api.get<ApiResponse<{ orders: FoodOrder[]; total: number }>>(`/food-orders/my-orders${buildQueryString(filters || {})}/`),

  get: (orderId: string) =>
    api.get<ApiResponse<FoodOrder>>(`/food-orders/${orderId}/`),

  create: (data: CreateFoodOrderRequest) =>
    api.post<ApiResponse<{
      orderId: string
      status: string
      subtotal: number
      deliveryFee: number
      serviceFee: number
      total: number
      estimatedDelivery: string
      paymentUrl: string
    }>>("/food-orders/", data),

  updateStatus: (orderId: string, status: string, estimatedDeliveryTime?: string) =>
    api.patch<ApiResponse<FoodOrder>>(`/food-orders/${orderId}/status`, { status, estimatedDeliveryTime }),

  confirmDelivery: (orderId: string) =>
    api.post<ApiResponse<FoodOrder>>(`/food-orders/${orderId}/confirm-delivery`),

  rate: (orderId: string, data: RateFoodOrderRequest) =>
    api.post<ApiResponse<{ reviewId: string }>>(`/food-orders/${orderId}/rate`, data),

  restaurantOrders: (filters?: OrderFilters) =>
    api.get<ApiResponse<{ orders: FoodOrder[]; total: number }>>(`/food-orders/restaurant-orders${buildQueryString(filters || {})}`),
}
