import { api } from "./client"
import type { ApiResponse, Review } from "./types"

export const reviewsApi = {
  get: (reviewId: string) =>
    api.get<ApiResponse<Review>>(`/reviews/${reviewId}/`),

  update: (reviewId: string, data: { rating: number; review: string }) =>
    api.put<ApiResponse<Review>>(`/reviews/${reviewId}/`, data),

  delete: (reviewId: string) =>
    api.delete<ApiResponse<null>>(`/reviews/${reviewId}/`),

  markHelpful: (reviewId: string) =>
    api.post<ApiResponse<{ helpfulCount: number }>>(`/reviews/${reviewId}/helpful/`),
}
