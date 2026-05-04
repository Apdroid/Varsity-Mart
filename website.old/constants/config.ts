export const APP_CONFIG = {
  name: "VarsityMart",
  description: "The student marketplace for buying, selling, and discovering campus deals",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://varsitymart.com",

  // API
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.varsitymart.org/v1",
  wsBaseUrl: process.env.NEXT_PUBLIC_WS_BASE_URL || "wss://api.varsitymart.org",

  // Pagination
  defaultPageSize: 20,
  maxPageSize: 50,

  // Upload limits
  maxProductImages: 5,
  maxImageSize: 2 * 1024 * 1024, // 2MB
  maxDocumentSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ["image/jpeg", "image/png", "image/webp"],
  allowedDocumentTypes: ["image/jpeg", "image/png", "application/pdf"],

  // Session
  accessTokenKey: "accessToken",
  refreshTokenKey: "refreshToken",

  // Cache times (in milliseconds)
  cacheTime: {
    short: 1000 * 60, // 1 minute
    medium: 1000 * 60 * 5, // 5 minutes
    long: 1000 * 60 * 60, // 1 hour
    categories: 1000 * 60 * 60 * 24, // 24 hours
  },
} as const

export const ROUTE_PATHS = {
  home: "/",
  login: "/auth/login",
  register: "/auth/register",
  verifyEmail: "/auth/verify-email",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",

  // Products
  products: "/products",
  product: (id: string) => `/products/${id}`,

  // Stores
  stores: "/stores",
  store: (id: string) => `/stores/${id}`,

  // Restaurants
  restaurants: "/restaurants",
  restaurant: (id: string) => `/restaurants/${id}`,

  // Orders
  orders: "/orders",
  order: (id: string) => `/orders/${id}`,

  // Cart & Checkout
  cart: "/cart",
  checkout: "/checkout",

  // Chat
  chat: "/chat",
  conversation: (id: string) => `/chat/${id}`,

  // Profile
  profile: "/profile",
  editProfile: "/profile/edit",
  settings: "/profile/settings",
  addresses: "/profile/addresses",

  // KYC
  studentKYC: "/kyc/student",
  businessKYC: "/kyc/business",

  // Seller
  sellerDashboard: "/seller/dashboard",
  createProduct: "/seller/products/new",
  editProduct: (id: string) => `/seller/products/${id}/edit`,
  createStore: "/seller/store/create",
  manageStore: "/seller/store/manage",

  // Admin
  adminDashboard: "/admin/dashboard",
  adminUsers: "/admin/users",
  adminListings: "/admin/listings",
  adminDisputes: "/admin/disputes",

  // Other
  nightShop: "/nightshop",
} as const
