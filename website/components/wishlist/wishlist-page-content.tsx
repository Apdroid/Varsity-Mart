"use client"

import Link from "next/link"
import { ChevronRight, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { mockWishlist } from "@/data/wishlist/wishlist"

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
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
