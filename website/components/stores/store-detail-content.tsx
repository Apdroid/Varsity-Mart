"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, BadgeCheck, MessageCircle, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCard } from "@/components/product-card"
import { mockStore, mockStoreProducts as mockProducts } from "@/data/stores/store-detail"

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
