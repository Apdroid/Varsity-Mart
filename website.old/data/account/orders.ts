
export const mockOrders = [
  {
    id: "ORD-001",
    orderNumber: "VM-2024-001",
    status: "delivered",
    date: "Jan 10, 2024",
    total: 4500,
    items: [{ name: 'MacBook Pro 13" M2', image: "/silver-macbook-on-desk.png", price: 4500, quantity: 1 }],
  },
  {
    id: "ORD-002",
    orderNumber: "VM-2024-002",
    status: "shipped",
    date: "Jan 8, 2024",
    total: 650,
    items: [{ name: "Wireless Earbuds - Sony", image: "/wireless-earbuds-sony.jpg", price: 650, quantity: 1 }],
  },
  {
    id: "ORD-003",
    orderNumber: "VM-2024-003",
    status: "processing",
    date: "Jan 5, 2024",
    total: 85,
    items: [{ name: "Calculus Textbook", image: "/calculus-textbook.png", price: 85, quantity: 1 }],
  },
  {
    id: "ORD-004",
    orderNumber: "VM-2024-004",
    status: "cancelled",
    date: "Jan 2, 2024",
    total: 120,
    items: [{ name: "Vintage Denim Jacket", image: "/denim-jacket-vintage.jpg", price: 120, quantity: 1 }],
  },
]

import { orderStatusColors } from "@/data/shared/status-colors";

export const statusColors = orderStatusColors;
