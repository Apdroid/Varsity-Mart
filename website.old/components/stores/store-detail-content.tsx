"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, BadgeCheck, MessageCircle, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCard } from "@/components/product-card"
import type { Store, Product } from "@/types/models"

interface StoreDetailContentProps {
  storeId: string
  initialStore?: Store
  initialProducts?: Product[]
}

export function StoreDetailContent({ storeId, initialStore, initialProducts }: StoreDetailContentProps) {
  // Use initial data directly
  const store = initialStore;
  const storeProducts = initialProducts || [];

  const [activeTab, setActiveTab] = useState("products")
  
  if (!store) {
    return <div className="flex items-center justify-center py-20">
      <p className="text-muted-foreground">Store not found</p>
    </div>;
  }

  return (
    <div>
      {/* Banner */}
      <div className="relative h-48 md:h-64 bg-linear-to-br from-primary/20 to-primary/5">
        {store.banner && (
          <Image src={store.banner} alt={store.name} fill sizes="100vw" className="object-cover" />
        )}
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Store Header */}
        <div className="relative -mt-16 mb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="w-32 h-32 rounded-xl border-4 border-background bg-background overflow-hidden shrink-0 shadow-lg">
              <Image
                src={store.logo || "/placeholder.svg?height=128&width=128&query=store logo"}
                alt={store.name}
                width={128}
                height={128}
                className="object-cover"
              />
            </div>

            <div className="flex-1 pb-2">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-foreground">{store.name}</h1>
                {store.isVerified && <BadgeCheck className="h-5 w-5 text-primary" />}
                <Badge variant={store.isOpen ? "default" : "secondary"}>
                  {store.isOpen ? "Open" : "Closed"}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-3">{store.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-foreground">{store.rating}</span>
                  <span className="text-muted-foreground">({store.reviewsCount} reviews)</span>
                </div>
                <span className="text-muted-foreground">{store.productsCount} products</span>
                <span className="text-muted-foreground">Member since {new Date(store.createdAt).getFullYear()}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Contact
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            {storeProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {storeProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No products available yet
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="text-center py-12 text-muted-foreground">
              No reviews yet
            </div>
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <div className="max-w-2xl">
              <h3 className="font-semibold text-foreground mb-2">About {store.name}</h3>
              <p className="text-muted-foreground">{store.description}</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
