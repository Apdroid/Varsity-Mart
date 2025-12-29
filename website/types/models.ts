// User Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  role: "buyer" | "seller" | "admin"
  isEmailVerified: boolean
  isPhoneVerified: boolean
  kycStatus: "pending" | "submitted" | "approved" | "rejected"
  createdAt: string
  updatedAt: string
}

export interface Address {
  id: string
  userId: string
  label: string
  street: string
  city: string
  state: string
  country: string
  postalCode: string
  isDefault: boolean
  latitude?: number
  longitude?: number
}

// Product Types
export interface Product {
  id: string
  title: string
  description: string
  price: number
  compareAtPrice?: number
  images: string[]
  category: Category
  subcategory?: string
  condition: "new" | "like-new" | "good" | "fair"
  quantity: number
  status: "draft" | "active" | "sold" | "archived"
  sellerId: string
  seller: User
  storeId?: string
  store?: Store
  likesCount: number
  isLiked?: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  subcategories?: string[]
}

// Store Types
export interface Store {
  id: string
  name: string
  description: string
  logo?: string
  banner?: string
  ownerId: string
  owner: User
  rating: number
  reviewsCount: number
  productsCount: number
  isVerified: boolean
  isOpen: boolean
  operatingHours?: OperatingHours
  location?: Address
  createdAt: string
  updatedAt: string
}

export interface OperatingHours {
  monday: DayHours
  tuesday: DayHours
  wednesday: DayHours
  thursday: DayHours
  friday: DayHours
  saturday: DayHours
  sunday: DayHours
}

export interface DayHours {
  isOpen: boolean
  open?: string
  close?: string
}

// Order Types
export interface Order {
  id: string
  orderNumber: string
  buyerId: string
  buyer: User
  sellerId: string
  seller: User
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  serviceFee: number
  total: number
  status: OrderStatus
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  paymentMethod: string
  deliveryAddress: Address
  trackingNumber?: string
  notes?: string
  cancelReason?: string
  rating?: number
  review?: string
  timeline: OrderTimeline[]
  createdAt: string
  updatedAt: string
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "refunded"

export interface OrderItem {
  id: string
  productId: string
  product: Product
  quantity: number
  price: number
  total: number
}

export interface OrderTimeline {
  status: OrderStatus
  timestamp: string
  note?: string
}

// Restaurant Types
export interface Restaurant {
  id: string
  name: string
  description: string
  logo?: string
  banner?: string
  cuisine: string[]
  rating: number
  reviewsCount: number
  deliveryTime: string
  deliveryFee: number
  minOrder: number
  tags?: string[]
  isOpen: boolean
  operatingHours?: OperatingHours
  location: Address
  ownerId: string
  owner: User
  createdAt: string
  updatedAt: string
}

export interface MenuItem {
  id: string
  restaurantId: string
  name: string
  description: string
  price: number
  image?: string
  category: string
  isAvailable: boolean
  preparationTime: string
  options?: MenuItemOption[]
}

export interface MenuItemOption {
  name: string
  choices: {
    name: string
    price: number
  }[]
  required: boolean
  maxSelections?: number
}

export interface FoodOrder {
  id: string
  orderNumber: string
  buyerId: string
  buyer: User
  restaurantId: string
  restaurant: Restaurant
  items: FoodOrderItem[]
  subtotal: number
  deliveryFee: number
  serviceFee: number
  total: number
  status: FoodOrderStatus
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  deliveryAddress: Address
  estimatedDeliveryTime?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export type FoodOrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "picked_up" | "delivered" | "cancelled"

export interface FoodOrderItem {
  id: string
  menuItemId: string
  menuItem: MenuItem
  quantity: number
  price: number
  total: number
  selectedOptions?: Record<string, string[]>
  specialInstructions?: string
}

// Chat Types
export interface Conversation {
  id: string
  participants: User[]
  lastMessage?: Message
  unreadCount: number
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  sender: User
  content: string
  type: "text" | "image" | "product" | "order"
  metadata?: Record<string, unknown>
  isRead: boolean
  createdAt: string
}

// Payment Types
export interface PaymentMethod {
  id: string
  userId: string
  type: "card" | "bank" | "wallet"
  last4?: string
  brand?: string
  bankName?: string
  isDefault: boolean
}

export interface Wallet {
  id: string
  userId: string
  balance: number
  currency: string
  pendingBalance: number
}

export interface Transaction {
  id: string
  userId: string
  type: "credit" | "debit"
  amount: number
  currency: string
  status: "pending" | "completed" | "failed"
  description: string
  reference?: string
  createdAt: string
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  body: string
  data?: Record<string, unknown>
  isRead: boolean
  createdAt: string
}

export type NotificationType = "order_update" | "new_message" | "promotion" | "kyc_update" | "payment" | "system"

// KYC Types
export interface KYCSubmission {
  id: string
  userId: string
  type: "student" | "business"
  status: "pending" | "approved" | "rejected"
  documents: KYCDocument[]
  rejectionReason?: string
  submittedAt: string
  reviewedAt?: string
}

export interface KYCDocument {
  type: string
  url: string
  uploadedAt: string
}

// Admin Types
export interface DashboardStats {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  newUsersToday: number
  ordersToday: number
  pendingKYC: number
  openDisputes: number
}

export interface Dispute {
  id: string
  orderId: string
  order: Order
  reporterId: string
  reporter: User
  reason: string
  description: string
  status: "open" | "investigating" | "resolved" | "closed"
  resolution?: string
  createdAt: string
  resolvedAt?: string
}

// Offer Types for Make an Offer feature
export interface Offer {
  id: string
  productId: string
  product: Product
  buyerId: string
  buyer: User
  sellerId: string
  amount: number
  message?: string
  status: "pending" | "countered" | "accepted" | "declined" | "expired"
  counterAmount?: number
  counterMessage?: string
  expiresAt: string
  createdAt: string
  updatedAt: string
}
