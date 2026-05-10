import apiClient, { type ApiResponse } from "../client"
import { ENDPOINTS } from "../endpoints"
import type { SubmitStudentKYCRequest, SubmitBusinessKYCRequest } from "@/types/api"
import type { KYCSubmission } from "@/types/models"

export const kycService = {
  async submitStudentKYC(data: SubmitStudentKYCRequest): Promise<ApiResponse<KYCSubmission>> {
    const response = await apiClient.post(ENDPOINTS.KYC.SUBMIT_STUDENT, data)
    return response.data
  },

  async submitBusinessKYC(data: SubmitBusinessKYCRequest): Promise<ApiResponse<KYCSubmission>> {
    const response = await apiClient.post(ENDPOINTS.KYC.SUBMIT_BUSINESS, data)
    return response.data
  },

  async getKYCStatus(): Promise<ApiResponse<KYCSubmission | null>> {
    const response = await apiClient.get(ENDPOINTS.KYC.STATUS)
    return response.data
  },
}
