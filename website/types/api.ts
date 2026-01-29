// API Request/Response Types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
  phone?: string
  avatar?: string
}

export interface AuthResponse {
  user: import("./models").User
  token: string
}

export interface LoginResponse extends AuthResponse {}

export interface RegisterResponse extends AuthResponse {}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface SendMessageRequest {
  conversationId: string
  content: string
  type?: "text" | "image" | "product" | "order"
  metadata?: Record<string, unknown>
}

export interface StartConversationRequest {
  participantId: string
  initialMessage?: string
}

export interface ProductFilters extends PaginationParams {
  category?: string
  condition?: string
  minPrice?: number
  maxPrice?: number
  search?: string
}

export interface CreateProductRequest {
  title: string
  description: string
  price: number
  compareAtPrice?: number
  images: string[]
  categoryId: string
  subcategory?: string
  condition: "new" | "like-new" | "good" | "fair"
  quantity: number
  storeId?: string
  tags?: string[]
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string
}

export interface OrderFilters extends PaginationParams {
  status?: string
  buyerId?: string
  sellerId?: string
}

export interface CreateOrderRequest {
  items: Array<{
    productId: string
    quantity: number
  }>
  deliveryAddressId: string
  paymentMethodId: string
  notes?: string
}

export interface UserFilters extends PaginationParams {
  role?: string
  kycStatus?: string
  search?: string
}

export interface ListingFilters extends PaginationParams {
  status?: string
  category?: string
  search?: string
}

export interface DisputeFilters extends PaginationParams {
  status?: string
  search?: string
}

export interface ResolveDisputeRequest {
  disputeId: string
  resolution: string
  action: "resolve" | "close"
}
