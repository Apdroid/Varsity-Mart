import type { User } from "./models"

// Generic API Response
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
}

// Auth
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export interface RegisterResponse {
  user: User
  accessToken: string
  refreshToken: string
}

// Products
export interface ProductFilters {
  page?: number
  limit?: number
  category?: string
  subcategory?: string
  minPrice?: number
  maxPrice?: number
  condition?: string
  sortBy?: "price" | "createdAt" | "popularity"
  sortOrder?: "asc" | "desc"
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
  tags?: string[]
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

// Orders
export interface OrderFilters {
  page?: number
  limit?: number
  status?: string
  startDate?: string
  endDate?: string
}

export interface CreateOrderRequest {
  items: {
    productId: string
    quantity: number
  }[]
  deliveryAddressId: string
  paymentMethodId: string
  notes?: string
}

export interface UpdateOrderStatusRequest {
  status: string
  note?: string
}

// Restaurants
export interface RestaurantFilters {
  page?: number
  limit?: number
  cuisine?: string
  minRating?: number
  isOpen?: boolean
  sortBy?: "rating" | "deliveryTime" | "deliveryFee"
}

export interface CreateFoodOrderRequest {
  restaurantId: string
  items: {
    menuItemId: string
    quantity: number
    selectedOptions?: Record<string, string[]>
    specialInstructions?: string
  }[]
  deliveryAddressId: string
  paymentMethodId: string
  notes?: string
}

// Chat
export interface SendMessageRequest {
  content: string
  type?: "text" | "image" | "product" | "order"
  metadata?: Record<string, unknown>
}

export interface StartConversationRequest {
  participantId: string
  productId?: string
  initialMessage?: string
}

// Payments
export interface InitiatePaymentRequest {
  orderId?: string
  foodOrderId?: string
  amount: number
  paymentMethodId: string
}

export interface PaymentResponse {
  paymentId: string
  status: string
  authorizationUrl?: string
}

// KYC
export interface SubmitStudentKYCRequest {
  studentId: string
  university: string
  documents: {
    type: string
    url: string
  }[]
}

export interface SubmitBusinessKYCRequest {
  businessName: string
  registrationNumber: string
  documents: {
    type: string
    url: string
  }[]
}

// Admin
export interface UserFilters {
  page?: number
  limit?: number
  role?: string
  kycStatus?: string
  search?: string
}

export interface ListingFilters {
  page?: number
  limit?: number
  status?: string
  category?: string
}

export interface DisputeFilters {
  page?: number
  limit?: number
  status?: string
}

export interface ResolveDisputeRequest {
  resolution: string
  action: "refund" | "release" | "split"
  refundAmount?: number
}
