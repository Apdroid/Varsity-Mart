"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/types/models"

const mockProducts: Product[] = [
  {
    id: "1",
    title: 'MacBook Pro 13" M2 - Perfect Condition',
    description: "Barely used MacBook Pro with Apple M2 chip",
    price: 4500,
    compareAtPrice: 5200,
    images: ["/silver-macbook-on-desk.png"],
    category: { id: "1", name: "Electronics", slug: "electronics" },
    condition: "like-new",
    quantity: 1,
    status: "active",
    sellerId: "1",
    seller: {
      id: "1",
      email: "s@uni.edu",
      firstName: "John",
      lastName: "Doe",
      role: "seller",
      isEmailVerified: true,
      isPhoneVerified: false,
      kycStatus: "approved",
      createdAt: "",
      updatedAt: "",
    },
    likesCount: 24,
    isLiked: false,
    tags: [],
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "2",
    title: "Calculus Textbook - Stewart 8th Edition",
    price: 85,
    description: "",
    images: ["/calculus-textbook.png"],
    category: { id: "2", name: "Books", slug: "books" },
    condition: "good",
    quantity: 1,
    status: "active",
    sellerId: "2",
    seller: {
      id: "2",
      email: "",
      firstName: "Jane",
      lastName: "Smith",
      role: "seller",
      isEmailVerified: true,
      isPhoneVerified: false,
      kycStatus: "approved",
      createdAt: "",
      updatedAt: "",
    },
    likesCount: 12,
    tags: [],
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "3",
    title: "Wireless Earbuds - Sony WF-1000XM4",
    price: 650,
    compareAtPrice: 850,
    description: "",
    images: ["/wireless-earbuds-sony.jpg"],
    category: { id: "1", name: "Electronics", slug: "electronics" },
    condition: "new",
    quantity: 3,
    status: "active",
    sellerId: "3",
    seller: {
      id: "3",
      email: "",
      firstName: "Mike",
      lastName: "Johnson",
      role: "seller",
      isEmailVerified: true,
      isPhoneVerified: false,
      kycStatus: "approved",
      createdAt: "",
      updatedAt: "",
    },
    likesCount: 45,
    isLiked: true,
    tags: [],
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "4",
    title: "Vintage Denim Jacket - Levi's",
    price: 120,
    description: "",
    images: ["/denim-jacket-vintage.jpg"],
    category: { id: "3", name: "Fashion", slug: "fashion" },
    condition: "good",
    quantity: 1,
    status: "active",
    sellerId: "4",
    seller: {
      id: "4",
      email: "",
      firstName: "Sarah",
      lastName: "Lee",
      role: "seller",
      isEmailVerified: true,
      isPhoneVerified: false,
      kycStatus: "approved",
      createdAt: "",
      updatedAt: "",
    },
    likesCount: 18,
    tags: [],
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "5",
    title: "Study Desk Lamp - LED",
    price: 75,
    description: "",
    images: ["/led-desk-lamp-modern.jpg"],
    category: { id: "6", name: "Dorm Essentials", slug: "home" },
    condition: "new",
    quantity: 5,
    status: "active",
    sellerId: "5",
    seller: {
      id: "5",
      email: "",
      firstName: "Alex",
      lastName: "Wong",
      role: "seller",
      isEmailVerified: true,
      isPhoneVerified: false,
      kycStatus: "approved",
      createdAt: "",
      updatedAt: "",
    },
    likesCount: 32,
    tags: [],
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "6",
    title: "Psychology 101 Notes Bundle",
    price: 25,
    description: "",
    images: ["/study-notes-notebook.jpg"],
    category: { id: "2", name: "Books", slug: "books" },
    condition: "new",
    quantity: 1,
    status: "active",
    sellerId: "6",
    seller: {
      id: "6",
      email: "",
      firstName: "Emma",
      lastName: "Davis",
      role: "seller",
      isEmailVerified: true,
      isPhoneVerified: false,
      kycStatus: "approved",
      createdAt: "",
      updatedAt: "",
    },
    likesCount: 56,
    tags: [],
    createdAt: "",
    updatedAt: "",
  },
]

export function ProductsPageContent() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Products</span>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">All Products</h1>
        <Link href="/search" className="text-sm text-emerald-600 hover:underline">
          Advanced Search
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
