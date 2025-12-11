import apiClient, { type ApiResponse } from "../client"
import { ENDPOINTS } from "../endpoints"

interface UploadResponse {
  url: string
  filename: string
  size: number
}

export const uploadsService = {
  async uploadProductImages(files: File[]): Promise<ApiResponse<UploadResponse[]>> {
    const formData = new FormData()
    files.forEach((file) => formData.append("images", file))

    const response = await apiClient.post(ENDPOINTS.UPLOADS.PRODUCT_IMAGES, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data
  },

  async uploadKYCDocument(file: File, documentType: string): Promise<ApiResponse<UploadResponse>> {
    const formData = new FormData()
    formData.append("document", file)
    formData.append("type", documentType)

    const response = await apiClient.post(ENDPOINTS.UPLOADS.KYC_DOCUMENTS, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data
  },

  async uploadAvatar(file: File): Promise<ApiResponse<UploadResponse>> {
    const formData = new FormData()
    formData.append("avatar", file)

    const response = await apiClient.post(ENDPOINTS.UPLOADS.AVATAR, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data
  },
}
