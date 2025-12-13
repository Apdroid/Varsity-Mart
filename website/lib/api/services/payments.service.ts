import apiClient, { type ApiResponse } from "../client"
import { ENDPOINTS } from "../endpoints"
import type { InitiatePaymentRequest, PaymentResponse } from "@/types/api"
import type { PaymentMethod, Wallet, Transaction } from "@/types/models"

export const paymentsService = {
  async initiatePayment(data: InitiatePaymentRequest): Promise<ApiResponse<PaymentResponse>> {
    const response = await apiClient.post(ENDPOINTS.PAYMENTS.INITIATE, data)
    return response.data
  },

  async verifyPayment(paymentId: string): Promise<ApiResponse<{ status: string; orderId?: string }>> {
    const response = await apiClient.get(ENDPOINTS.PAYMENTS.VERIFY(paymentId))
    return response.data
  },

  async getPaymentMethods(): Promise<ApiResponse<PaymentMethod[]>> {
    const response = await apiClient.get(ENDPOINTS.PAYMENTS.METHODS)
    return response.data
  },

  async addPaymentMethod(data: {
    type: "card" | "bank"
    token?: string
    bankCode?: string
    accountNumber?: string
  }): Promise<ApiResponse<PaymentMethod>> {
    const response = await apiClient.post(ENDPOINTS.PAYMENTS.ADD_METHOD, data)
    return response.data
  },

  async deletePaymentMethod(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete(`${ENDPOINTS.PAYMENTS.METHODS}/${id}`)
    return response.data
  },

  async setDefaultPaymentMethod(id: string): Promise<ApiResponse<PaymentMethod>> {
    const response = await apiClient.patch(`${ENDPOINTS.PAYMENTS.METHODS}/${id}/default`)
    return response.data
  },

  async getWallet(): Promise<ApiResponse<Wallet>> {
    const response = await apiClient.get(ENDPOINTS.PAYMENTS.WALLET)
    return response.data
  },

  async getTransactions(filters: { page?: number; limit?: number } = {}): Promise<ApiResponse<Transaction[]>> {
    const response = await apiClient.get(`${ENDPOINTS.PAYMENTS.WALLET}/transactions`, { params: filters })
    return response.data
  },

  async requestPayout(amount: number, paymentMethodId: string): Promise<ApiResponse<Transaction>> {
    const response = await apiClient.post(ENDPOINTS.PAYMENTS.REQUEST_PAYOUT, { amount, paymentMethodId })
    return response.data
  },
}
