"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, AlertCircle } from "lucide-react"
import { useAuthStore } from "@/lib/stores/auth.store"
import { CounterOfferModal } from "./counter-offer-modal"
import { OfferStatusBadge } from "./offer-status-badge"
import type { Offer } from "@/types/models"

// Mock offers data
const MOCK_OFFERS: Offer[] = [
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
]

export function OffersPageContent() {
  const { user } = useAuthStore()
  const [offers, setOffers] = useState<Offer[]>(MOCK_OFFERS)
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [isCounterModalOpen, setIsCounterModalOpen] = useState(false)

  const isSeller = user?.role === "seller"

  const handleAcceptOffer = (offerId: string) => {
    setOffers((prev) => prev.map((offer) => (offer.id === offerId ? { ...offer, status: "accepted" as const } : offer)))
    alert("Offer accepted! The buyer will be notified.")
  }

  const handleDeclineOffer = (offerId: string) => {
    setOffers((prev) => prev.map((offer) => (offer.id === offerId ? { ...offer, status: "declined" as const } : offer)))
  }

  const handleCounterOffer = (offer: Offer) => {
    setSelectedOffer(offer)
    setIsCounterModalOpen(true)
  }

  const handleSubmitCounter = (amount: number, message?: string) => {
    if (selectedOffer) {
      setOffers((prev) =>
        prev.map((offer) =>
          offer.id === selectedOffer.id
            ? {
                ...offer,
                status: "countered" as const,
                counterAmount: amount,
                counterMessage: message,
              }
            : offer,
        ),
      )
    }
  }

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diffMs = expiry.getTime() - now.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffHours < 0) return "Expired"
    if (diffHours < 1) return "Less than 1 hour"
    return `${diffHours} hours`
  }

  const getPercentageDifference = (offer: Offer) => {
    return Math.round(((offer.product.price - offer.amount) / offer.product.price) * 100)
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Login Required</h2>
          <p className="text-muted-foreground mb-4">Please log in to view your offers</p>
          <Button asChild>
            <a href="/auth/login">Log In</a>
          </Button>
        </div>
      </div>
    )
  }

  if (!isSeller) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Seller Account Required</h2>
          <p className="text-muted-foreground">This page is only accessible to sellers</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Offers & Negotiations</h1>
          <p className="text-muted-foreground">Manage offers from potential buyers</p>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">
              Active Offers ({offers.filter((o) => o.status === "pending" || o.status === "countered").length})
            </TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {offers.filter((o) => o.status === "pending" || o.status === "countered").length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No active offers</p>
              </Card>
            ) : (
              offers
                .filter((o) => o.status === "pending" || o.status === "countered")
                .map((offer) => (
                  <Card key={offer.id} className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Product Info */}
                      <div className="flex gap-3 flex-1">
                        <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted shrink-0">
                          <img
                            src={offer.product.images[0] || "/placeholder.svg"}
                            alt={offer.product.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold line-clamp-1">{offer.product.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Your price: GH₵{offer.product.price.toLocaleString()}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <OfferStatusBadge status={offer.status} />
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              Expires in {getTimeRemaining(offer.expiresAt)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Offer Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={offer.buyer.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {offer.buyer.firstName[0]}
                              {offer.buyer.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">
                              {offer.buyer.firstName} {offer.buyer.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">Verified Student</p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-2xl font-bold text-blue-600">GH₵{offer.amount.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">
                            {getPercentageDifference(offer)}% below your asking price
                          </p>
                        </div>

                        {offer.message && (
                          <div className="p-3 rounded-lg bg-muted/50 mb-4">
                            <p className="text-sm italic">"{offer.message}"</p>
                          </div>
                        )}

                        {offer.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleAcceptOffer(offer.id)}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              Accept Offer
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCounterOffer(offer)}
                              className="flex-1"
                            >
                              Counter
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeclineOffer(offer.id)}>
                              Decline
                            </Button>
                          </div>
                        )}

                        {offer.status === "countered" && (
                          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                              You countered with GH₵{offer.counterAmount?.toLocaleString()}
                            </p>
                            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                              Waiting for buyer's response...
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {offers.filter((o) => o.status === "accepted" || o.status === "declined" || o.status === "expired")
              .length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No offer history yet</p>
              </Card>
            ) : (
              offers
                .filter((o) => o.status === "accepted" || o.status === "declined" || o.status === "expired")
                .map((offer) => (
                  <Card key={offer.id} className="p-6 opacity-75">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-3">
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted shrink-0">
                          <img
                            src={offer.product.images[0] || "/placeholder.svg"}
                            alt={offer.product.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold line-clamp-1">{offer.product.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {offer.buyer.firstName} {offer.buyer.lastName} offered GH₵{offer.amount.toLocaleString()}
                          </p>
                          <OfferStatusBadge status={offer.status} className="mt-2" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {selectedOffer && (
        <CounterOfferModal
          offer={selectedOffer}
          open={isCounterModalOpen}
          onOpenChange={setIsCounterModalOpen}
          onSubmit={handleSubmitCounter}
        />
      )}
    </>
  )
}
