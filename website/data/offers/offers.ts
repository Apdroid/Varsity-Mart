import type { Offer } from "@/types/models";

export const MOCK_OFFERS: Offer[] = [
  {
    id: "offer-1",
    productId: "1",
    product: {
      id: "1",
      title: 'MacBook Pro 13" M2 2023',
      price: 4500,
      images: ["/silver-macbook-on-desk.png"],
    } as any,
    buyerId: "buyer-1",
    buyer: {
      id: "buyer-1",
      firstName: "Sarah",
      lastName: "Asante",
      avatar: "/female-student-portrait.png",
    } as any,
    sellerId: "seller-1",
    amount: 3800,
    message: "I'm a student on a budget. Would really appreciate if you could accept this offer!",
    status: "pending",
    expiresAt: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "offer-2",
    productId: "2",
    product: {
      id: "2",
      title: "iPhone 14 Pro Max 256GB",
      price: 3200,
      images: ["/placeholder.svg?height=100&width=100"],
    } as any,
    buyerId: "buyer-2",
    buyer: {
      id: "buyer-2",
      firstName: "Michael",
      lastName: "Osei",
      avatar: "/placeholder.svg?height=40&width=40",
    } as any,
    sellerId: "seller-1",
    amount: 2900,
    message: "Can we meet on campus? I can pay cash.",
    status: "pending",
    expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
];

