"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Percent, Zap, Tag } from "lucide-react"
import Link from "next/link"

export default function DealsPageContent() {
  const flashDeals = [
    {
      id: 1,
      name: "Wireless Earbuds Pro",
      originalPrice: 25000,
      salePrice: 15000,
      discount: 40,
      image: "/wireless-earbuds-white.jpg",
      endsIn: "2h 34m",
    },
    {
      id: 2,
      name: "Study Desk Lamp LED",
      originalPrice: 8500,
      salePrice: 4999,
      discount: 41,
      image: "/led-desk-lamp-modern.jpg",
      endsIn: "5h 12m",
    },
    {
      id: 3,
      name: "Laptop Stand Aluminum",
      originalPrice: 12000,
      salePrice: 7500,
      discount: 38,
      image: "/aluminum-laptop-stand.jpg",
      endsIn: "1h 45m",
    },
    {
      id: 4,
      name: "Portable Power Bank 20000mAh",
      originalPrice: 18000,
      salePrice: 11999,
      discount: 33,
      image: "/power-bank-black.jpg",
      endsIn: "3h 22m",
    },
  ]

  const categoryDeals = [
    {
      name: "Electronics",
      discount: "Up to 50% off",
      color: "bg-blue-600",
      href: "/search?category=electronics&sale=true",
    },
    {
      name: "Textbooks",
      discount: "Buy 2 Get 1 Free",
      color: "bg-green-600",
      href: "/search?category=textbooks&sale=true",
    },
    { name: "Fashion", discount: "Extra 20% off", color: "bg-pink-600", href: "/search?category=fashion&sale=true" },
    { name: "Room Essentials", discount: "From ₦999", color: "bg-orange-600", href: "/search?category=room&sale=true" },
  ]

  const weeklyDeals = [
    {
      id: 5,
      name: "Calculus Textbook 3rd Edition",
      originalPrice: 15000,
      salePrice: 9500,
      discount: 37,
      image: "/calculus-textbook-blue.jpg",
      seller: "BookWorm Store",
    },
    {
      id: 6,
      name: "Mechanical Keyboard RGB",
      originalPrice: 35000,
      salePrice: 24500,
      discount: 30,
      image: "/rgb-mechanical-keyboard.jpg",
      seller: "TechHub",
    },
    {
      id: 7,
      name: "Backpack Laptop 15inch",
      originalPrice: 22000,
      salePrice: 15400,
      discount: 30,
      image: "/laptop-backpack-black.jpg",
      seller: "Campus Gear",
    },
    {
      id: 8,
      name: "Wireless Mouse Ergonomic",
      originalPrice: 8000,
      salePrice: 5600,
      discount: 30,
      image: "/ergonomic-wireless-mouse.jpg",
      seller: "TechHub",
    },
    {
      id: 9,
      name: "Water Bottle 1L Insulated",
      originalPrice: 5500,
      salePrice: 3850,
      discount: 30,
      image: "/insulated-water-bottle.jpg",
      seller: "Campus Essentials",
    },
    {
      id: 10,
      name: "Desk Organizer Wood",
      originalPrice: 7000,
      salePrice: 4900,
      discount: 30,
      image: "/wooden-desk-organizer.png",
      seller: "Room Decor NG",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Deals & Offers</h1>
        <p className="text-muted-foreground">Don&apos;t miss out on these amazing discounts for students</p>
      </div>

      {/* Flash Deals */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold">Flash Deals</h2>
          <Badge variant="destructive" className="ml-2">
            Limited Time
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {flashDeals.map((deal) => (
            <Link key={deal.id} href={`/products/${deal.id}`}>
              <Card className="overflow-hidden group cursor-pointer">
                <div className="relative aspect-square bg-muted">
                  <img
                    src={deal.image || "/placeholder.svg"}
                    alt={deal.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <Badge className="absolute top-2 left-2 bg-red-500">-{deal.discount}%</Badge>
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {deal.endsIn}
                  </div>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium text-sm line-clamp-1">{deal.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-blue-600 font-bold">₦{deal.salePrice.toLocaleString()}</span>
                    <span className="text-muted-foreground text-sm line-through">
                      ₦{deal.originalPrice.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Category Deals Banner */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Tag className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Shop by Category</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categoryDeals.map((category) => (
            <Link key={category.name} href={category.href}>
              <Card
                className={`${category.color} text-white overflow-hidden cursor-pointer hover:opacity-90 transition-opacity`}
              >
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-1">{category.name}</h3>
                  <p className="text-white/90">{category.discount}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Weekly Deals */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Percent className="h-6 w-6 text-green-600" />
            <h2 className="text-2xl font-bold">Weekly Deals</h2>
          </div>
          <Link href="/search?sale=true">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {weeklyDeals.map((deal) => (
            <Link key={deal.id} href={`/products/${deal.id}`}>
              <Card className="overflow-hidden group cursor-pointer h-full">
                <div className="relative aspect-square bg-muted">
                  <img
                    src={deal.image || "/placeholder.svg"}
                    alt={deal.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <Badge className="absolute top-2 left-2 bg-green-500">-{deal.discount}%</Badge>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium text-sm line-clamp-2 mb-1">{deal.name}</h3>
                  <p className="text-xs text-muted-foreground mb-1">{deal.seller}</p>
                  <div className="flex flex-col">
                    <span className="text-blue-600 font-bold text-sm">₦{deal.salePrice.toLocaleString()}</span>
                    <span className="text-muted-foreground text-xs line-through">
                      ₦{deal.originalPrice.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardContent className="py-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Never Miss a Deal</h3>
          <p className="opacity-90 mb-4">Subscribe to get exclusive offers and early access to sales</p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg text-foreground bg-background"
            />
            <Button className="bg-white text-blue-600 hover:bg-gray-100">Subscribe</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
