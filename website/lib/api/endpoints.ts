export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_VERIFICATION: "/auth/resend-verification",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    CHANGE_PASSWORD: "/auth/change-password",
  },

  // User Profile
  USER: {
    ME: "/users/me",
    UPDATE_PROFILE: "/users/me",
    UPLOAD_AVATAR: "/users/me/avatar",
    ADDRESSES: "/users/me/addresses",
    ADDRESS: (id: string) => `/users/me/addresses/${id}`,
  },

  // Products
  PRODUCTS: {
    LIST: "/products",
    DETAIL: (id: string) => `/products/${id}`,
    CREATE: "/products",
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
    LIKE: (id: string) => `/products/${id}/like`,
    CATEGORIES: "/products/categories",
    MY_PRODUCTS: "/products/my-products",
    SEARCH: "/products/search",
  },

  // Stores
  STORES: {
    LIST: "/stores",
    DETAIL: (id: string) => `/stores/${id}`,
    CREATE: "/stores",
    UPDATE: (id: string) => `/stores/${id}`,
    PRODUCTS: (id: string) => `/stores/${id}/products`,
    MY_STORE: "/stores/my-store",
  },

  // Orders
  ORDERS: {
    LIST: "/orders",
    DETAIL: (id: string) => `/orders/${id}`,
    CREATE: "/orders",
    UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    CONFIRM_DELIVERY: (id: string) => `/orders/${id}/confirm-delivery`,
    RATE: (id: string) => `/orders/${id}/rate`,
    MY_ORDERS: "/orders/my-orders",
    SELLER_ORDERS: "/orders/seller-orders",
  },

  // Restaurants
  RESTAURANTS: {
    LIST: "/restaurants",
    DETAIL: (id: string) => `/restaurants/${id}`,
    MENU: (id: string) => `/restaurants/${id}/menu`,
    CREATE: "/restaurants",
    UPDATE: (id: string) => `/restaurants/${id}`,
  },

  // Food Orders
  FOOD_ORDERS: {
    LIST: "/food-orders",
    DETAIL: (id: string) => `/food-orders/${id}`,
    CREATE: "/food-orders",
    UPDATE_STATUS: (id: string) => `/food-orders/${id}/status`,
    CANCEL: (id: string) => `/food-orders/${id}/cancel`,
  },

  // Chat
  CHAT: {
    CONVERSATIONS: "/chat/conversations",
    CONVERSATION: (id: string) => `/chat/conversations/${id}`,
    MESSAGES: (conversationId: string) => `/chat/conversations/${conversationId}/messages`,
    SEND_MESSAGE: (conversationId: string) => `/chat/conversations/${conversationId}/messages`,
    MARK_READ: (conversationId: string) => `/chat/conversations/${conversationId}/read`,
    START_CONVERSATION: "/chat/conversations/start",
  },

  // Payments
  PAYMENTS: {
    INITIATE: "/payments/initiate",
    VERIFY: (id: string) => `/payments/${id}/verify`,
    METHODS: "/payments/methods",
    ADD_METHOD: "/payments/methods",
    WALLET: "/payments/wallet",
    REQUEST_PAYOUT: "/payments/payout",
  },

  // KYC
  KYC: {
    SUBMIT_STUDENT: "/kyc/student",
    SUBMIT_BUSINESS: "/kyc/business",
    STATUS: "/kyc/status",
  },

  // Uploads
  UPLOADS: {
    PRODUCT_IMAGES: "/uploads/product-images",
    KYC_DOCUMENTS: "/uploads/kyc-documents",
    AVATAR: "/uploads/avatar",
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: "/notifications",
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: "/notifications/read-all",
    SETTINGS: "/notifications/settings",
  },

  // Admin
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    USER: (id: string) => `/admin/users/${id}`,
    SUSPEND_USER: (id: string) => `/admin/users/${id}/suspend`,
    LISTINGS: "/admin/listings",
    REVIEW_LISTING: (id: string) => `/admin/listings/${id}/review`,
    DISPUTES: "/admin/disputes",
    RESOLVE_DISPUTE: (id: string) => `/admin/disputes/${id}/resolve`,
  },

  // Night Shop
  NIGHT_SHOP: {
    PRODUCTS: "/night-shop/products",
    STORES: "/night-shop/stores",
  },
} as const
