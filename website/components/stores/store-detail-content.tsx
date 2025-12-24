"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, BadgeCheck, MessageCircle, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCard } from "@/components/product-card"
import type { Store, Product } from "@/types/models"

const mockStore: Store = {
  id: "1",
  name: "TechDeals GH",
  description:
    "Premium gadgets and electronics at student-friendly prices. We specialize in laptops, phones, accessories, and gaming gear. All products are genuine with warranty support. Campus delivery available.",
  logo: "/tech-store-logo.png",
  banner: "/tech-store-banner-electronics.jpg",
  ownerId: "1",
  owner: {
    id: "1",
    email: "john@campus.edu",
    firstName: "John",
    lastName: "Mensah",
    role: "seller",
    isEmailVerified: true,
    isPhoneVerified: true,
    kycStatus: "approved",
    createdAt: "",
    updatedAt: "",
  },
  rating: 4.8,
  reviewsCount: 127,
  productsCount: 45,
  isVerified: true,
  isOpen: true,
  operatingHours: {
    monday: { isOpen: true, open: "09:00", close: "18:00" },
    tuesday: { isOpen: true, open: "09:00", close: "18:00" },
    wednesday: { isOpen: true, open: "09:00", close: "18:00" },
    thursday: { isOpen: true, open: "09:00", close: "18:00" },
    friday: { isOpen: true, open: "09:00", close: "18:00" },
    saturday: { isOpen: true, open: "10:00", close: "16:00" },
    sunday: { isOpen: false },
  },
  createdAt: "2023-01-15",
  updatedAt: "2024-01-01",
}

const mockProducts: Product[] = [
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
    seller: mockStore.owner,
    storeId: mockStore.id,
    store: mockStore,
    likesCount: 24,
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
    sellerId: "1",
    seller: mockStore.owner,
    storeId: mockStore.id,
    store: mockStore,
    likesCount: 45,
    tags: [],
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "5",
    title: "LED Desk Lamp",
    price: 75,
    description: "",
    images: ["/led-desk-lamp-modern.jpg"],
    category: { id: "6", name: "Electronics", slug: "electronics" },
    condition: "new",
    quantity: 5,
    status: "active",
    sellerId: "1",
    seller: mockStore.owner,
    storeId: mockStore.id,
    store: mockStore,
    likesCount: 32,
    tags: [],
    createdAt: "",
    updatedAt: "",
  },
]

interface StoreDetailContentProps {
  storeId: string
}

export function StoreDetailContent({ storeId }: StoreDetailContentProps) {
  const [activeTab, setActiveTab] = useState("products")

  return (
    <div>
      {/* Banner */}
      <div className="relative h-48 md:h-64 bg-gradient-to-br text-primary text-primary dark:text-primary dark:text-primary">
        {mockStore.banner && (
          <Image src={mockStore.banner || "/placeholder.svg"} alt={mockStore.name} fill className="object-cover" />
        )}
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Store Header */}
        <div className="relative -mt-16 mb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="w-32 h-32 rounded-xl border-4 border-background bg-background overflow-hidden shrink-0 shadow-lg">
              <Image
                src={mockStore.logo || "/placeholder.svg?height=128&width=128&query=store logo"}
                alt={mockStore.name}
                width={128}
                height={128}
                className="object-cover"
              />
            </div>

            <div className="flex-1 pb-2">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-foreground">{mockStore.name}</h1>
                {mockStore.isVerified && <BadgeCheck className="h-6 w-6 text-primary" />}
                <Badge variant={mockStore.isOpen ? "default" : "secondary"} className="ml-2">
                  {mockStore.isOpen ? "Open" : "Closed"}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-foreground">{mockStore.rating}</span>
                  <span>({mockStore.reviewsCount} reviews)</span>
                </div>
                <span>{mockStore.productsCount} products</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button size="sm" className="gap-2 text-slate-100 hover:text-slate-50">
                <MessageCircle className="h-4 w-4" />
                Contact
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="pb-12">
          <TabsList className="mb-6">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mockProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about">
            <div className="max-w-2xl space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">About This Store</h3>
                <p className="text-muted-foreground">{mockStore.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">Operating Hours</h3>
                <div className="space-y-2">
                  {Object.entries(mockStore.operatingHours || {}).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="capitalize text-muted-foreground">{day}</span>
                      <span className="text-foreground">
                        {hours.isOpen ? `${hours.open} - ${hours.close}` : "Closed"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Reviews coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
