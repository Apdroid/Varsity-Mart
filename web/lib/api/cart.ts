import { api } from "./client"
import type {
  AddToCartRequest,
  ApiResponse,
  Cart,
  CartItem,
  UpdateCartItemRequest,
} from "./types"

export const cartApi = {
  get: () =>
    api.get<ApiResponse<Cart>>("/cart"),

  add: (data: AddToCartRequest) =>
    api.post<ApiResponse<CartItem>>("/cart/add", data),

  update: (itemId: string, data: UpdateCartItemRequest) =>
    api.patch<ApiResponse<CartItem>>(`/cart/${itemId}`, data),

  remove: (itemId: string) =>
    api.delete<ApiResponse<null>>(`/cart/${itemId}/remove`),

  clear: () =>
    api.delete<ApiResponse<null>>("/cart/clear"),
}
