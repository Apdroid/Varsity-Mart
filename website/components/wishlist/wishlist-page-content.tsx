"use client"

import Link from "next/link"
import { ChevronRight, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/types/models"

const mockWishlist: Product[] = [
  {
    id: "1",
    title: 'MacBook Pro 13" M2',
    price: 4500,
    compareAtPrice: 5200,
    description: "",
    images: ["/silver-macbook-on-desk.png"],
    category: { id: "1", name: "Electronics", slug: "electronics" },
    condition: "like-new",
    quantity: 1,
    status: "active",
    sellerId: "1",
    seller: {
      id: "1",
      email: "",
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
    isLiked: true,
    tags: [],
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "3",
    title: "Wireless Earbuds - Sony",
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
      lastName: "J",
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
]

export function WishlistPageContent() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Wishlist</span>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">My Wishlist</h1>
        <span className="text-muted-foreground">{mockWishlist.length} items</span>
      </div>

      {mockWishlist.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockWishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg text-foreground mb-2">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-4">Save items you love to your wishlist</p>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
