"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuthStore } from "@/lib/stores/auth-store"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/models"
import { AlertCircle, BadgeCheck, Clock, HandCoins, Percent, Shield, Sparkles, Tag } from "lucide-react"
import Link from "next/link"

interface MakeOfferModalProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (amount: number, message?: string) => void
}

export function MakeOfferModal({ product, open, onOpenChange, onSubmit }: MakeOfferModalProps) {
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const { isAuthenticated } = useAuthStore()

  const offerAmount = Number.parseFloat(amount) || 0
  const percentageOfAsking = product.price > 0 ? (offerAmount / product.price) * 100 : 0
  const percentageDifference = 100 - percentageOfAsking
  const savingsAmount = product.price - offerAmount

  const isValidOffer = offerAmount >= product.price * 0.7 && offerAmount <= product.price * 0.99
  const canSubmit = isValidOffer && isAuthenticated

  // Quick offer suggestions
  const quickOffers = [
    { label: "10% off", percentage: 0.90 },
    { label: "15% off", percentage: 0.85 },
    { label: "20% off", percentage: 0.80 },
    { label: "25% off", percentage: 0.75 },
  ]

  const handleQuickOffer = (percentage: number) => {
    setAmount((product.price * percentage).toFixed(2))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (canSubmit) {
      onSubmit(offerAmount, message || undefined)
      setAmount("")
      setMessage("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                <HandCoins className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">Make an Offer</DialogTitle>
                <DialogDescription className="text-xs">Negotiate a better price with the seller</DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-5">
          {/* Product Info */}
          <div className="flex gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
            <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted shrink-0">
              <img
                src={product.images[0] || "/placeholder.svg?height=64&width=64"}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm line-clamp-2">{product.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-bold text-foreground">GH₵{product.price.toLocaleString()}</span>
                {product.compareAtPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    GH₵{product.compareAtPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Offer Buttons */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              Quick Offers
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {quickOffers.map((offer) => (
                <button
                  key={offer.label}
                  type="button"
                  onClick={() => handleQuickOffer(offer.percentage)}
                  className={cn(
                    "px-3 py-2 text-xs font-medium rounded-lg border transition-all",
                    offerAmount === Math.round(product.price * offer.percentage * 100) / 100
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted border-border/50 hover:border-border"
                  )}
                >
                  {offer.label}
                </button>
              ))}
            </div>
          </div>

          {/* Offer Amount */}
          <div className="space-y-2">
            <Label htmlFor="offer-amount" className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" />
              Your Offer Amount
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">GH₵</span>
              <Input
                id="offer-amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={cn(
                  "pl-12 text-xl h-14 font-semibold",
                  offerAmount > 0 && !isValidOffer && "border-red-500 focus-visible:ring-red-500",
                  offerAmount > 0 && isValidOffer && "border-emerald-500 focus-visible:ring-emerald-500",
                )}
                step="0.01"
                min="0"
              />
            </div>

            {/* Offer Feedback */}
            {offerAmount > 0 && (
              <div className={cn(
                "flex items-start gap-2 p-3 rounded-lg border",
                isValidOffer
                  ? "bg-emerald-500/5 border-emerald-500/20"
                  : "bg-red-500/5 border-red-500/20"
              )}>
                {isValidOffer ? (
                  <>
                    <Percent className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        {percentageDifference.toFixed(0)}% below asking price
                      </p>
                      <p className="text-xs text-muted-foreground">
                        You'll save GH₵{savingsAmount.toLocaleString()} if accepted
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-600 dark:text-red-400">
                        {offerAmount < product.price * 0.7
                          ? "Offer too low"
                          : "Offer too close to asking price"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Offers must be between 70% and 99% of asking price (GH₵{(product.price * 0.7).toLocaleString()} - GH₵{(product.price * 0.99).toLocaleString()})
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Optional Message */}
          <div className="space-y-2">
            <Label htmlFor="offer-message" className="flex items-center gap-1.5">
              Add a message
              <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Textarea
              id="offer-message"
              placeholder="Tell the seller why you're offering this price..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={150}
              rows={2}
              className="resize-none text-sm"
            />
            <p className="text-[10px] text-muted-foreground text-right">{message.length}/150</p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border/50">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Expires in 48hrs</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border/50">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Binding if accepted</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit}
              className="flex-1 bg-primary hover:bg-primary/90 gap-2"
            >
              <HandCoins className="h-4 w-4" />
              Submit Offer
            </Button>
          </div>

          {!isAuthenticated && (
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Please{" "}
                <Link href="/auth/login" className="font-medium underline underline-offset-2 hover:text-amber-700">
                  log in
                </Link>{" "}
                to make an offer
              </p>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
