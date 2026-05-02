import apiClient, { type ApiResponse } from "@/lib/api/client"
import { ENDPOINTS } from "@/lib/api/endpoints"
import type { Offer } from "@/types/models"

export interface CreateOfferRequest {
  amount: number
  message?: string
}

export interface CounterOfferRequest {
  amount: number
  message?: string
}

export const offersService = {
  async getMyOffers(): Promise<ApiResponse<Offer[]>> {
    const response = await apiClient.get(ENDPOINTS.OFFERS.MY_OFFERS)
    return response.data
  },

  async getProductOffers(productId: string): Promise<ApiResponse<Offer[]>> {
    const response = await apiClient.get(ENDPOINTS.OFFERS.PRODUCT_OFFERS(productId))
    return response.data
  },

  async createOffer(productId: string, data: CreateOfferRequest): Promise<ApiResponse<Offer>> {
    const response = await apiClient.post(ENDPOINTS.OFFERS.CREATE(productId), data)
    return response.data
  },

  async cancelOffer(offerId: string): Promise<ApiResponse<Offer>> {
    const response = await apiClient.post(ENDPOINTS.OFFERS.CANCEL(offerId))
    return response.data
  },

  async acceptOffer(offerId: string): Promise<ApiResponse<Offer>> {
    const response = await apiClient.post(ENDPOINTS.OFFERS.ACCEPT(offerId))
    return response.data
  },

  async declineOffer(offerId: string): Promise<ApiResponse<Offer>> {
    const response = await apiClient.post(ENDPOINTS.OFFERS.DECLINE(offerId))
    return response.data
  },

  async counterOffer(offerId: string, data: CounterOfferRequest): Promise<ApiResponse<Offer>> {
    const response = await apiClient.post(ENDPOINTS.OFFERS.COUNTER(offerId), data)
    return response.data
  },
}
