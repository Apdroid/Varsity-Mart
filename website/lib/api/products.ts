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
import { buildQueryString } from "./query-string"

function buildProductFormData(data: Partial<CreateProductRequest>): FormData {
  const fd = new FormData()
  if (data.title !== undefined) fd.append("title", data.title)
  if (data.description !== undefined) fd.append("description", data.description)
  if (data.price !== undefined) fd.append("price", String(data.price))
  if (data.original_price !== undefined) fd.append("original_price", String(data.original_price))
  if (data.category !== undefined) fd.append("category", data.category)
  if (data.condition !== undefined) fd.append("condition", data.condition)
  if (data.location !== undefined) fd.append("location", data.location)
  if (data.is_night_shop !== undefined) fd.append("is_night_shop", String(data.is_night_shop))
  if (data.stock !== undefined) fd.append("stock", String(data.stock))
  if (data.storeId !== undefined) fd.append("storeId", data.storeId)
  if (data.delivery_options !== undefined) {
    data.delivery_options.forEach((opt) => fd.append("delivery_options", opt))
  }
  if (data.specifications?.length) {
    fd.append("specifications", JSON.stringify(data.specifications))
  }
  data.images?.forEach((file) => fd.append("images", file))
  return fd
}

export const productsApi = {
  list: (filters?: ProductFilters) =>
    api.get<ProductsListResponse>(`/products/${buildQueryString(filters || {})}`),

  get: (id: string) =>
    api.get<ApiResponse<ProductDetail>>(`/products/${id}/`),

  myProducts: (filters?: ProductFilters) =>
    api.get<ProductsListResponse>(`/products/my-products/${buildQueryString(filters || {})}`),

  featured: (limit = 10, campus?: string) =>
    api.get<ApiResponse<Product[]>>(`/products/featured/${buildQueryString({ limit, campus })}`),

  create: (data: CreateProductRequest) =>
    apiClientFormData<ApiResponse<Product>>("/products/", buildProductFormData(data)),

  update: (id: string, data: Partial<CreateProductRequest>) =>
    apiClientFormData<ApiResponse<Product>>(
      `/products/${id}/`,
      buildProductFormData(data),
      { method: "PATCH" }
    ),

  delete: (id: string) =>
    api.delete<ApiResponse<{ success: boolean }>>(`/products/${id}/`),

  like: (id: string) =>
    api.post<ApiResponse<{ liked: boolean; likes: number }>>(`/products/${id}/like/`),

  // The API exposes a single toggle endpoint: POST likes, and POST again unlikes.
  unlike: (id: string) =>
    api.post<ApiResponse<{ liked: boolean; likes: number }>>(`/products/${id}/like/`),

  uploadImages: (productId: string, files: File[]) => {
    const formData = new FormData()
    files.forEach((file) => formData.append("images", file))
    return apiClientFormData<ApiResponse<{ imageIds: string[] }>>(
      `/products/${productId}/upload_images/`,
      formData
    )
  },

  deleteImage: (imageId: string) =>
    api.delete<ApiResponse<{ success: boolean }>>(`/product-images/${imageId}/`),

  reviews: (productId: string, page = 1, limit = 10) =>
    api.get<ReviewsResponse>(`/products/${productId}/reviews/?page=${page}&limit=${limit}`),

  createReview: (productId: string, data: CreateReviewRequest) =>
    api.post<ApiResponse<{ reviewId: string }>>(`/products/${productId}/reviews/`, data),
}
