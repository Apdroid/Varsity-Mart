import { api, apiClientFormData } from "./client"
import type {
  ApiResponse,
  StoreListItem,
  StoreDetail,
  StoreFilters,
  StoresListResponse,
  FeaturedResponse,
  Product,
  ProductsListResponse,
  ReviewsResponse,
  CreateStoreRequest,
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

export const storesApi = {
  list: (filters?: StoreFilters) =>
    api.get<StoresListResponse>(`/stores/${buildQueryString(filters || {})}`),

  get: (id: string) =>
    api.get<ApiResponse<StoreDetail>>(`/stores/${id}/`),

  featured: (limit = 10) =>
    api.get<FeaturedResponse<StoreListItem>>(`/stores/featured/?limit=${limit}`),

  myStore: () =>
    api.get<ApiResponse<StoreDetail>>("/stores/my-store/"),

  create: (data: CreateStoreRequest) => {
    const formData = new FormData()
    formData.append("storeName", data.storeName)
    formData.append("description", data.description)
    formData.append("category", data.category)
    formData.append("location", data.location)
    if (data.universityId) formData.append("universityId", data.universityId)
    if (data.campusId) formData.append("campusId", data.campusId)
    formData.append("deliveryFee", String(data.deliveryFee))
    formData.append("minOrder", String(data.minOrder))
    if (data.phone) formData.append("phone", data.phone)
    if (data.openingTime) formData.append("openingTime", data.openingTime)
    if (data.closingTime) formData.append("closingTime", data.closingTime)
    if (data.logo) formData.append("logo", data.logo)
    if (data.banner) formData.append("banner", data.banner)
    if (data.migrateProducts) formData.append("migrateProducts", "true")
    return apiClientFormData<ApiResponse<StoreDetail>>("/stores/", formData)
  },

  update: (id: string, data: Partial<CreateStoreRequest>) =>
    api.patch<ApiResponse<StoreDetail>>(`/stores/${id}/`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<{ success: boolean }>>(`/stores/${id}/`),

  uploadLogo: (storeId: string, file: File) => {
    const formData = new FormData()
    formData.append("logo", file)
    return apiClientFormData<ApiResponse<{ logoUrl: string }>>(
      `/stores/${storeId}/logo/`,
      formData
    )
  },

  uploadBanner: (storeId: string, file: File) => {
    const formData = new FormData()
    formData.append("banner", file)
    return apiClientFormData<ApiResponse<{ bannerUrl: string }>>(
      `/stores/${storeId}/banner/`,
      formData
    )
  },

  products: (storeId: string, page = 1, limit = 20) =>
    api.get<ProductsListResponse>(`/stores/${storeId}/products/?page=${page}&limit=${limit}`),

  migrateProducts: (storeId: string, productIds: string[]) =>
    api.post<ApiResponse<{ migratedCount: number }>>(`/stores/${storeId}/migrate-products/`, {
      product_ids: productIds,
    }),

  renewSubscription: (storeId: string) =>
    api.post<ApiResponse<{ subscriptionEnds: string }>>(`/stores/${storeId}/renew/`),

  reviews: (storeId: string, page = 1, limit = 10) =>
    api.get<ReviewsResponse>(`/stores/${storeId}/reviews/?page=${page}&limit=${limit}`),

  createReview: (storeId: string, data: CreateReviewRequest) =>
    api.post<ApiResponse<{ reviewId: string }>>(`/stores/${storeId}/reviews/`, data),
}
