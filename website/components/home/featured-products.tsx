import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/types/models"

// Mock data for demonstration
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
      email: "seller@uni.edu",
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
    tags: ["laptop", "apple", "macbook"],
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "2",
    title: "Calculus Textbook - Stewart 8th Edition",
    description: "Essential textbook for math majors",
    price: 85,
    images: ["/calculus-textbook.png"],
    category: { id: "2", name: "Books", slug: "books" },
    condition: "good",
    quantity: 1,
    status: "active",
    sellerId: "2",
    seller: {
      id: "2",
      email: "seller2@uni.edu",
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
    tags: ["textbook", "math"],
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "3",
    title: "Wireless Earbuds - Sony WF-1000XM4",
    description: "Premium noise cancelling earbuds",
    price: 650,
    compareAtPrice: 850,
    images: ["/wireless-earbuds-sony.jpg"],
    category: { id: "1", name: "Electronics", slug: "electronics" },
    condition: "new",
    quantity: 3,
    status: "active",
    sellerId: "3",
    seller: {
      id: "3",
      email: "seller3@uni.edu",
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
    tags: ["earbuds", "sony", "wireless"],
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "4",
    title: "Vintage Denim Jacket - Levi's",
    description: "Classic style denim jacket, size M",
    price: 120,
    images: ["/denim-jacket-vintage.jpg"],
    category: { id: "3", name: "Fashion", slug: "fashion" },
    condition: "good",
    quantity: 1,
    status: "active",
    sellerId: "4",
    seller: {
      id: "4",
      email: "seller4@uni.edu",
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
    tags: ["jacket", "fashion", "vintage"],
    createdAt: "",
    updatedAt: "",
  },
]

export function FeaturedProducts() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Featured Products</h2>
          <Link
            href="/products"
            className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
