"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Minus, Plus, Trash2, ShoppingBag, Shield, Truck, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/lib/stores/cart.store"
import type { Product } from "@/types/models"

// Mock cart items with product details
const mockCartItems = [
  {
    productId: "1",
    product: {
      id: "1",
      title: 'MacBook Pro 13" M2 - Perfect Condition',
      price: 4500,
      images: ["/silver-macbook-on-desk.png"],
      seller: { firstName: "John", lastName: "M" },
      store: { name: "TechDeals GH" },
    } as Product,
    quantity: 1,
    price: 4500,
  },
  {
    productId: "3",
    product: {
      id: "3",
      title: "Wireless Earbuds - Sony WF-1000XM4",
      price: 650,
      images: ["/wireless-earbuds-sony.jpg"],
      seller: { firstName: "Mike", lastName: "J" },
      store: { name: "TechDeals GH" },
    } as Product,
    quantity: 2,
    price: 650,
  },
]

export function CartPageContent() {
  const { items, removeItem, updateQuantity } = useCartStore()

  // Use mock data for display
  const cartItems = mockCartItems

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const deliveryFee = subtotal > 0 ? 25 : 0
  const serviceFee = subtotal > 0 ? Math.round(subtotal * 0.02) : 0
  const total = subtotal + deliveryFee + serviceFee

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Cart</span>
      </nav>

      <h1 className="text-2xl font-bold text-foreground mb-6">Shopping Cart</h1>

      {cartItems.length > 0 ? (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex gap-4 p-4 rounded-xl border border-border bg-card">
                {/* Product Image */}
                <Link href={`/products/${item.productId}`} className="shrink-0">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.product.title}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </Link>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.productId}`}
                    className="font-medium text-foreground hover:text-emerald-600 line-clamp-2 transition-colors"
                  >
                    {item.product.title}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sold by {item.product.store?.name || item.product.seller?.firstName}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent"
                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium text-foreground">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Price */}
                    <p className="font-bold text-foreground">GH₵{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => removeItem(item.productId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 py-4 mt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-5 w-5 text-emerald-600" />
                <span>Secure checkout with escrow protection</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-5 w-5 text-emerald-600" />
                <span>Campus-wide delivery available</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold text-lg text-foreground mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({cartItems.length} items)</span>
                  <span className="text-foreground">GH₵{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="text-foreground">GH₵{deliveryFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Fee (2%)</span>
                  <span className="text-foreground">GH₵{serviceFee}</span>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Promo Code */}
              <div className="flex gap-2 mb-4">
                <Input placeholder="Promo code" className="flex-1" />
                <Button variant="outline" className="bg-transparent">
                  Apply
                </Button>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-semibold text-lg mb-6">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">GH₵{total.toLocaleString()}</span>
              </div>

              <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2" size="lg">
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                By proceeding, you agree to our Terms of Service
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Looks like you haven&apos;t added anything to your cart yet.</p>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
