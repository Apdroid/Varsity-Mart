export const API = {
  // Dashboard
  dashboard: {
    getStats: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        totalUsers: 1254,
        totalOrders: 8942,
        totalRevenue: 245680.50,
        activeRestaurants: 32,
        totalProducts: 2841,
        newUsersThisMonth: 156,
        ordersThisMonth: 892,
        revenueThisMonth: 45230.75,
      };
    },
    getRevenueChart: async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return [
        { month: "Jan", revenue: 32000 },
        { month: "Feb", revenue: 38000 },
        { month: "Mar", revenue: 28000 },
        { month: "Apr", revenue: 45000 },
        { month: "May", revenue: 52000 },
        { month: "Jun", revenue: 65000 },
      ];
    },
    getOrdersChart: async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return [
        { date: "Mon", orders: 240, revenue: 12400 },
        { date: "Tue", orders: 221, revenue: 11200 },
        { date: "Wed", orders: 229, revenue: 9800 },
        { date: "Thu", orders: 200, revenue: 9800 },
        { date: "Fri", orders: 478, revenue: 21800 },
        { date: "Sat", orders: 367, revenue: 18900 },
        { date: "Sun", orders: 200, revenue: 9800 },
      ];
    },
  },

  // Users
  users: {
    getAll: async (page: number = 1, limit: number = 10) => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return {
        data: [
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            type: "seller",
            status: "active",
            joinDate: "2024-01-15",
            orders: 45,
            revenue: 12500,
          },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            type: "buyer",
            status: "active",
            joinDate: "2024-02-10",
            orders: 23,
            revenue: 0,
          },
          {
            id: 3,
            name: "Mike Johnson",
            email: "mike@example.com",
            type: "restaurant",
            status: "suspended",
            joinDate: "2023-12-20",
            orders: 156,
            revenue: 45230,
          },
          {
            id: 4,
            name: "Sarah Williams",
            email: "sarah@example.com",
            type: "seller",
            status: "active",
            joinDate: "2024-01-05",
            orders: 67,
            revenue: 18900,
          },
          {
            id: 5,
            name: "Alex Brown",
            email: "alex@example.com",
            type: "buyer",
            status: "active",
            joinDate: "2024-01-20",
            orders: 12,
            revenue: 0,
          },
          {
            id: 6,
            name: "Emma Davis",
            email: "emma@example.com",
            type: "restaurant",
            status: "active",
            joinDate: "2024-01-08",
            orders: 89,
            revenue: 34560,
          },
          {
            id: 7,
            name: "David Martinez",
            email: "david@example.com",
            type: "seller",
            status: "active",
            joinDate: "2023-11-30",
            orders: 102,
            revenue: 28750,
          },
          {
            id: 8,
            name: "Lisa Anderson",
            email: "lisa@example.com",
            type: "buyer",
            status: "inactive",
            joinDate: "2023-10-15",
            orders: 5,
            revenue: 0,
          },
          {
            id: 9,
            name: "Tom Wilson",
            email: "tom@example.com",
            type: "restaurant",
            status: "active",
            joinDate: "2024-01-12",
            orders: 234,
            revenue: 67890,
          },
          {
            id: 10,
            name: "Rachel Green",
            email: "rachel@example.com",
            type: "seller",
            status: "active",
            joinDate: "2024-01-25",
            orders: 34,
            revenue: 9870,
          },
        ],
        total: 1254,
        page,
        pages: Math.ceil(1254 / limit),
      };
    },
    getById: async (id: number) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        id,
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        type: "seller",
        status: "active",
        joinDate: "2024-01-15",
        lastLogin: "2024-01-28",
        orders: 45,
        revenue: 12500,
        kyc: { status: "verified", verifiedAt: "2024-01-15" },
      };
    },
    updateStatus: async (id: number, status: string) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { success: true, message: `User status updated to ${status}` };
    },
  },

  // KYC
  kyc: {
    getPending: async (page: number = 1, limit: number = 10) => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return {
        data: [
          {
            id: 1,
            userId: 15,
            userName: "New Seller 1",
            type: "seller",
            submitDate: "2024-01-25",
            documents: ["id", "bank"],
            status: "pending",
          },
          {
            id: 2,
            userId: 28,
            userName: "Restaurant Inc",
            type: "restaurant",
            submitDate: "2024-01-24",
            documents: ["license", "bank", "tax"],
            status: "pending",
          },
          {
            id: 3,
            userId: 42,
            userName: "New Seller 2",
            type: "seller",
            submitDate: "2024-01-23",
            documents: ["id", "bank"],
            status: "pending",
          },
        ],
        total: 12,
        page,
        pages: Math.ceil(12 / limit),
      };
    },
    verify: async (id: number) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { success: true, message: "KYC verified successfully" };
    },
    reject: async (id: number, reason: string) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { success: true, message: "KYC rejected" };
    },
  },

  // Products
  products: {
    getAll: async (page: number = 1, limit: number = 10) => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return {
        data: [
          {
            id: 1,
            name: "Wireless Headphones",
            seller: "John Doe",
            category: "Electronics",
            price: 79.99,
            stock: 45,
            sales: 234,
            status: "active",
            addedDate: "2024-01-20",
          },
          {
            id: 2,
            name: "Laptop Stand",
            seller: "Sarah Williams",
            category: "Accessories",
            price: 29.99,
            stock: 0,
            sales: 156,
            status: "inactive",
            addedDate: "2024-01-18",
          },
          {
            id: 3,
            name: "USB Cable (Pack of 3)",
            seller: "John Doe",
            category: "Cables",
            price: 19.99,
            stock: 120,
            sales: 567,
            status: "active",
            addedDate: "2024-01-15",
          },
          {
            id: 4,
            name: "Phone Case",
            seller: "David Martinez",
            category: "Accessories",
            price: 14.99,
            stock: 87,
            sales: 345,
            status: "active",
            addedDate: "2024-01-22",
          },
          {
            id: 5,
            name: "Screen Protector",
            seller: "John Doe",
            category: "Accessories",
            price: 9.99,
            stock: 200,
            sales: 678,
            status: "active",
            addedDate: "2024-01-10",
          },
        ],
        total: 2841,
        page,
        pages: Math.ceil(2841 / limit),
      };
    },
    updateStatus: async (id: number, status: string) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { success: true, message: `Product status updated to ${status}` };
    },
  },

  // Orders
  orders: {
    getAll: async (page: number = 1, limit: number = 10) => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return {
        data: [
          {
            id: "ORD-001",
            customer: "John Doe",
            total: 129.98,
            items: 3,
            status: "delivered",
            date: "2024-01-25",
            seller: "Various",
          },
          {
            id: "ORD-002",
            customer: "Jane Smith",
            total: 79.99,
            items: 1,
            status: "processing",
            date: "2024-01-25",
            seller: "John Doe",
          },
          {
            id: "ORD-003",
            customer: "Mike Johnson",
            total: 249.97,
            items: 5,
            status: "shipped",
            date: "2024-01-24",
            seller: "Sarah Williams",
          },
          {
            id: "ORD-004",
            customer: "Sarah Williams",
            total: 59.98,
            items: 2,
            status: "pending",
            date: "2024-01-24",
            seller: "David Martinez",
          },
          {
            id: "ORD-005",
            customer: "Alex Brown",
            total: 199.96,
            items: 4,
            status: "delivered",
            date: "2024-01-23",
            seller: "John Doe",
          },
        ],
        total: 8942,
        page,
        pages: Math.ceil(8942 / limit),
      };
    },
    getById: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        id,
        customer: "John Doe",
        email: "john@example.com",
        items: [
          { name: "Wireless Headphones", qty: 1, price: 79.99 },
          { name: "USB Cable", qty: 2, price: 19.99 },
        ],
        subtotal: 119.98,
        shipping: 10.0,
        tax: 10.42,
        total: 140.4,
        status: "processing",
        shippingAddress: "123 Main St, City, State 12345",
        paymentMethod: "Credit Card",
        date: "2024-01-25",
      };
    },
    updateStatus: async (id: string, status: string) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { success: true, message: `Order status updated to ${status}` };
    },
  },

  // Restaurants
  restaurants: {
    getAll: async (page: number = 1, limit: number = 10) => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return {
        data: [
          {
            id: 1,
            name: "Pizza Palace",
            owner: "Tom Wilson",
            cuisine: "Italian",
            rating: 4.8,
            orders: 234,
            status: "active",
            joinDate: "2024-01-12",
            commission: "12%",
          },
          {
            id: 2,
            name: "Sushi Master",
            owner: "Emma Davis",
            cuisine: "Japanese",
            rating: 4.6,
            orders: 189,
            status: "active",
            joinDate: "2024-01-08",
            commission: "15%",
          },
          {
            id: 3,
            name: "Burger King",
            owner: "Mike Johnson",
            cuisine: "American",
            rating: 4.2,
            orders: 156,
            status: "suspended",
            joinDate: "2023-12-20",
            commission: "12%",
          },
        ],
        total: 32,
        page,
        pages: Math.ceil(32 / limit),
      };
    },
  },

  // Categories
  categories: {
    getAll: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return [
        { id: 1, name: "Electronics", items: 456 },
        { id: 2, name: "Accessories", items: 892 },
        { id: 3, name: "Clothing", items: 234 },
        { id: 4, name: "Books", items: 567 },
        { id: 5, name: "Food", items: 345 },
      ];
    },
  },

  // Notifications
  notifications: {
    getAll: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return [
        {
          id: 1,
          type: "kyc",
          message: "5 pending KYC verifications",
          timestamp: "2024-01-25",
        },
        {
          id: 2,
          type: "order",
          message: "23 orders pending processing",
          timestamp: "2024-01-25",
        },
        {
          id: 3,
          type: "user",
          message: "New user registered",
          timestamp: "2024-01-25",
        },
      ];
    },
  },
};
