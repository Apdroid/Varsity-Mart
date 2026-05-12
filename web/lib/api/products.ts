import { api, apiClientFormData } from "./client"
import type {
  ApiResponse,
  Product,
  ProductDetail,
  ProductFilters,
  ProductsListResponse,
  ReviewsResponse,
  CreateProductRequest,
  CreateReviewRequest,
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

export const productsApi = {
  list: (filters?: ProductFilters) =>
    api.get<ProductsListResponse>(`/products/${buildQueryString(filters || {})}`),

  get: (id: string) =>
    api.get<ApiResponse<ProductDetail>>(`/products/${id}/`),

  myProducts: (filters?: ProductFilters) =>
    api.get<ProductsListResponse>(`/products/my-products/${buildQueryString(filters || {})}`),

  featured: (limit = 10) =>
    api.get<ApiResponse<Product[]>>(`/products/featured/?limit=${limit}`),

  trending: (limit = 10) =>
    api.get<ApiResponse<Product[]>>(`/products/trending/?limit=${limit}`),

  create: (data: CreateProductRequest) =>
    api.post<ApiResponse<Product>>("/products/", data),

  update: (id: string, data: Partial<CreateProductRequest>) =>
    api.patch<ApiResponse<Product>>(`/products/${id}/`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<{ success: boolean }>>(`/products/${id}/`),

  like: (id: string) =>
    api.post<ApiResponse<{ liked: boolean; likes: number }>>(`/products/${id}/like/`),

  unlike: (id: string) =>
    api.delete<ApiResponse<{ liked: boolean; likes: number }>>(`/products/${id}/like/`),

  uploadImages: (productId: string, files: File[]) => {
    const formData = new FormData()
    files.forEach((file) => formData.append("images", file))
    return apiClientFormData<ApiResponse<{ imageIds: string[] }>>(
      `/products/${productId}/images/`,
      formData
    )
  },

  deleteImage: (productId: string, imageId: string) =>
    api.delete<ApiResponse<{ success: boolean }>>(`/products/${productId}/images/${imageId}/`),

  reviews: (productId: string, page = 1, limit = 10) =>
    api.get<ReviewsResponse>(`/products/${productId}/reviews/?page=${page}&limit=${limit}`),

  createReview: (productId: string, data: CreateReviewRequest) =>
    api.post<ApiResponse<{ reviewId: string }>>(`/products/${productId}/reviews/`, data),
}
