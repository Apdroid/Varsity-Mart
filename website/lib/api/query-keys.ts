export const queryKeys = {
  // Auth
  auth: {
    all: ["auth"] as const,
    user: () => [...queryKeys.auth.all, "user"] as const,
  },

  // User Profile
  user: {
    all: ["user"] as const,
    profile: () => [...queryKeys.user.all, "profile"] as const,
    addresses: () => [...queryKeys.user.all, "addresses"] as const,
  },

  // Products
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (filters: unknown) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    categories: () => [...queryKeys.products.all, "categories"] as const,
    myProducts: () => [...queryKeys.products.all, "my-products"] as const,
    search: (query: string, filters?: unknown) => [...queryKeys.products.all, "search", query, filters] as const,
  },

  // Stores
  stores: {
    all: ["stores"] as const,
    lists: () => [...queryKeys.stores.all, "list"] as const,
    list: (filters: unknown) => [...queryKeys.stores.lists(), filters] as const,
    details: () => [...queryKeys.stores.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.stores.details(), id] as const,
    products: (storeId: string, filters?: unknown) => [...queryKeys.stores.detail(storeId), "products", filters] as const,
    myStore: () => [...queryKeys.stores.all, "my-store"] as const,
  },

  // Orders
  orders: {
    all: ["orders"] as const,
    lists: () => [...queryKeys.orders.all, "list"] as const,
    list: (filters: unknown) => [...queryKeys.orders.lists(), filters] as const,
    details: () => [...queryKeys.orders.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.orders.details(), id] as const,
    myOrders: () => [...queryKeys.orders.all, "my-orders"] as const,
    sellerOrders: () => [...queryKeys.orders.all, "seller-orders"] as const,
  },

  // Restaurants
  restaurants: {
    all: ["restaurants"] as const,
    lists: () => [...queryKeys.restaurants.all, "list"] as const,
    list: (filters: unknown) => [...queryKeys.restaurants.lists(), filters] as const,
    details: () => [...queryKeys.restaurants.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.restaurants.details(), id] as const,
    menu: (restaurantId: string) => [...queryKeys.restaurants.detail(restaurantId), "menu"] as const,
  },

  // Food Orders
  foodOrders: {
    all: ["food-orders"] as const,
    lists: () => [...queryKeys.foodOrders.all, "list"] as const,
    list: (filters: unknown) => [...queryKeys.foodOrders.lists(), filters] as const,
    details: () => [...queryKeys.foodOrders.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.foodOrders.details(), id] as const,
  },

  // Chat
  chat: {
    all: ["chat"] as const,
    conversations: () => [...queryKeys.chat.all, "conversations"] as const,
    conversation: (id: string) => [...queryKeys.chat.conversations(), id] as const,
    messages: (conversationId: string) => [...queryKeys.chat.conversation(conversationId), "messages"] as const,
  },

  // Notifications
  notifications: {
    all: ["notifications"] as const,
    list: () => [...queryKeys.notifications.all, "list"] as const,
    unreadCount: () => [...queryKeys.notifications.all, "unread-count"] as const,
  },

  // Payments
  payments: {
    all: ["payments"] as const,
    methods: () => [...queryKeys.payments.all, "methods"] as const,
    wallet: () => [...queryKeys.payments.all, "wallet"] as const,
  },

  // KYC
  kyc: {
    all: ["kyc"] as const,
    status: () => [...queryKeys.kyc.all, "status"] as const,
  },

  // Admin
  admin: {
    all: ["admin"] as const,
    dashboard: () => [...queryKeys.admin.all, "dashboard"] as const,
    users: (filters: unknown) => [...queryKeys.admin.all, "users", filters] as const,
    listings: (filters: unknown) => [...queryKeys.admin.all, "listings", filters] as const,
    disputes: (filters: unknown) => [...queryKeys.admin.all, "disputes", filters] as const,
  },
}
